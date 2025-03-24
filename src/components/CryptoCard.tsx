
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface CryptoCardProps {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  index?: number;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  id,
  symbol,
  name,
  image,
  current_price,
  price_change_percentage_24h,
  index = 0
}) => {
  const isPriceUp = price_change_percentage_24h >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link 
        to={`/crypto/${id}`} 
        className="block glass-card glass-card-hover rounded-xl overflow-hidden relative shadow-sm"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent overflow-hidden">
          <div 
            className={`h-full ${isPriceUp ? 'bg-crypto-positive' : 'bg-crypto-negative'}`} 
            style={{ width: `${Math.min(Math.abs(price_change_percentage_24h * 2), 100)}%` }}
          />
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <img 
                src={image} 
                alt={`${name} logo`} 
                className="w-10 h-10 mr-3 rounded-full" 
                loading="lazy" 
              />
              <div>
                <h3 className="font-medium">{name}</h3>
                <span className="text-xs text-muted-foreground uppercase">{symbol}</span>
              </div>
            </div>
            
            <div className={`flex items-center text-xs px-2 py-1 rounded-full ${
              isPriceUp ? 'bg-crypto-positive/10 text-crypto-positive' : 'bg-crypto-negative/10 text-crypto-negative'
            }`}>
              {isPriceUp ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
              {Math.abs(price_change_percentage_24h).toFixed(2)}%
            </div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-semibold">
                ${current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              24h
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CryptoCard;
