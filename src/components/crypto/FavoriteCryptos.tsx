
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star } from 'lucide-react';

interface FavoriteCryptosProps {
  favorites: string[];
  cryptocurrencies: any[];
}

const FavoriteCryptos = ({ favorites, cryptocurrencies }: FavoriteCryptosProps) => {
  const navigate = useNavigate();
  const favoriteCryptos = cryptocurrencies.filter(crypto => favorites.includes(crypto.id));

  if (favorites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Favorite Cryptocurrencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No favorites yet. Click the star icon next to any cryptocurrency to add it to your favorites.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Favorite Cryptocurrencies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {favoriteCryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => navigate(`/crypto/${crypto.id}`)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium">{crypto.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {crypto.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ${crypto.current_price.toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    crypto.price_change_percentage_24h >= 0
                      ? 'text-crypto-positive'
                      : 'text-crypto-negative'
                  }`}>
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FavoriteCryptos;
