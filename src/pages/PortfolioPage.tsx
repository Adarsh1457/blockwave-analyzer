
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';

const PortfolioPage = () => {
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24">
        <Link to="/dashboard" className="flex items-center text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Portfolio</h1>
          <p className="text-muted-foreground">
            Track and manage your cryptocurrency investments
          </p>
        </div>
        
        <Portfolio />
      </div>
    </div>
  );
};

export default PortfolioPage;
