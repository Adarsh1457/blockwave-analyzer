
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="glass-card rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Crypto Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Access real-time data, interactive charts, and portfolio tracking tools to make informed decisions in the cryptocurrency market.
            </p>
            <Button asChild size="lg" className="text-base">
              <Link to="/dashboard">
                <span>Launch Dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm font-bold">CT</span>
              </div>
              <span className="font-bold">CryptoTracker</span>
            </div>
            
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
              <Link to="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link>
            </div>
            
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CryptoTracker Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
