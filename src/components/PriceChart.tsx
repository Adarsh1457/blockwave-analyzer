
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PriceChartProps {
  coinId: string;
  days?: number;
  color?: string;
  showTitle?: boolean;
}

interface ChartData {
  timestamp: number;
  price: number;
  date: string;
}

const timeRanges = [
  { label: '24h', days: 1 },
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
  { label: '1y', days: 365 },
];

const PriceChart: React.FC<PriceChartProps> = ({ 
  coinId, 
  days = 7, 
  color = '#3B82F6',
  showTitle = true
}) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(days);
  const [priceChange, setPriceChange] = useState({ change: 0, percentage: 0 });
  const [rangeLabel, setRangeLabel] = useState('7d');
  
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${selectedRange}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        
        const data = await response.json();
        
        // Process chart data
        const formattedData = data.prices.map((item: [number, number]) => {
          const date = new Date(item[0]);
          return {
            timestamp: item[0],
            price: item[1],
            date: formatDate(date, selectedRange),
          };
        });
        
        setChartData(formattedData);
        
        // Calculate price change
        if (formattedData.length > 1) {
          const firstPrice = formattedData[0].price;
          const lastPrice = formattedData[formattedData.length - 1].price;
          const change = lastPrice - firstPrice;
          const percentage = (change / firstPrice) * 100;
          setPriceChange({ change, percentage });
        }
        
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChartData();
  }, [coinId, selectedRange]);
  
  // Format date based on the selected time range
  const formatDate = (date: Date, days: number): string => {
    if (days === 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days <= 30) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: '2-digit' });
    }
  };
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-lg p-3 text-sm shadow-md">
          <p className="font-medium">{payload[0].payload.date}</p>
          <p className="text-primary font-medium">
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Handle time range change
  const handleRangeChange = (days: number, label: string) => {
    setSelectedRange(days);
    setRangeLabel(label);
  };
  
  return (
    <Card className="w-full">
      {showTitle && (
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Price Chart</CardTitle>
            <div>
              {loading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <Badge variant={priceChange.percentage >= 0 ? 'default' : 'destructive'}>
                  {priceChange.percentage >= 0 ? '+' : ''}
                  {priceChange.percentage.toFixed(2)}%
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="mb-4 flex items-center justify-start space-x-2">
          {timeRanges.map((range) => (
            <Badge
              key={range.label}
              variant={selectedRange === range.days ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleRangeChange(range.days, range.label)}
            >
              {range.label}
            </Badge>
          ))}
        </div>
        
        <div className="h-[300px] w-full">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className="space-y-2 w-full">
                <Skeleton className="h-[300px] w-full" />
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => 
                    `$${value >= 1000 
                      ? `${(value / 1000).toFixed(1)}k` 
                      : value.toFixed(value < 1 ? 2 : 0)}`
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 1, fill: 'white' }}
                  fill="url(#colorPrice)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
