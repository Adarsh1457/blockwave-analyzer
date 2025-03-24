
import { useQuery } from "@tanstack/react-query";

interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

interface CoinDetail extends Cryptocurrency {
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_14d: number;
    price_change_percentage_30d: number;
    price_change_percentage_60d: number;
    price_change_percentage_200d: number;
    price_change_percentage_1y: number;
  };
}

// Fetch top cryptocurrencies
export const useGetTopCoins = () => {
  return useQuery({
    queryKey: ['topCoins'],
    queryFn: async (): Promise<Cryptocurrency[]> => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch top coins');
      }
      
      return response.json();
    },
    staleTime: 60000, // 1 minute
  });
};

// Fetch trending cryptocurrencies
export const useGetTrendingCoins = () => {
  return useQuery({
    queryKey: ['trendingCoins'],
    queryFn: async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/search/trending'
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending coins');
      }
      
      return response.json();
    },
    staleTime: 300000, // 5 minutes
  });
};

// Fetch details for a specific coin
export const useGetCoinDetails = (coinId: string) => {
  return useQuery({
    queryKey: ['coinDetails', coinId],
    queryFn: async (): Promise<CoinDetail> => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch details for ${coinId}`);
      }
      
      return response.json();
    },
    staleTime: 60000, // 1 minute
    enabled: !!coinId,
  });
};

// Fetch historical market data for a coin
export const useGetCoinHistory = (coinId: string, days: number = 7) => {
  return useQuery({
    queryKey: ['coinHistory', coinId, days],
    queryFn: async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch history for ${coinId}`);
      }
      
      return response.json();
    },
    staleTime: 300000, // 5 minutes
    enabled: !!coinId,
  });
};

// Global market data
export const useGetGlobalData = () => {
  return useQuery({
    queryKey: ['globalData'],
    queryFn: async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/global');
      
      if (!response.ok) {
        throw new Error('Failed to fetch global market data');
      }
      
      return response.json();
    },
    staleTime: 300000, // 5 minutes
  });
};
