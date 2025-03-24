
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import PriceChangeIndicator from './PriceChangeIndicator';
import { formatCurrency, formatLargeNumber } from '@/utils/formatters';

interface MarketDataCardProps {
  isLoading: boolean;
  coinDetails?: any;
}

const MarketDataCard = ({ isLoading, coinDetails }: MarketDataCardProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coinDetails) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Data</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <PriceChangeIndicator value={coinDetails.market_data.price_change_percentage_24h} />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">7d</span>
                <div className="flex items-center">
                  <PriceChangeIndicator value={coinDetails.market_data.price_change_percentage_7d} />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">30d</span>
                <div className="flex items-center">
                  <PriceChangeIndicator value={coinDetails.market_data.price_change_percentage_30d} />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">1y</span>
                <div className="flex items-center">
                  <PriceChangeIndicator value={coinDetails.market_data.price_change_percentage_1y} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketDataCard;
