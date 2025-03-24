
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  BarChart, 
  Bell, 
  Wallet, 
  PieChart, 
  Lock, 
  BookOpen, 
  RefreshCw 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Features = () => {
  const featureSections = [
    {
      id: "tracking",
      title: "Real-Time Tracking",
      description: "Stay updated with instant price changes and market movements",
      features: [
        {
          icon: <LineChart className="h-6 w-6 text-primary" />,
          title: "Live Price Updates",
          description: "Get second-by-second updates on cryptocurrency prices from multiple exchanges."
        },
        {
          icon: <BarChart className="h-6 w-6 text-primary" />,
          title: "Market Rankings",
          description: "View top-performing cryptocurrencies ranked by market cap, volume, and price change."
        },
        {
          icon: <Bell className="h-6 w-6 text-primary" />,
          title: "Price Alerts",
          description: "Set custom alerts for price movements and receive instant notifications."
        },
        {
          icon: <RefreshCw className="h-6 w-6 text-primary" />,
          title: "Automatic Refreshing",
          description: "Data automatically refreshes to ensure you're always seeing the latest information."
        }
      ]
    },
    {
      id: "portfolio",
      title: "Portfolio Management",
      description: "Efficiently track and manage your cryptocurrency investments",
      features: [
        {
          icon: <Wallet className="h-6 w-6 text-primary" />,
          title: "Asset Tracking",
          description: "Add your cryptocurrency holdings and track their performance over time."
        },
        {
          icon: <PieChart className="h-6 w-6 text-primary" />,
          title: "Portfolio Diversity",
          description: "Visualize your portfolio allocation and diversity across different assets."
        },
        {
          icon: <Lock className="h-6 w-6 text-primary" />,
          title: "Secure Storage",
          description: "Your portfolio data is securely stored and accessible only to you."
        },
        {
          icon: <BookOpen className="h-6 w-6 text-primary" />,
          title: "Transaction History",
          description: "Keep a detailed record of all your cryptocurrency transactions."
        }
      ]
    }
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5 
      }
    }
  };
  
  return (
    <section className="py-20 md:py-32 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Crypto Enthusiasts
          </h2>
          <p className="text-muted-foreground text-lg">
            CryptoTracker Pro provides everything you need to stay informed and make smarter trading decisions.
          </p>
        </div>
        
        <Tabs defaultValue="tracking" className="w-full max-w-5xl mx-auto">
          <TabsList className="w-full max-w-md mx-auto mb-12">
            {featureSections.map((section) => (
              <TabsTrigger 
                key={section.id}
                value={section.id}
                className="flex-1 py-3"
              >
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {featureSections.map((section) => (
            <TabsContent 
              key={section.id} 
              value={section.id}
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="text-center mb-12">
                <h3 className="text-2xl font-semibold mb-3">{section.title}</h3>
                <p className="text-muted-foreground">{section.description}</p>
              </div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
              >
                {section.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="glass-card glass-card-hover rounded-xl p-6 text-center shadow-sm"
                    variants={item}
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {feature.icon}
                    </div>
                    <h4 className="text-lg font-medium mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Features;
