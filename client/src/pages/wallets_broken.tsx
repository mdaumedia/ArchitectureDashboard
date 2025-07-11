import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Bitcoin, 
  Plus, 
  Eye, 
  EyeOff,
  Send,
  ArrowDownToLine,
  MoreVertical,
  PiggyBank,
  Building2,
  Coins
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AppHeader from "@/components/layout/app-header";
import BottomNavigation from "@/components/layout/bottom-navigation";
import { useToast } from "@/hooks/use-toast";

interface WalletData {
  id: number;
  userId: string;
  balance: string;
  pendingBalance: string;
  currency: string;
  walletType: string;
  createdAt: string;
  updatedAt: string;
}

interface AssetHolding {
  id: number;
  balance: string;
  totalInvested: string;
  averageBuyPrice: string;
  asset: {
    symbol: string;
    name: string;
    type: string;
    iconUrl?: string;
    exchangeRate: string;
    priceChange24h?: string;
  };
}

interface Investment {
  id: number;
  principalAmount: string;
  currentValue: string;
  interestEarned: string;
  status: string;
  startDate: string;
  maturityDate: string;
  product: {
    name: string;
    type: string;
    expectedReturn: string;
    riskLevel: string;
  };
}

interface CreditFacility {
  id: number;
  type: string;
  creditLimit: string;
  availableCredit: string;
  usedCredit: string;
  interestRate: string;
  status: string;
}

export default function Wallets() {
  const [showBalances, setShowBalances] = useState(true);
  const { toast } = useToast();

  const { data: wallets = [] } = useQuery<WalletData[]>({
    queryKey: ["/api/wallets"],
  });

  const { data: holdings = [] } = useQuery<AssetHolding[]>({
    queryKey: ["/api/wallets/holdings"],
  });

  const { data: investments = [] } = useQuery<Investment[]>({
    queryKey: ["/api/investments"],
  });

  const { data: creditFacilities = [] } = useQuery<CreditFacility[]>({
    queryKey: ["/api/credit-facilities"],
  });

  // Calculate total balances
  const totalFiatBalance = wallets.reduce((sum, wallet) => 
    sum + parseFloat(wallet.balance || "0"), 0
  );

  const totalCryptoValue = holdings
    .filter(h => h.asset.type === 'cryptocurrency')
    .reduce((sum, holding) => 
      sum + (parseFloat(holding.balance) * parseFloat(holding.asset.exchangeRate)), 0
    );

  const totalInvestmentValue = investments.reduce((sum, inv) => 
    sum + parseFloat(inv.currentValue || "0"), 0
  );

  const totalCreditAvailable = creditFacilities.reduce((sum, facility) => 
    sum + parseFloat(facility.availableCredit || "0"), 0
  );

  const totalNetWorth = totalFiatBalance + totalCryptoValue + totalInvestmentValue;

  const formatCurrency = (amount: string | number, currency = "USD") => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(num);
  };

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'primary': return Wallet;
      case 'savings': return PiggyBank;
      case 'crypto': return Bitcoin;
      case 'investment': return TrendingUp;
      case 'business': return Building2;
      default: return Wallet;
    }
  };

  const getWalletColor = (type: string) => {
    switch (type) {
      case 'primary': return 'bg-blue-100 text-blue-700';
      case 'savings': return 'bg-green-100 text-green-700';
      case 'crypto': return 'bg-orange-100 text-orange-700';
      case 'investment': return 'bg-purple-100 text-purple-700';
      case 'business': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const handleWalletAction = (action: string, walletId: number) => {
    toast({
      title: `${action} Action`,
      description: `${action} functionality coming soon for wallet ${walletId}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <AppHeader />
      
      <main className="max-w-md mx-auto px-6 py-6 pb-24">
        {/* Total Portfolio Overview */}
        <Card className="card-refined mb-8 bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="text-refined-heading">Total Portfolio</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
                className="h-9 w-9 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                {showBalances ? 
                  <EyeOff className="w-4 h-4 text-neutral-600" /> : 
                  <Eye className="w-4 h-4 text-neutral-600" />
                }
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-4xl font-bold text-refined-heading tracking-tight">
                {showBalances ? formatCurrency(totalNetWorth) : "••••••"}
              </p>
              <p className="text-refined-muted">Total Net Worth</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {showBalances ? formatCurrency(totalFiatBalance) : "••••"}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Cash Balance</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200/50 dark:border-orange-700/50">
                <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {showBalances ? formatCurrency(totalCryptoValue) : "••••"}
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Crypto Value</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                <p className="text-xl font-bold text-green-900 dark:text-green-100">
                  {showBalances ? formatCurrency(totalInvestmentValue) : "••••"}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">Investments</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {showBalances ? formatCurrency(totalCreditAvailable) : "••••"}
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Available Credit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="primary" className="w-full">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm rounded-xl shadow-soft">
            <TabsTrigger value="primary" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft">Primary</TabsTrigger>
            <TabsTrigger value="crypto" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft">Crypto</TabsTrigger>
            <TabsTrigger value="savings" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft">Savings</TabsTrigger>
            <TabsTrigger value="investment" className="rounded-lg font-semibold text-sm data-[state=active]:bg-white data-[state=active]:shadow-soft">Investment</TabsTrigger>
          </TabsList>

          <TabsContent value="primary" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-refined-heading">Primary Wallets</h2>
              <Button 
                size="sm" 
                onClick={() => handleWalletAction("Create Primary", 0)}
                className="btn-primary-refined text-sm px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>

            <div className="space-y-4">
              {wallets.filter(w => w.walletType === 'primary').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                
                return (
                  <Card key={wallet.id} className="card-refined interactive-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl flex items-center justify-center shadow-soft">
                            <Icon className="w-7 h-7 text-blue-700 dark:text-blue-300" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-refined-heading text-lg">
                              {wallet.walletType.charAt(0).toUpperCase() + wallet.walletType.slice(1)} Wallet
                            </h3>
                            <p className="text-refined-muted text-sm">
                              {wallet.currency} • Created {new Date(wallet.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <p className="text-2xl font-bold text-refined-heading">
                            {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "••••••"}
                          </p>
                          {parseFloat(wallet.pendingBalance) > 0 && (
                            <p className="text-sm text-muted-foreground">
                              +{showBalances ? formatCurrency(wallet.pendingBalance, wallet.currency) : "••••"} pending
                            </p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Send", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <Send className="w-3 h-3 mr-1" />
                              Send
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Receive", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <ArrowDownToLine className="w-3 h-3 mr-1" />
                              Receive
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleWalletAction("View Details", wallet.id)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleWalletAction("Transaction History", wallet.id)}>
                                  Transaction History
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleWalletAction("Settings", wallet.id)}>
                                  Wallet Settings
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-lg font-semibold">
                    {showBalances ? formatCurrency(totalInvestmentValue) : "****"}
                  </p>
                  <p className="text-sm text-neutral-600">Investments</p>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-lg font-semibold">
                    {showBalances ? formatCurrency(totalCreditAvailable) : "****"}
                  </p>
                  <p className="text-sm text-neutral-600">Available Credit</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="primary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="primary">Primary</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
          </TabsList>

          <TabsContent value="primary" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Primary Wallets</h2>
              <Button size="sm" onClick={() => handleWalletAction("Create Primary", 0)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>

            <div className="space-y-3">
              {wallets.filter(w => w.walletType === 'primary').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                const colorClass = getWalletColor(wallet.walletType);
                
                return (
                  <Card key={wallet.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {wallet.walletType.charAt(0).toUpperCase() + wallet.walletType.slice(1)} Wallet
                            </p>
                            <p className="text-sm text-neutral-600">
                              {wallet.currency} • Main spending account
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="font-semibold">
                              {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "****"}
                            </p>
                            {parseFloat(wallet.pendingBalance || "0") > 0 && (
                              <p className="text-xs text-orange-600">
                                +{formatCurrency(wallet.pendingBalance, wallet.currency)} pending
                              </p>
                            )}
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleWalletAction("Send", wallet.id)}>
                                <Send className="w-4 h-4 mr-2" />
                                Send Money
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleWalletAction("Receive", wallet.id)}>
                                <ArrowDownToLine className="w-4 h-4 mr-2" />
                                Receive Money
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleWalletAction("Topup", wallet.id)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Top Up
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Savings Wallets</h2>
              <Button size="sm" onClick={() => handleWalletAction("Create Savings", 0)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Savings
              </Button>
            </div>

            <div className="space-y-3">
              {wallets.filter(w => w.walletType === 'savings').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                const colorClass = getWalletColor(wallet.walletType);
                
                return (
                  <Card key={wallet.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium">Savings Wallet</p>
                            <p className="text-sm text-neutral-600">
                              {wallet.currency} • Long-term savings
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="font-semibold">
                              {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "****"}
                            </p>
                            <p className="text-xs text-green-600">Earning interest</p>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleWalletAction("Transfer In", wallet.id)}>
                                <ArrowDownToLine className="w-4 h-4 mr-2" />
                                Transfer In
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleWalletAction("Transfer Out", wallet.id)}>
                                <Send className="w-4 h-4 mr-2" />
                                Transfer Out
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Crypto Holdings</h2>
              <Button size="sm" onClick={() => handleWalletAction("Buy Crypto", 0)}>
                <Plus className="w-4 h-4 mr-2" />
                Buy Crypto
              </Button>
            </div>

            <div className="space-y-3">
              {holdings.filter(h => h.asset.type === 'cryptocurrency').map((holding) => {
                const value = parseFloat(holding.balance) * parseFloat(holding.asset.exchangeRate);
                const gain = value - parseFloat(holding.totalInvested);
                const gainPercent = (gain / parseFloat(holding.totalInvested)) * 100;
                
                return (
                  <Card key={holding.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Bitcoin className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium">{holding.asset.symbol}</p>
                            <p className="text-sm text-neutral-600">{holding.asset.name}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">
                            {showBalances ? formatCurrency(value) : "****"}
                          </p>
                          <p className="text-sm text-neutral-600">
                            {showBalances ? `${parseFloat(holding.balance).toFixed(6)} ${holding.asset.symbol}` : "****"}
                          </p>
                          <Badge variant={gain >= 0 ? "default" : "destructive"} className="text-xs">
                            {showBalances ? `${gain >= 0 ? '+' : ''}${gainPercent.toFixed(2)}%` : "****"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="crypto" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-refined-heading">Crypto Wallets</h2>
              <Button 
                size="sm" 
                onClick={() => handleWalletAction("Create Crypto", 0)}
                className="btn-primary-refined text-sm px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>

            <div className="space-y-4">
              {wallets.filter(w => w.walletType === 'crypto').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                
                return (
                  <Card key={wallet.id} className="card-refined interactive-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-2xl flex items-center justify-center shadow-soft">
                            <Icon className="w-7 h-7 text-orange-700 dark:text-orange-300" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-refined-heading text-lg">Crypto Wallet</h3>
                            <p className="text-refined-muted text-sm">
                              {wallet.currency} • Digital assets
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <p className="text-2xl font-bold text-refined-heading">
                            {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "••••••"}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Buy", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Buy
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Sell", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <ArrowDownToLine className="w-3 h-3 mr-1" />
                              Sell
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Crypto Holdings */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-refined-heading mb-4">Crypto Holdings</h3>
                {holdings.map((holding) => {
                  const value = parseFloat(holding.balance) * parseFloat(holding.asset.exchangeRate);
                  const invested = parseFloat(holding.totalInvested);
                  const gain = value - invested;
                  const gainPercent = invested > 0 ? (gain / invested) * 100 : 0;
                  
                  return (
                    <Card key={holding.id} className="card-refined mb-3">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-soft">
                              <Coins className="w-6 h-6 text-orange-700" />
                            </div>
                            <div>
                              <p className="font-bold text-refined-heading">{holding.asset.symbol}</p>
                              <p className="text-sm text-refined-muted">{holding.asset.name}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-bold text-refined-heading">
                              {showBalances ? formatCurrency(value) : "••••"}
                            </p>
                            <p className="text-sm text-refined-muted">
                              {showBalances ? `${parseFloat(holding.balance).toFixed(6)} ${holding.asset.symbol}` : "••••"}
                            </p>
                            <Badge variant={gain >= 0 ? "default" : "destructive"} className="text-xs">
                              {showBalances ? `${gain >= 0 ? '+' : ''}${gainPercent.toFixed(2)}%` : "••••"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="savings" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-refined-heading">Savings Wallets</h2>
              <Button 
                size="sm" 
                onClick={() => handleWalletAction("Create Savings", 0)}
                className="btn-primary-refined text-sm px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Savings
              </Button>
            </div>

            <div className="space-y-4">
              {wallets.filter(w => w.walletType === 'savings').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                
                return (
                  <Card key={wallet.id} className="card-refined interactive-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-2xl flex items-center justify-center shadow-soft">
                            <Icon className="w-7 h-7 text-green-700 dark:text-green-300" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-refined-heading text-lg">Savings Wallet</h3>
                            <p className="text-refined-muted text-sm">
                              {wallet.currency} • Goal-based savings
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right space-y-1">
                          <p className="text-2xl font-bold text-refined-heading">
                            {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "••••••"}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Deposit", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Deposit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWalletAction("Withdraw", wallet.id)}
                              className="h-8 px-3 text-xs rounded-lg"
                            >
                              <ArrowDownToLine className="w-3 h-3 mr-1" />
                              Withdraw
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="investment" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-refined-heading">Investment Wallets</h2>
              <Button 
                size="sm" 
                onClick={() => handleWalletAction("Create Investment", 0)}
                className="btn-primary-refined text-sm px-4 py-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Investment
              </Button>
            </div>

            <div className="space-y-3">
              {wallets.filter(w => w.walletType === 'investment').map((wallet) => {
                const Icon = getWalletIcon(wallet.walletType);
                const colorClass = getWalletColor(wallet.walletType);
                
                return (
                  <Card key={wallet.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-medium">Investment Wallet</p>
                            <p className="text-sm text-neutral-600">
                              {wallet.currency} • Portfolio funds
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <p className="font-semibold">
                              {showBalances ? formatCurrency(wallet.balance, wallet.currency) : "****"}
                            </p>
                            <p className="text-xs text-purple-600">Available to invest</p>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleWalletAction("Invest", wallet.id)}>
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Invest Funds
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleWalletAction("Add Funds", wallet.id)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Funds
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Investment Holdings */}
              <div className="mt-6">
                <h3 className="text-md font-medium mb-3">Active Investments</h3>
                {investments.map((investment) => {
                  const gain = parseFloat(investment.currentValue) - parseFloat(investment.principalAmount);
                  const gainPercent = (gain / parseFloat(investment.principalAmount)) * 100;
                  
                  return (
                    <Card key={investment.id} className="mb-3">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">{investment.product.name}</p>
                              <p className="text-sm text-neutral-600">{investment.product.type}</p>
                              <Badge variant="outline" className="text-xs">
                                {investment.product.riskLevel} Risk
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-semibold">
                              {showBalances ? formatCurrency(investment.currentValue) : "****"}
                            </p>
                            <p className="text-sm text-neutral-600">
                              Principal: {showBalances ? formatCurrency(investment.principalAmount) : "****"}
                            </p>
                            <Badge variant={gain >= 0 ? "default" : "destructive"} className="text-xs">
                              {showBalances ? `${gain >= 0 ? '+' : ''}${gainPercent.toFixed(2)}%` : "****"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation currentPage="wallets" />
    </div>
  );
}