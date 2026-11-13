import React, { useState, useEffect } from 'react';
import { Screen, UserProfile, Transaction } from './types';
import { INITIAL_USER, INITIAL_TRANSACTIONS } from './data/mockData';
import { initTransactionsDB, addTransactionToDB } from './utils/indexedDB';
import { LoginScreen } from './components/screens/LoginScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { MutasiScreen } from './components/screens/MutasiScreen';
import { TransferScreen } from './components/screens/TransferScreen';
import { QrisScreen } from './components/screens/QrisScreen';
import { AktivitasScreen } from './components/screens/AktivitasScreen';
import { AccountScreen } from './components/screens/AccountScreen';
import { InfoSaldoScreen } from './components/screens/InfoSaldoScreen';
import { BottomNav } from './components/common/BottomNav';
import { HomeSkeleton, MutasiSkeleton, AktivitasSkeleton } from './components/common/ScreenSkeletons';
import { BrimoAlertModal, BrimoAlertData } from './components/common/BrimoAlertModal';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const savedBalance = localStorage.getItem('brimo_user_balance');
      if (savedBalance !== null) {
        const num = Number(savedBalance);
        if (!isNaN(num)) {
          return { ...INITIAL_USER, balance: num };
        }
      }
    }
    return INITIAL_USER;
  });
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [alertData, setAlertData] = useState<BrimoAlertData>({
    isOpen: false,
    title: '',
  });

  // Initialize and load transactions from IndexedDB
  useEffect(() => {
    let isMounted = true;
    initTransactionsDB(INITIAL_TRANSACTIONS)
      .then((data) => {
        if (isMounted) {
          setTransactions(data);
        }
      })
      .catch((err) => {
        console.warn('Failed to initialize IndexedDB transactions:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Global override of browser alert to custom authentic BRImo alert modal
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message?: any) => {
      const msgStr = String(message ?? '');
      setAlertData({
        isOpen: true,
        title: msgStr,
      });
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

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

  // Handle transfer completed - Persist to IndexedDB
  const handleCompleteTransfer = (newTx: Transaction, newBalance: number) => {
    addTransactionToDB(newTx);
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => ({ ...prev, balance: newBalance }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('brimo_user_balance', String(newBalance));
    }
  };

  // Handle QRIS payment completed - Persist to IndexedDB
  const handleQrisPayment = (newTx: Transaction, newBalance: number) => {
    addTransactionToDB(newTx);
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => ({ ...prev, balance: newBalance }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('brimo_user_balance', String(newBalance));
    }
  };

  const showBottomNav =
    currentScreen === 'home' ||
    currentScreen === 'mutasi' ||
    currentScreen === 'aktivitas' ||
    currentScreen === 'account';

  return (
    <div className="h-full w-full max-w-md mx-auto bg-white flex flex-col relative select-none overflow-hidden">
      {/* Screen Content Router (Strictly bounded with min-h-0 so screens manage internal scroll without pushing topbar/bottombar) */}
      <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col bg-white">
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

        {currentScreen === 'info-saldo' && (
          <InfoSaldoScreen
            user={user}
            onBack={() => handleNavigate('home')}
            onNavigateMutasi={() => handleNavigate('mutasi')}
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

      {/* Global Custom BRImo Alert Modal (replaces all native browser alerts) */}
      <BrimoAlertModal
        data={alertData}
        onClose={() => setAlertData(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
