import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { SkipNav } from "@/components/ui/accessibility";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MultilingualAccessibilityProvider } from "@/components/ui/multilingual-accessibility-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Wallets from "@/pages/wallets";
import Transactions from "@/pages/transactions";
import QR from "@/pages/qr";
import Services from "@/pages/services";
import Profile from "@/pages/profile";
import SignIn from "@/pages/signin";
import TestLogin from "@/pages/test-login";
import Onboarding from "@/pages/onboarding";
import KYC from "@/pages/kyc";
import PresetUsers from "@/pages/preset-users";
import PartnershipsPage from "@/pages/partnerships";
import AccessibilityDemo from "@/pages/accessibility-demo";
import LanguageDemo from "@/pages/language-demo";
import CulturalAccessibilityDemo from "@/pages/cultural-accessibility-demo";
import { ComponentLibrary } from "@/pages/component-library";
import AdminPage from "@/pages/admin";

// Service Journey Pages
import SendMoneyIndex from "@/pages/send-money/index";
import SendMoneyAmount from "@/pages/send-money/amount";
import SendMoneyConfirm from "@/pages/send-money/confirm";
import SendMoneySuccess from "@/pages/send-money/success";

import BuyAirtimeIndex from "@/pages/buy-airtime/index";
import BuyAirtimeAmount from "@/pages/buy-airtime/amount";
import BuyAirtimeConfirm from "@/pages/buy-airtime/confirm";
import BuyAirtimeSuccess from "@/pages/buy-airtime/success";

import PayScanIndex from "@/pages/pay-scan/index";
import PayBillsIndex from "@/pages/pay-bills/index";
import PayBillsProviders from "@/pages/pay-bills/providers";
import PayBillsAccount from "@/pages/pay-bills/account";

import ShopIndex from "@/pages/shop/index";
import TransportIndex from "@/pages/transport/index";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading AfriPay...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show test login or sign in
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/test-login" component={TestLogin} />
        <Route path="/signin" component={SignIn} />
        <Route path="/" component={TestLogin} />
        <Route component={TestLogin} />
      </Switch>
    );
  }

  // Check if user needs onboarding
  if (!user || !user.firstName || !user.lastName) {
    return (
      <Switch>
        <Route path="/test-login" component={TestLogin} />
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/" component={TestLogin} />
        <Route component={TestLogin} />
      </Switch>
    );
  }

  // Check if user needs KYC
  if (user && user.kycStatus !== 'verified') {
    return (
      <Switch>
        <Route path="/test-login" component={TestLogin} />
        <Route path="/kyc" component={KYC} />
        <Route path="/" component={KYC} />
        <Route component={KYC} />
      </Switch>
    );
  }

  // Authenticated and verified - show main app with accessibility enhancements
  return (
    <>
      <SkipNav />
      <div id="main-content" role="main" tabIndex={-1}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/profile" component={Profile} />
          <Route path="/qr" component={QR} />
          <Route path="/services" component={Services} />
          <Route path="/transactions" component={Transactions} />
          <Route path="/wallets" component={Wallets} />
          <Route path="/test-login" component={TestLogin} />
          <Route path="/signin" component={SignIn} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/kyc" component={KYC} />
          <Route path="/preset-users" component={PresetUsers} />
          <Route path="/partnerships" component={PartnershipsPage} />
          <Route path="/accessibility-demo" component={AccessibilityDemo} />
          <Route path="/language-demo" component={LanguageDemo} />
          <Route path="/cultural-accessibility" component={CulturalAccessibilityDemo} />
          <Route path="/component-library" component={ComponentLibrary} />
          <Route path="/admin" component={AdminPage} />
          
          {/* Service Journey Routes */}
          <Route path="/send-money" component={SendMoneyIndex} />
          <Route path="/send-money/amount" component={SendMoneyAmount} />
          <Route path="/send-money/confirm" component={SendMoneyConfirm} />
          <Route path="/send-money/success" component={SendMoneySuccess} />
          
          <Route path="/buy-airtime" component={BuyAirtimeIndex} />
          <Route path="/buy-airtime/amount" component={BuyAirtimeAmount} />
          <Route path="/buy-airtime/confirm" component={BuyAirtimeConfirm} />
          <Route path="/buy-airtime/success" component={BuyAirtimeSuccess} />
          
          <Route path="/pay-scan" component={PayScanIndex} />
          
          <Route path="/pay-bills" component={PayBillsIndex} />
          <Route path="/pay-bills/providers" component={PayBillsProviders} />
          <Route path="/pay-bills/account" component={PayBillsAccount} />
          
          <Route path="/shop" component={ShopIndex} />
          <Route path="/transport" component={TransportIndex} />
          
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <MultilingualAccessibilityProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </MultilingualAccessibilityProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
