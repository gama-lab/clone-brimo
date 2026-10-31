import React, { useState } from 'react';
import { Screen, UserProfile, Transaction } from './types';
import { INITIAL_USER, INITIAL_TRANSACTIONS } from './data/mockData';
import { LoginScreen } from './components/screens/LoginScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { MutasiScreen } from './components/screens/MutasiScreen';
import { TransferScreen } from './components/screens/TransferScreen';
import { QrisScreen } from './components/screens/QrisScreen';
import { AktivitasScreen } from './components/screens/AktivitasScreen';
import { AccountScreen } from './components/screens/AccountScreen';
import { BottomNav } from './components/common/BottomNav';
import { HomeSkeleton, MutasiSkeleton, AktivitasSkeleton } from './components/common/ScreenSkeletons';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  // Navigate handler with smooth realistic skeleton shimmer transition
  const handleNavigate = (screen: Screen) => {
    if (screen === currentScreen) return;

    // Apply quick skeleton loading on primary tab switches
    if (screen === 'home' || screen === 'mutasi' || screen === 'aktivitas') {
      setIsScreenLoading(true);
      setCurrentScreen(screen);
      setTimeout(() => {
        setIsScreenLoading(false);
      }, 350);
    } else {
      setCurrentScreen(screen);
    }
  };

  // Login handler
  const handleLoginSuccess = () => {
    setIsScreenLoading(true);
    setCurrentScreen('home');
    setTimeout(() => {
      setIsScreenLoading(false);
    }, 400);
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentScreen('login');
  };

  // Handle transfer completed
  const handleCompleteTransfer = (newTx: Transaction, newBalance: number) => {
    setTransactions([newTx, ...transactions]);
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  // Handle QRIS payment completed
  const handleQrisPayment = (newTx: Transaction, newBalance: number) => {
    setTransactions([newTx, ...transactions]);
    setUser(prev => ({ ...prev, balance: newBalance }));
  };

  const showBottomNav =
    currentScreen === 'home' ||
    currentScreen === 'mutasi' ||
    currentScreen === 'aktivitas' ||
    currentScreen === 'account';

  return (
    <div className="h-[100dvh] w-full max-w-md mx-auto bg-white flex flex-col relative select-none overflow-hidden">
      {/* Screen Content Router */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-white">
        {currentScreen === 'login' && (
          <LoginScreen onLoginSuccess={handleLoginSuccess} />
        )}

        {/* Skeletons on loading transition */}
        {isScreenLoading && currentScreen === 'home' && <HomeSkeleton />}
        {isScreenLoading && currentScreen === 'mutasi' && <MutasiSkeleton />}
        {isScreenLoading && currentScreen === 'aktivitas' && <AktivitasSkeleton />}

        {!isScreenLoading && currentScreen === 'home' && (
          <HomeScreen
            user={user}
            transactions={transactions}
            onNavigate={handleNavigate}
            onOpenTransfer={() => handleNavigate('transfer')}
          />
        )}

        {!isScreenLoading && currentScreen === 'mutasi' && (
          <MutasiScreen
            user={user}
            transactions={transactions}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'transfer' && (
          <TransferScreen
            user={user}
            onBack={() => handleNavigate('home')}
            onCompleteTransfer={handleCompleteTransfer}
          />
        )}

        {currentScreen === 'qris' && (
          <QrisScreen
            user={user}
            onBack={() => handleNavigate('home')}
            onPaymentSuccess={handleQrisPayment}
          />
        )}

        {!isScreenLoading && currentScreen === 'aktivitas' && (
          <AktivitasScreen
            transactions={transactions}
            user={user}
            onNavigate={handleNavigate}
          />
        )}

        {currentScreen === 'account' && (
          <AccountScreen
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Bottom Navigation (Sticky at bottom, flex-shrink-0 so never pushed down or cut off) */}
      {showBottomNav && (
        <div className="flex-shrink-0 w-full z-40 bg-white">
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={handleNavigate}
            unreadCount={2}
          />
        </div>
      )}
    </div>
  );
};
