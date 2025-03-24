import React, { useState, useEffect } from 'react';
import { PlusCircle, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  image: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  value: number;
  profit: number;
  profitPercentage: number;
}

interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
}

const Portfolio = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [cryptocurrencies, setCryptocurrencies] = useState<CryptoCurrency[]>([]);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchCryptocurrencies = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
        );
        if (response.ok) {
          const data = await response.json();
          setCryptocurrencies(data);
        }
      } catch (error) {
        console.error('Error fetching cryptocurrencies:', error);
      }
    };
    
    fetchCryptocurrencies();
    
    const savedPortfolio = localStorage.getItem('cryptoPortfolio');
    if (savedPortfolio) {
      setAssets(JSON.parse(savedPortfolio));
    }
    
    setLoading(false);
  }, []);
  
  useEffect(() => {
    const updatePrices = async () => {
      if (assets.length === 0) {
        setTotalValue(0);
        setTotalProfit(0);
        return;
      }
      
      try {
        const coinIds = assets.map(asset => asset.id).join(',');
        
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=100&page=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          const priceMap = new Map(
            data.map((coin: CryptoCurrency) => [coin.id, coin.current_price])
          );
          
          const updatedAssets = assets.map(asset => {
            const currentPrice = priceMap.get(asset.id) || asset.currentPrice;
            const value = asset.quantity * currentPrice;
            const profit = value - (asset.quantity * asset.purchasePrice);
            const profitPercentage = ((currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100;
            
            return {
              ...asset,
              currentPrice: Number(currentPrice),
              value: Number(value),
              profit: Number(profit),
              profitPercentage: Number(profitPercentage)
            };
          });
          
          setAssets(updatedAssets);
          
          const totalValue = updatedAssets.reduce((sum, asset) => sum + Number(asset.value), 0);
          const totalProfit = updatedAssets.reduce((sum, asset) => sum + Number(asset.profit), 0);
          
          setTotalValue(totalValue);
          setTotalProfit(totalProfit);
          
          localStorage.setItem('cryptoPortfolio', JSON.stringify(updatedAssets));
        }
      } catch (error) {
        console.error('Error updating prices:', error);
      }
    };
    
    updatePrices();
    
    const intervalId = setInterval(updatePrices, 60000);
    
    return () => clearInterval(intervalId);
  }, [assets]);
  
  const handleAddAsset = () => {
    if (!selectedCryptoId || !quantity || !purchasePrice) {
      toast({
        title: "Missing information",
        description: "Please fill out all fields.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedCrypto = cryptocurrencies.find(crypto => crypto.id === selectedCryptoId);
    
    if (!selectedCrypto) {
      toast({
        title: "Error",
        description: "Selected cryptocurrency not found.",
        variant: "destructive",
      });
      return;
    }
    
    const quantityNum = parseFloat(quantity);
    const purchasePriceNum = parseFloat(purchasePrice);
    
    if (isNaN(quantityNum) || isNaN(purchasePriceNum) || quantityNum <= 0 || purchasePriceNum <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter valid positive numbers for quantity and purchase price.",
        variant: "destructive",
      });
      return;
    }
    
    const existingAssetIndex = assets.findIndex(asset => asset.id === selectedCryptoId);
    
    if (existingAssetIndex !== -1) {
      const updatedAssets = [...assets];
      const existingAsset = updatedAssets[existingAssetIndex];
      
      const totalQuantity = existingAsset.quantity + quantityNum;
      const totalCost = (existingAsset.quantity * existingAsset.purchasePrice) + (quantityNum * purchasePriceNum);
      const newAveragePurchasePrice = totalCost / totalQuantity;
      
      updatedAssets[existingAssetIndex] = {
        ...existingAsset,
        quantity: totalQuantity,
        purchasePrice: newAveragePurchasePrice,
        value: totalQuantity * existingAsset.currentPrice,
        profit: (totalQuantity * existingAsset.currentPrice) - (totalQuantity * newAveragePurchasePrice),
        profitPercentage: ((existingAsset.currentPrice - newAveragePurchasePrice) / newAveragePurchasePrice) * 100
      };
      
      setAssets(updatedAssets);
      localStorage.setItem('cryptoPortfolio', JSON.stringify(updatedAssets));
      
      toast({
        title: "Asset updated",
        description: `Added ${quantityNum} ${selectedCrypto.symbol.toUpperCase()} to your portfolio.`,
      });
    } else {
      const value = quantityNum * selectedCrypto.current_price;
      const profit = value - (quantityNum * purchasePriceNum);
      const profitPercentage = ((selectedCrypto.current_price - purchasePriceNum) / purchasePriceNum) * 100;
      
      const newAsset: Asset = {
        id: selectedCrypto.id,
        name: selectedCrypto.name,
        symbol: selectedCrypto.symbol,
        image: selectedCrypto.image,
        quantity: quantityNum,
        purchasePrice: purchasePriceNum,
        currentPrice: selectedCrypto.current_price,
        value,
        profit,
        profitPercentage
      };
      
      const updatedAssets = [...assets, newAsset];
      setAssets(updatedAssets);
      localStorage.setItem('cryptoPortfolio', JSON.stringify(updatedAssets));
      
      toast({
        title: "Asset added",
        description: `Added ${quantityNum} ${selectedCrypto.symbol.toUpperCase()} to your portfolio.`,
      });
    }
    
    setSelectedCryptoId('');
    setQuantity('');
    setPurchasePrice('');
    setOpen(false);
  };
  
  const handleRemoveAsset = (assetId: string) => {
    const updatedAssets = assets.filter(asset => asset.id !== assetId);
    setAssets(updatedAssets);
    localStorage.setItem('cryptoPortfolio', JSON.stringify(updatedAssets));
    
    toast({
      title: "Asset removed",
      description: "The asset has been removed from your portfolio.",
    });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>My Portfolio</CardTitle>
            <CardDescription>Track your cryptocurrency investments</CardDescription>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add to Portfolio</DialogTitle>
                <DialogDescription>
                  Add a cryptocurrency to your portfolio to track its performance.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="crypto">Cryptocurrency</Label>
                  <Select value={selectedCryptoId} onValueChange={setSelectedCryptoId}>
                    <SelectTrigger id="crypto">
                      <SelectValue placeholder="Select a cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptocurrencies.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          <div className="flex items-center">
                            <img src={crypto.image} alt={crypto.name} className="w-5 h-5 mr-2" />
                            {crypto.name} ({crypto.symbol.toUpperCase()})
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Purchase Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="any"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleAddAsset}>Add to Portfolio</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {assets.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="text-2xl font-bold mt-1">{formatCurrency(totalValue)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Profit/Loss</div>
                <div className={`text-2xl font-bold mt-1 ${
                  totalProfit >= 0 ? 'text-crypto-positive' : 'text-crypto-negative'
                }`}>
                  {formatCurrency(totalProfit)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading portfolio...</div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Your portfolio is empty</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Your First Asset
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div 
                key={asset.id}
                className="glass-card rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between"
              >
                <div className="flex items-center mb-3 sm:mb-0">
                  <img 
                    src={asset.image} 
                    alt={asset.name} 
                    className="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <h4 className="font-medium">{asset.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {asset.quantity} {asset.symbol.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                  <div className="text-right sm:text-left w-full sm:w-auto">
                    <div className="text-sm text-muted-foreground">Current Value</div>
                    <div className="font-medium">{formatCurrency(asset.value)}</div>
                  </div>
                  
                  <div className="text-right sm:text-left w-full sm:w-auto">
                    <div className="text-sm text-muted-foreground">Profit/Loss</div>
                    <div className="flex items-center">
                      <span className={asset.profit >= 0 ? 'text-crypto-positive' : 'text-crypto-negative'}>
                        {formatCurrency(asset.profit)}
                      </span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                        asset.profit >= 0 
                          ? 'bg-crypto-positive/10 text-crypto-positive' 
                          : 'bg-crypto-negative/10 text-crypto-negative'
                      }`}>
                        {asset.profit >= 0 ? <ArrowUp className="inline h-3 w-3 mr-0.5" /> : <ArrowDown className="inline h-3 w-3 mr-0.5" />}
                        {Math.abs(asset.profitPercentage).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveAsset(asset.id)}
                    className="ml-auto text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Portfolio;
