export type Screen = 'login' | 'home' | 'mutasi' | 'transfer' | 'qris' | 'aktivitas' | 'account' | 'info-saldo';

export interface UserProfile {
  name: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  avatarUrl?: string;
  maskedAccountNumber: string;
}

export type TransactionType = string;

export interface Transaction {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  recipientBank?: string;
  recipientAccount?: string;
  recipientName?: string;
  category: 'in' | 'out';
  referenceNo: string;
  status: string;
  adminFee?: number;
  balanceAfter?: number;
  senderReceiver?: string;
}

export interface Bank {
  id: string;
  name: string;
  code: string;
  logoBg: string;
  color: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  bankCode: string;
  initials: string;
  avatarBg: string;
}
