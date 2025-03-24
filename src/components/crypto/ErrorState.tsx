
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const ErrorState = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <Link to="/dashboard" className="flex items-center text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Error Loading Cryptocurrency Data</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load the details for this cryptocurrency. Please try again later.
          </p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
