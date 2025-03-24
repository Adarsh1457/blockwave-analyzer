import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGetTopCoins, useGetGlobalData } from '@/services/api';
import Navbar from '@/components/Navbar';
import CryptoCard from '@/components/CryptoCard';
import CryptoTable from '@/components/CryptoTable';
import PriceChart from '@/components/PriceChart';
import FavoriteCryptos from '@/components/crypto/FavoriteCryptos';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  LineChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const Dashboard = () => {
  const { data: coins, isLoading: isLoadingCoins } = useGetTopCoins();
  const { data: globalData, isLoading: isLoadingGlobal } = useGetGlobalData();
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [featuredCoins, setFeaturedCoins] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('cryptoFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    if (coins && coins.length > 0) {
      setSelectedCoin(coins[0]?.id || null);
      setFeaturedCoins(coins.slice(0, 4));
    }
  }, [coins]);

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24">
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold mb-2"
          >
            Cryptocurrency Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-muted-foreground"
          >
            Track and analyze cryptocurrency prices, market trends, and performance
          </motion.p>
        </div>
        
        {/* Global Market Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoadingGlobal ? (
              Array(4).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-8 w-40" />
                  </CardContent>
                </Card>
              ))
            ) : globalData?.data ? (
              <>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Market Cap</p>
                          <p className="text-2xl font-bold">
                            {formatMarketCap(globalData.data.total_market_cap.usd)}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <LineChart className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
                          <p className="text-2xl font-bold">
                            {formatMarketCap(globalData.data.total_volume.usd)}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Active Cryptocurrencies</p>
                          <p className="text-2xl font-bold">
                            {globalData.data.active_cryptocurrencies.toLocaleString()}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">BTC Dominance</p>
                          <p className="text-2xl font-bold">
                            {globalData.data.market_cap_percentage.btc.toFixed(1)}%
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-amber-500"
                          >
                            <path
                              d="M9 8.25H13.5C14.3284 8.25 15 8.92157 15 9.75C15 10.5784 14.3284 11.25 13.5 11.25H10.5C9.67157 11.25 9 11.9216 9 12.75C9 13.5784 9.67157 14.25 10.5 14.25H13.5C14.3284 14.25 15 14.9216 15 15.75C15 16.5784 14.3284 17.25 13.5 17.25H9M12 7.5V6M12 18V16.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 3.75H9L4.5 18.75H19.5L15 3.75Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            ) : (
              <p>Failed to load global market data</p>
            )}
          </div>
        </div>
        
        {/* Favorites Section */}
        {!isLoadingCoins && (
          <div className="mb-8">
            <FavoriteCryptos favorites={favorites} cryptocurrencies={coins || []} />
          </div>
        )}
        
        {/* Featured Cryptocurrencies */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Featured Cryptocurrencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoadingCoins ? (
              Array(4).fill(0).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="ml-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-12 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-20 mt-2" />
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredCoins.map((coin, index) => (
                <CryptoCard 
                  key={coin.id}
                  id={coin.id}
                  symbol={coin.symbol}
                  name={coin.name}
                  image={coin.image}
                  current_price={coin.current_price}
                  price_change_percentage_24h={coin.price_change_percentage_24h}
                  index={index}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Price Chart and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Price Chart */}
          <div className="lg:col-span-3 xl:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Price Chart</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingCoins ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-[300px] w-full" />
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <Tabs
                        defaultValue={selectedCoin || undefined}
                        onValueChange={(value) => setSelectedCoin(value)}
                        className="w-full"
                      >
                        <TabsList className="w-full mb-4 overflow-x-auto flex-nowrap justify-start">
                          {featuredCoins.map((coin) => (
                            <TabsTrigger key={coin.id} value={coin.id} className="flex-shrink-0">
                              <div className="flex items-center">
                                <img
                                  src={coin.image}
                                  alt={coin.name}
                                  className="w-5 h-5 mr-2 rounded-full"
                                />
                                {coin.symbol.toUpperCase()}
                              </div>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {featuredCoins.map((coin) => (
                          <TabsContent key={coin.id} value={coin.id} className="mt-0">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold">{coin.name}</h3>
                                <p className="text-muted-foreground text-sm">
                                  ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                </p>
                              </div>
                              <Badge
                                variant={coin.price_change_percentage_24h >= 0 ? 'default' : 'destructive'}
                                className="flex items-center"
                              >
                                {coin.price_change_percentage_24h >= 0 ? (
                                  <ArrowUpRight className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowDownRight className="h-3 w-3 mr-1" />
                                )}
                                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                              </Badge>
                            </div>
                            <PriceChart
                              coinId={coin.id}
                              showTitle={false}
                              color={coin.price_change_percentage_24h >= 0 ? '#10B981' : '#EF4444'}
                            />
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Cryptocurrency Table */}
          <div className="lg:col-span-3 xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cryptocurrency Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <CryptoTable />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
