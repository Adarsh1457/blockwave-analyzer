
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import PriceChangeIndicator from './PriceChangeIndicator';
import { formatCurrency } from '@/utils/formatters';

interface CoinHeaderProps {
  isLoading: boolean;
  coinDetails?: any;
}

const CoinHeader = ({ isLoading, coinDetails }: CoinHeaderProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center mb-4">
        <Skeleton className="h-12 w-12 rounded-full mr-4" />
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (!coinDetails) return null;

  return (
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
            <PriceChangeIndicator value={coinDetails.market_data.price_change_percentage_24h} />
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
  );
};

export default CoinHeader;
