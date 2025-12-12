import Link from 'next/link';
import Layout from '../components/Layout';

export default function Custom404() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Go Home
            </Link>
            <Link 
              href="/all" 
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse All Courses
            </Link>
            <Link 
              href="/r" 
              className="border border-border text-foreground px-6 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              View Categories
            </Link>
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
