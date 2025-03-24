
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CoinDescriptionProps {
  isLoading: boolean;
  coinDetails?: any;
}

const CoinDescription = ({ isLoading, coinDetails }: CoinDescriptionProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coinDetails) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>About {coinDetails.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          dangerouslySetInnerHTML={{ __html: coinDetails.description.en }}
          className="prose prose-sm max-w-none dark:prose-invert"
        />
      </CardContent>
    </Card>
  );
};

export default CoinDescription;
