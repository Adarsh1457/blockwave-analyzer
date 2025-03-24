
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, LineChart, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 dark:bg-primary/5 rounded-full blur-3xl opacity-60" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center px-3 py-1 mb-6 text-xs font-medium rounded-full bg-primary/10 text-primary">
            <div className="w-2 h-2 mr-2 rounded-full bg-primary animate-pulse-soft" />
            Real-time cryptocurrency tracking and analytics
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Track, Analyze, and Manage Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Crypto Portfolio
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get real-time data on thousands of cryptocurrencies, create your personal portfolio, 
            and make informed decisions with advanced analytics and interactive charts.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto text-base">
              <Link to="/dashboard">
                <span>Get Started Now</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base">
              <Link to="/portfolio">Explore Portfolio Features</Link>
            </Button>
          </div>
        </motion.div>
        
        {/* Stats/Features */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 md:mt-28 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <TrendingUp className="h-10 w-10 text-primary" />,
              title: "Real-Time Prices",
              description: "Track live prices and market data for thousands of cryptocurrencies."
            },
            {
              icon: <LineChart className="h-10 w-10 text-primary" />,
              title: "Interactive Charts",
              description: "Analyze price movements with powerful interactive charting tools."
            },
            {
              icon: <Wallet className="h-10 w-10 text-primary" />,
              title: "Portfolio Tracking",
              description: "Manage and monitor your cryptocurrency portfolio in one place."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="glass-card glass-card-hover rounded-xl p-6 shadow-sm"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
