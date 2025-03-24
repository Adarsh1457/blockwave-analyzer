
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGetCoinDetails } from '@/services/api';
import Navbar from '@/components/Navbar';
import PriceChart from '@/components/PriceChart';
import CoinHeader from '@/components/crypto/CoinHeader';
import MarketDataCard from '@/components/crypto/MarketDataCard';
import CoinDescription from '@/components/crypto/CoinDescription';
import ErrorState from '@/components/crypto/ErrorState';

const CryptoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: coinDetails, isLoading, error } = useGetCoinDetails(id || '');
  const [timeRange, setTimeRange] = useState(7);
  
  if (error) {
    return <ErrorState />;
  }
  
  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24">
        <Link to="/dashboard" className="flex items-center text-primary mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        {/* Coin Header */}
        <div className="mb-8">
          <CoinHeader isLoading={isLoading} coinDetails={coinDetails} />
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Chart */}
          <div className="lg:col-span-2">
            <PriceChart coinId={id || ''} days={timeRange} />
          </div>
          
          {/* Market Data */}
          <div className="lg:col-span-1">
            <MarketDataCard isLoading={isLoading} coinDetails={coinDetails} />
          </div>
          
          {/* Description and Info Tabs */}
          <div className="lg:col-span-3">
            <CoinDescription isLoading={isLoading} coinDetails={coinDetails} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetail;
