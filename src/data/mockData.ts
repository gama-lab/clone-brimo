import { UserProfile, Beneficiary, Bank, Transaction } from '../types';
import mutasiJson from './mutasiData.json';

export const INITIAL_USER: UserProfile = {
  name: 'HERDIANGGA PRATAMA',
  accountNumber: '3819 0104 6674 532',
  maskedAccountNumber: '3819 0104 **** 532',
  accountType: 'Tabungan BRI BritAma',
  balance: 1550000, // Rp 1.550.000
};

export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'ben-allo-1',
    name: 'RICA WIDA JAYANTI',
    accountNumber: '08993782032',
    bankName: 'Allo Bank',
    bankCode: '567',
    initials: 'RJ',
    avatarBg: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'ben-1',
    name: 'MANSYUR',
    accountNumber: '305101043541532',
    bankName: 'BANK BRI',
    bankCode: '002',
    initials: 'M',
    avatarBg: 'bg-slate-100 text-[#1078CA]',
  },
  {
    id: 'ben-2',
    name: 'Nur intan',
    accountNumber: '7302943073',
    bankName: 'BSI',
    bankCode: '451',
    initials: 'NI',
    avatarBg: 'bg-slate-100 text-[#1078CA]',
  },
  {
    id: 'ben-3',
    name: 'RICA WIDA JAYANTI',
    accountNumber: '381901048950536',
    bankName: 'BANK BRI',
    bankCode: '002',
    initials: 'RJ',
    avatarBg: 'bg-slate-100 text-[#1078CA]',
  },
  {
    id: 'ben-4',
    name: 'ASTRI YUNITA SARI',
    accountNumber: '381001017231531',
    bankName: 'BANK BRI',
    bankCode: '002',
    initials: 'AS',
    avatarBg: 'bg-slate-100 text-[#1078CA]',
  },
];

export const SUPPORTED_BANKS: Bank[] = [
  { id: 'bri', name: 'BANK BRI', code: '002', logoBg: 'bg-blue-600', color: '#1078CA' },
  { id: 'bca', name: 'BANK CENTRAL ASIA (BCA)', code: '014', logoBg: 'bg-blue-800', color: '#0060AF' },
  { id: 'mandiri', name: 'BANK MANDIRI', code: '008', logoBg: 'bg-amber-600', color: '#003D79' },
  { id: 'bni', name: 'BANK NEGARA INDONESIA (BNI)', code: '009', logoBg: 'bg-teal-600', color: '#F15A24' },
  { id: 'bsi', name: 'BANK SYARIAH INDONESIA (BSI)', code: '451', logoBg: 'bg-emerald-600', color: '#00A39D' },
  { id: 'allo', name: 'Allo Bank', code: '567', logoBg: 'bg-indigo-600', color: '#5B21B6' },
  { id: 'seabank', name: 'SEABANK INDONESIA', code: '535', logoBg: 'bg-orange-500', color: '#FF5722' },
  { id: 'jago', name: 'BANK JAGO', code: '542', logoBg: 'bg-purple-600', color: '#8A2BE2' },
  { id: 'cimb', name: 'CIMB NIAGA', code: '022', logoBg: 'bg-red-700', color: '#7E1518' },
];

// Transaction from Asehpryanto Rari Parinding (exact from history row 46 & 129)
export const NEW_INCOMING_TX: Transaction = {
  id: 'TRX-172',
  title: 'Transfer Masuk BI-Fast',
  description: 'Transfer BI-Fast dari BANK NEGARA INDONESIA - PT (PERSERO - 1491601822 - Asehpryanto Rari Parinding',
  amount: 1550000,
  type: 'transfer',
  date: '2026-10-31',
  time: '14:20',
  recipientBank: 'BANK NEGARA INDONESIA (BNI)',
  recipientAccount: '1491601822',
  recipientName: 'Asehpryanto Rari Parinding',
  category: 'in',
  referenceNo: '5125798',
  status: 'Sukses',
  balanceAfter: 1550000,
  senderReceiver: 'BFST381901046674532ASEHPRYANTO :BNINIDJA',
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  NEW_INCOMING_TX,
  ...mutasiJson,
];
