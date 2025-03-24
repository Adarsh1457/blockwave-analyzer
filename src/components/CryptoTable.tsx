
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUp, 
  ArrowDown, 
  ChevronUp, 
  ChevronDown, 
  Search,
  Star, 
  RefreshCw 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface Cryptocurrency {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  circulating_supply: number;
  market_cap_rank: number;
}

interface SortConfig {
  key: keyof Cryptocurrency | null;
  direction: 'asc' | 'desc';
}

const CryptoTable = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [filteredCryptocurrencies, setFilteredCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'market_cap_rank',
    direction: 'asc'
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('cryptoFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    fetchCryptocurrencies();
    
    // Set up interval to refresh data every 2 minutes
    const intervalId = setInterval(fetchCryptocurrencies, 120000);
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    // Filter cryptocurrencies based on search term
    if (searchTerm.trim() === '') {
      setFilteredCryptocurrencies(cryptocurrencies);
    } else {
      const filtered = cryptocurrencies.filter(
        crypto => 
          crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCryptocurrencies(filtered);
    }
  }, [searchTerm, cryptocurrencies]);
  
  useEffect(() => {
    // Sort cryptocurrencies
    if (sortConfig.key) {
      const sortedCryptos = [...filteredCryptocurrencies].sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
      
      setFilteredCryptocurrencies(sortedCryptos);
    }
  }, [sortConfig]);
  
  const fetchCryptocurrencies = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      setCryptocurrencies(data);
      setFilteredCryptocurrencies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cryptocurrency data:', error);
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  const requestSort = (key: keyof Cryptocurrency) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof Cryptocurrency) => {
    if (sortConfig.key !== key) {
      return null;
    }
    
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };
  
  const toggleFavorite = (id: string) => {
    let newFavorites: string[];
    
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(favId => favId !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
  };
  
  const formatNumber = (num: number, maximumFractionDigits = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits
    }).format(num);
  };
  
  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'T';
    }
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    }
    return num.toLocaleString();
  };
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cryptocurrency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchCryptocurrencies}
          disabled={isRefreshing}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('current_price')}
                >
                  <div className="flex items-center">
                    Price
                    {getSortIcon('current_price')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => requestSort('price_change_percentage_24h')}
                >
                  <div className="flex items-center">
                    24h %
                    {getSortIcon('price_change_percentage_24h')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hidden md:table-cell"
                  onClick={() => requestSort('market_cap')}
                >
                  <div className="flex items-center">
                    Market Cap
                    {getSortIcon('market_cap')}
                  </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Volume (24h)
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Circulating Supply
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(10).fill(0).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-4 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-12 mt-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : filteredCryptocurrencies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No cryptocurrencies found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCryptocurrencies.map((crypto) => (
                  <TableRow key={crypto.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFavorite(crypto.id)}
                        className={favorites.includes(crypto.id) ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>{crypto.market_cap_rank}</TableCell>
                    <TableCell>
                      <Link 
                        to={`/crypto/${crypto.id}`} 
                        className="flex items-center gap-3 hover:underline"
                      >
                        <img 
                          src={crypto.image} 
                          alt={crypto.name}
                          className="w-8 h-8 rounded-full"
                          loading="lazy"
                        />
                        <div>
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-xs text-muted-foreground uppercase">{crypto.symbol}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>{formatNumber(crypto.current_price)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={`${
                          crypto.price_change_percentage_24h >= 0 
                            ? 'bg-crypto-positive/10 text-crypto-positive border-crypto-positive/20' 
                            : 'bg-crypto-negative/10 text-crypto-negative border-crypto-negative/20'
                        }`}
                      >
                        {crypto.price_change_percentage_24h >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatLargeNumber(crypto.market_cap)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatLargeNumber(crypto.total_volume)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatLargeNumber(crypto.circulating_supply)} {crypto.symbol.toUpperCase()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CryptoTable;
