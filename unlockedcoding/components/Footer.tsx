import Image from 'next/image';

export default function Footer() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Unlocked Coding';
  
  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white shadow-lg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Image 
              src="/images.png" 
              alt="UnlockedCoding Logo" 
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
              priority
            />
            <h3 className="text-2xl font-bold text-black dark:text-white">
              {siteName}
            </h3>
          </div>
          
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your gateway to mastering programming and technology. Learn, build, and grow with our comprehensive courses.
          </p>
          
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="/about" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
              About Us
            </a>
            <span className="text-border">•</span>
            <a href="/contact" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
              Contact Us
            </a>
            <span className="text-border">•</span>
            <a href="/blog" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
              Blog
            </a>
            <span className="text-border">•</span>
            <a href="/faq" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
              FAQ
            </a>
            <span className="text-border">•</span>
            <a href="/privacy" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
              Privacy Policy
            </a>
            <span className="text-border">•</span>
            <a href="/terms" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
              Terms of Service
            </a>
            <span className="text-border">•</span>
            <a href="/cookie-policy" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
              Cookie Policy
            </a>
            <span className="text-border">•</span>
            <a href="/r" className="text-black dark:text-white hover:underline hover:decoration-blue-500 hover:decoration-2 transition-all duration-200">
              Browse Courses
            </a>
          </div>
          
          <div className="text-muted-foreground text-sm">
            &copy; 2025 {siteName}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
