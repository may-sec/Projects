import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type Hls from 'hls.js';
import { ICourse } from '../lib/dataUtils';
import { markVideoAsDone, isVideoDone } from '../lib/utils';

interface VideoPlayerProps {
  course: ICourse & { currentVideoIndex?: number };
  useVideoLinks?: boolean;
  baseUrl?: string;
}

export default function VideoPlayer({ course, useVideoLinks = false, baseUrl }: VideoPlayerProps) {
  const router = useRouter();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(course.currentVideoIndex || 0);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [wistiaLoaded, setWistiaLoaded] = useState(false);
  const [videoDone, setVideoDone] = useState(false);

  const currentVideo = course.videos[currentVideoIndex];
  
  // Get page name from router path
  const pageName = router.asPath || router.pathname;
  
  // Check if current video is marked as done
  useEffect(() => {
    if (currentVideo) {
      const done = isVideoDone(pageName, currentVideo.title);
      setVideoDone(done);
    }
  }, [currentVideo, pageName]);
  
  const handleMarkAsDone = () => {
    if (!currentVideo) return;
    
    const courseUrl = router.asPath || '';
    const teacherSlug = course.instructorSlug || course.teacherId || course.instructorname || '';
    markVideoAsDone(
      pageName,
      currentVideo.title,
      course.courseName,
      courseUrl,
      currentVideoIndex,
      course.imageofcourse,
      course.des,
      teacherSlug
    );
    setVideoDone(true);
  };

  // Extract Wistia video ID from URL
  const getWistiaVideoId = (url: string) => {
    // Handle different Wistia URL formats
    if (url.includes('fast.wistia.com/embed/medias/')) {
      return url.split('fast.wistia.com/embed/medias/')[1].split('/')[0].split('.')[0];
    }
    // If it's already just the video ID
    return url.split('.')[0];
  };

  // Extract Internet Archive video ID from URL
  const getArchiveVideoId = (url: string) => {
    // Handle different Internet Archive URL formats
    if (url.includes('archive.org/details/')) {
      return url.split('archive.org/details/')[1].split('?')[0].split('#')[0];
    }
    if (url.includes('archive.org/embed/')) {
      return url.split('archive.org/embed/')[1].split('?')[0].split('#')[0];
    }
    // If it's already just the video ID
    return url;
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setError(null);
    // Check if new video is done
    if (course.videos[index]) {
      const done = isVideoDone(pageName, course.videos[index].title);
      setVideoDone(done);
    }
  };

  // Load Wistia SDK when component mounts or when videoType is wistia
  useEffect(() => {
    if (course.videoType === 'wistia' && !wistiaLoaded) {
      // Check if Wistia script is already loaded
      if (!document.querySelector('script[src*="fast.wistia.com/assets/external/E-v1.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://fast.wistia.com/assets/external/E-v1.js';
        script.async = true;
        script.onload = () => {
          setWistiaLoaded(true);
        };
        script.onerror = () => {
          setError('Failed to load Wistia player');
        };
        document.head.appendChild(script);
      } else {
        setWistiaLoaded(true);
      }
    }
  }, [course.videoType, wistiaLoaded]);

  useEffect(() => {
    if (!videoRef.current || course.videoType !== 'hls') return;

    const video = videoRef.current;
    const videoSrc = currentVideo.url;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Dynamically import hls.js only when needed
    const loadHls = async () => {
      const HlsModule = await import('hls.js');
      const Hls = HlsModule.default;

      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        
        hlsRef.current = hls;
        
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest parsed successfully');
        });
        
        hls.on(Hls.Events.ERROR, (event: string, data: any) => {
          console.error('HLS error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setError('Network error: Unable to load video');
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setError('Media error: Video format not supported');
                break;
              default:
                setError('Fatal error: Unable to play video');
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = videoSrc;
      } else {
        setError('HLS is not supported in this browser');
      }
    };

    loadHls();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentVideoIndex, currentVideo.url, course.videoType]);

  if (course.videoType === 'redirect' && course.redirecturl) {
    return (
      <div className="bg-card rounded-lg shadow-lg p-8 text-center border border-border">
        <h2 className="text-2xl font-bold text-card-foreground mb-4">
          {course.courseName}
        </h2>
        <p className="text-muted-foreground mb-6">
          This course is hosted externally. Click below to access the course.
        </p>
        <a
          href={course.redirecturl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity inline-block"
        >
          Go to Course
        </a>
      </div>
    );
  }

  if (course.videos.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-lg p-8 text-center border border-border">
        <h2 className="text-2xl font-bold text-card-foreground mb-4">
          {course.courseName}
        </h2>
        <p className="text-muted-foreground">
          No videos available for this course.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-card rounded-lg shadow-lg overflow-hidden border border-border">
      <div className="flex flex-col lg:flex-row h-auto lg:h-[600px]">
        {/* Left Side - Video Player */}
        <div className="flex-1 bg-black aspect-video lg:aspect-auto">
          {course.videoType === 'youtube' ? (
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.url.split('v=')[1]?.split('&')[0]}`}
              title={currentVideo.title}
              className="w-full h-full"
              allowFullScreen
            />
          ) : course.videoType === 'wistia' ? (
            <div className="w-full h-full" key={currentVideoIndex}>
              {wistiaLoaded ? (
                <div 
                  className="wistia_responsive_padding" 
                  style={{ padding: '56.25% 0 0 0', position: 'relative' }}
                >
                  <div 
                    className="wistia_responsive_wrapper" 
                    style={{ height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}
                  >
                    <div 
                      className={`wistia_embed wistia_async_${getWistiaVideoId(currentVideo.url)} videoFoam=true`}
                      style={{ height: '100%', position: 'relative', width: '100%' }}
                    >
                      <div 
                        className="wistia_swatch" 
                        style={{ height: '100%', left: 0, opacity: 0, overflow: 'hidden', position: 'absolute', top: 0, transition: 'opacity 200ms', width: '100%' }}
                      >
                        <img 
                          src={`https://fast.wistia.com/embed/medias/${getWistiaVideoId(currentVideo.url)}/swatch`}
                          style={{ filter: 'blur(5px)', height: '100%', objectFit: 'contain', width: '100%' }}
                          alt={currentVideo.title}
                          aria-hidden="true"
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.parentElement!.style.opacity = '1';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p>Loading Wistia player...</p>
                  </div>
                </div>
              )}
            </div>
          ) : course.videoType === 'internetarchive' ? (
            <div className="w-full h-full">
              <iframe
                src={`https://archive.org/embed/${getArchiveVideoId(currentVideo.url)}`}
                title={currentVideo.title}
                className="w-full h-full"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </div>
          ) : course.videoType === 'hls' ? (
            <div className="w-full h-full relative">
              <video
                ref={videoRef}
                key={currentVideoIndex}
                controls
                className="w-full h-full"
                preload="metadata"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                  <div className="text-center text-white p-4">
                    <p className="text-lg font-semibold mb-2">Video Error</p>
                    <p className="text-sm">{error}</p>
                    <button 
                      onClick={() => setError(null)}
                      className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <video
              key={currentVideoIndex}
              controls
              className="w-full h-full"
              preload="metadata"
            >
              <source src={currentVideo.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Right Side - Video List and Course Info */}
        <div className="w-full lg:w-80 bg-card border-t lg:border-t-0 lg:border-l border-border overflow-y-auto max-h-96 lg:max-h-none">
          <div className="p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-bold text-card-foreground mb-2">
              {course.courseName}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              {course.des}
            </p>
            
            {/* Mark as Done Button */}
            <div className="mb-3 sm:mb-4">
              <button
                onClick={handleMarkAsDone}
                disabled={videoDone}
                className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  videoDone
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400 cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:opacity-90'
                }`}
              >
                {videoDone ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Marked as Done
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Done
                  </span>
                )}
              </button>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2 sm:mb-3">
                Course Videos ({course.videos.length})
              </h3>
              <div className="max-h-48 lg:max-h-none overflow-y-auto">
                {course.videos.map((video, index) => {
                  const isActive = index === currentVideoIndex;
                  const isDone = isVideoDone(pageName, video.title);
                  const content = (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center flex-1 min-w-0">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 sm:mr-3 flex-shrink-0 ${
                          isActive ? 'bg-primary' : 'bg-muted-foreground'
                        }`} />
                        <span className="font-medium text-card-foreground text-xs sm:text-sm leading-tight truncate">
                          {video.title}
                        </span>
                      </div>
                      {isDone && (
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  );

                  if (useVideoLinks && baseUrl) {
                    return (
                      <Link
                        key={index}
                        href={`${baseUrl}/${index}`}
                        className={`w-full text-left p-2 sm:p-3 rounded-lg transition-colors block ${
                          isActive
                            ? 'bg-primary/10 border-l-4 border-primary'
                            : 'bg-muted hover:bg-secondary'
                        }`}
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleVideoSelect(index)}
                      className={`w-full text-left p-2 sm:p-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/10 border-l-4 border-primary'
                          : 'bg-muted hover:bg-secondary'
                      }`}
                    >
                      {content}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
