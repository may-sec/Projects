import Link from 'next/link';
import Layout from '../components/Layout';

export default function Custom500() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-destructive mb-4">500</h1>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Server Error
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Something went wrong on our end. Please try again later.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Go Home
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
          
          <div className="mt-12 text-sm text-muted-foreground">
            <p>If the problem persists, please contact support.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
