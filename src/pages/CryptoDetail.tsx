
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { useGetCoinDetails } from '@/services/api';
import Navbar from '@/components/Navbar';
import PriceChart from '@/components/PriceChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const CryptoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: coinDetails, isLoading, error } = useGetCoinDetails(id || '');
  const [timeRange, setTimeRange] = useState(7);
  
  if (error) {
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
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return (
      <Badge
        variant={value >= 0 ? 'default' : 'destructive'}
        className="ml-2"
      >
        {value >= 0 ? (
          <ArrowUp className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDown className="h-3 w-3 mr-1" />
        )}
        {Math.abs(value).toFixed(2)}%
      </Badge>
    );
  };
  
  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + ' T';
    }
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + ' B';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + ' M';
    }
    return num.toLocaleString();
  };
  
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
          {isLoading ? (
            <div className="flex items-center mb-4">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div>
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ) : coinDetails ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center">
                <img 
                  src={coinDetails.image} 
                  alt={`${coinDetails.name} logo`}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h1 className="text-3xl font-bold flex items-center">
                    {coinDetails.name}
                    <span className="text-muted-foreground text-lg ml-2">
                      {coinDetails.symbol.toUpperCase()}
                    </span>
                    <Badge variant="outline" className="ml-3">
                      Rank #{coinDetails.market_cap_rank}
                    </Badge>
                  </h1>
                  
                  <div className="flex items-center mt-1">
                    <span className="text-2xl font-semibold">
                      {formatCurrency(coinDetails.market_data.current_price.usd)}
                    </span>
                    {formatPercentage(coinDetails.market_data.price_change_percentage_24h)}
                  </div>
                </div>
              </div>
              
              {coinDetails.links.homepage[0] && (
                <Button variant="outline" asChild className="sm:self-start">
                  <a 
                    href={coinDetails.links.homepage[0]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    <span>Official Website</span>
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              )}
            </div>
          ) : null}
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Chart */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-[400px] w-full rounded-lg" />
            ) : coinDetails ? (
              <PriceChart coinId={id || ''} days={timeRange} />
            ) : null}
          </div>
          
          {/* Market Data */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Market Data</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(6).fill(0).map((_, idx) => (
                      <div key={idx} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                ) : coinDetails ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Market Cap</span>
                      <span className="font-medium">
                        {formatCurrency(coinDetails.market_cap)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">24h Trading Vol</span>
                      <span className="font-medium">
                        {formatCurrency(coinDetails.total_volume)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b">
                      <div className="flex items-center">
                        <span className="text-muted-foreground">Circulating Supply</span>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                              <Info className="h-3 w-3" />
                            </Button>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-64">
                            <div className="space-y-2">
                              <p className="text-sm">
                                The amount of coins that are circulating in the market and are tradeable by the public.
                              </p>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <span className="font-medium">
                        {formatLargeNumber(coinDetails.circulating_supply)} {coinDetails.symbol.toUpperCase()}
                      </span>
                    </div>
                    
                    {coinDetails.total_supply && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Total Supply</span>
                        <span className="font-medium">
                          {formatLargeNumber(coinDetails.total_supply)} {coinDetails.symbol.toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {coinDetails.max_supply && (
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Max Supply</span>
                        <span className="font-medium">
                          {formatLargeNumber(coinDetails.max_supply)} {coinDetails.symbol.toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    {/* Price Changes */}
                    <div className="pt-2">
                      <h4 className="font-medium mb-3">Price Change</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">24h</span>
                          <div className="flex items-center">
                            {formatPercentage(coinDetails.market_data.price_change_percentage_24h)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">7d</span>
                          <div className="flex items-center">
                            {formatPercentage(coinDetails.market_data.price_change_percentage_7d)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">30d</span>
                          <div className="flex items-center">
                            {formatPercentage(coinDetails.market_data.price_change_percentage_30d)}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">1y</span>
                          <div className="flex items-center">
                            {formatPercentage(coinDetails.market_data.price_change_percentage_1y)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
          
          {/* Description and Info Tabs */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>About {coinDetails?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : coinDetails ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: coinDetails.description.en }}
                    className="prose prose-sm max-w-none dark:prose-invert"
                  />
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetail;
