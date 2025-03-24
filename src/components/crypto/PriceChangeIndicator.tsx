
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PriceChangeIndicatorProps {
  value: number | null | undefined;
}

const PriceChangeIndicator = ({ value }: PriceChangeIndicatorProps) => {
  // Add null/undefined check
  if (value === null || value === undefined) {
    return (
      <Badge variant="outline" className="ml-2">
        N/A
      </Badge>
    );
  }

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

export default PriceChangeIndicator;
