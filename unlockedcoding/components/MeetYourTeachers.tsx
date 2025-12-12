import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Teacher {
  name: string;
  image: string;
  courseCount: number;
  categories: string[];
}

interface MeetYourTeachersProps {
  teachers: Teacher[];
}

const MeetYourTeachers: React.FC<MeetYourTeachersProps> = ({ teachers }) => {
  const formatTeacherName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'web-development': 'Web Development',
      'dsa': 'Data Structures & Algorithms',
      'ai-ml-ds': 'AI/ML/Data Science',
      'system-design': 'System Design',
      'programming': 'Programming',
      'devops': 'DevOps',
      'cyber-security': 'Cyber Security',
      'data-analytics': 'Data Analytics',
      'data-engineering': 'Data Engineering',
      'networking': 'Networking',
      'app-development': 'App Development',
      'gate': 'GATE Preparation',
      'aptitude': 'Aptitude',
      'government-exam': 'Government Exams',
      'defence-exam': 'Defence Exams',
      'skills': 'Skills Development'
    };
    return categoryMap[category] || category;
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Your Expert Teachers
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Learn from industry experts and experienced instructors who have helped thousands of students achieve their career goals
          </p>
        </div>

        {/* Teachers Grid - Single Line */}
        <div className="flex flex-wrap justify-center gap-4">
          {teachers.map((teacher) => (
            <div
              key={teacher.name}
              className="bg-card text-card-foreground rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-border group flex items-center gap-4 min-w-[300px] hover:border-primary/20"
            >
              <Link
                href={`/teacher/${encodeURIComponent(teacher.name)}`}
                className="flex items-center gap-4 w-full"
              >
                {/* Teacher Image */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                    {teacher.image ? (
                      <Image
                        src={teacher.image}
                        alt={formatTeacherName(teacher.name)}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-xl font-bold text-primary ${teacher.image ? 'hidden' : ''}`}>
                      {formatTeacherName(teacher.name).charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Teacher Info */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {formatTeacherName(teacher.name)}
                  </h3>
                  
                  {/* Course Count */}
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold text-primary">{teacher.courseCount}</span> course{teacher.courseCount > 1 ? 's' : ''}
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1">
                    {teacher.categories.slice(0, 3).map((category, catIndex) => (
                      <span
                        key={catIndex}
                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                      >
                        {getCategoryDisplayName(category)}
                      </span>
                    ))}
                    {teacher.categories.length > 3 && (
                      <span className="text-muted-foreground text-xs">
                        +{teacher.categories.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetYourTeachers;
