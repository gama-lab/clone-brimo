import React from 'react';
import { 
  QrCode, 
  Smartphone, 
  Send, 
  Wallet, 
  CreditCard, 
  Building2, 
  Banknote,
  ReceiptText
} from 'lucide-react';
import { Transaction } from '../types';

export interface TransactionCategoryInfo {
  kind: 'ewallet' | 'pulsa_data' | 'qris' | 'briva' | 'transfer' | 'atm';
  brand: string;
  badgeBg: string;
  badgeText: string;
  avatarBg: string;
  avatarBorder: string;
  icon: React.ReactNode;
  receiptIcon: React.ReactNode;
  destinationTitle: string;
  destinationSubtitle: string;
  destinationAccount: string;
  referenceDisplay: string;
}

export function classifyTransaction(tx: Transaction): TransactionCategoryInfo {
  const text = `${tx.title} ${tx.description} ${tx.senderReceiver || ''}`.toLowerCase();

  // Reference number formatting
  let refNo = tx.referenceNo;
  if (tx.senderReceiver && tx.senderReceiver.includes('QRIS')) {
    const qrisRefMatch = tx.senderReceiver.match(/QRIS(?:RNS)?(\d+)/i);
    if (qrisRefMatch && qrisRefMatch[1]) {
      refNo = qrisRefMatch[1];
    }
  }

  // 1. TOP UP E-WALLET (OVO, DANA, GOPAY, SHOPEEPAY)
  if (text.includes('ovo')) {
    const phoneMatch = tx.title.match(/(\d{10,13})/) || tx.description.match(/(\d{10,13})/);
    const phone = phoneMatch ? phoneMatch[1] : '081997824683';
    return {
      kind: 'ewallet',
      brand: 'OVO',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      badgeText: 'Top Up E-Wallet',
      avatarBg: 'bg-purple-600 text-white',
      avatarBorder: 'border-purple-200',
      icon: <Wallet size={18} className="text-purple-600" />,
      receiptIcon: (
        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold text-[11px] flex items-center justify-center tracking-tight shadow-sm">
          OVO
        </div>
      ),
      destinationTitle: `OVO - ${phone}`,
      destinationSubtitle: 'Top Up OVO',
      destinationAccount: phone,
      referenceDisplay: refNo || '241887361920',
    };
  }

  if (text.includes('dana')) {
    const phoneMatch = tx.title.match(/(\d{10,13})/) || tx.description.match(/(\d{10,13})/);
    const phone = phoneMatch ? phoneMatch[1] : '081997824683';
    return {
      kind: 'ewallet',
      brand: 'DANA',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      badgeText: 'Top Up E-Wallet',
      avatarBg: 'bg-[#118EEA] text-white',
      avatarBorder: 'border-sky-200',
      icon: <Wallet size={18} className="text-[#118EEA]" />,
      receiptIcon: (
        <div className="w-10 h-10 rounded-xl bg-[#118EEA] text-white font-black text-[10px] flex items-center justify-center tracking-tight shadow-sm">
          DANA
        </div>
      ),
      destinationTitle: `DANA - ${phone}`,
      destinationSubtitle: 'Top Up DANA',
      destinationAccount: phone,
      referenceDisplay: refNo || '241992837110',
    };
  }

  if (text.includes('gopay') || text.includes('gojek')) {
    return {
      kind: 'ewallet',
      brand: 'GoPay',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      badgeText: 'Top Up E-Wallet',
      avatarBg: 'bg-[#00AA13] text-white',
      avatarBorder: 'border-teal-200',
      icon: <Wallet size={18} className="text-teal-600" />,
      receiptIcon: (
        <div className="w-10 h-10 rounded-xl bg-[#00AA13] text-white font-extrabold text-[10px] flex items-center justify-center tracking-tight shadow-sm">
          GoPay
        </div>
      ),
      destinationTitle: 'GoPay - 081997824683',
      destinationSubtitle: 'Top Up GoPay',
      destinationAccount: '081997824683',
      referenceDisplay: refNo || '241908271625',
    };
  }

  // 2. BELI PAKET DATA / PULSA
  if (text.includes('data') || text.includes('pulsa') || text.includes('xl') || text.includes('telkomsel') || text.includes('indosat')) {
    let brandName = 'Paket Data / Pulsa';
    let provider = 'Seluler';
    let phone = '081997824683';

    if (text.includes('xl')) {
      brandName = 'Paket Data XL';
      provider = 'XL Axiata';
      const m = tx.title.match(/(\d{10,14})/);
      if (m) phone = m[1];
    } else if (text.includes('telkomsel')) {
      brandName = 'Paket Data Telkomsel';
      provider = 'Telkomsel';
    }

    return {
      kind: 'pulsa_data',
      brand: brandName,
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeText: 'Beli Paket Data',
      avatarBg: 'bg-emerald-500 text-white',
      avatarBorder: 'border-emerald-200',
      icon: <Smartphone size={18} className="text-emerald-600" />,
      receiptIcon: (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
          <Smartphone size={20} />
        </div>
      ),
      destinationTitle: `${provider} - ${phone}`,
      destinationSubtitle: brandName,
      destinationAccount: phone,
      referenceDisplay: refNo || '241289100234',
    };
  }

  // 3. PEMBAYARAN BRIVA
  if (text.includes('briva')) {
    return {
      kind: 'briva',
      brand: 'BRIVA',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeText: 'Pembayaran BRIVA',
      avatarBg: 'bg-amber-500 text-white',
      avatarBorder: 'border-amber-200',
      icon: <CreditCard size={18} className="text-amber-600" />,
      receiptIcon: (
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
          <CreditCard size={20} />
        </div>
      ),
      destinationTitle: tx.description.split('-')[0].trim() || 'Pembayaran BRIVA',
      destinationSubtitle: 'BRI Virtual Account',
      destinationAccount: tx.description.replace(/\D/g, '') || '12885918237192',
      referenceDisplay: refNo || '241908234190',
    };
  }

  // 4. TARIK TUNAI / ATM
  if (text.includes('tarik tunai') || text.includes('atm')) {
    return {
      kind: 'atm',
      brand: 'Tarik Tunai',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      badgeText: 'Tarik Tunai',
      avatarBg: 'bg-slate-700 text-white',
      avatarBorder: 'border-slate-300',
      icon: <Banknote size={18} className="text-slate-600" />,
      receiptIcon: (
        <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-sm">
          <Banknote size={20} />
        </div>
      ),
      destinationTitle: 'Tarik Tunai Tanpa Kartu',
      destinationSubtitle: 'ATM Bank BRI',
      destinationAccount: '3819 **** **** 532',
      referenceDisplay: refNo || '241772819203',
    };
  }

  // 5. PEMBELIAN QRIS
  if (text.includes('qris') || tx.type === 'qris') {
    let merchantName = 'Kios Ummy 77';
    if (tx.description && tx.description.includes('-')) {
      const parts = tx.description.split('-');
      if (parts[0].trim() && !parts[0].includes('Merchant QRIS BRI')) {
        merchantName = parts[0].trim();
      } else if (parts[1]) {
        merchantName = `Merchant #${parts[1].trim()}`;
      }
    }
    const qrisId = tx.recipientAccount || 'ID 26020400000239';

    return {
      kind: 'qris',
      brand: 'QRIS',
      badgeBg: 'bg-blue-50 text-[#1078CA] border-blue-200',
      badgeText: 'Pembelian QRIS',
      avatarBg: 'bg-blue-50 text-[#1078CA]',
      avatarBorder: 'border-blue-100',
      icon: <QrCode size={18} className="text-[#1078CA]" />,
      receiptIcon: (
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#1078CA] flex items-center justify-center shadow-xs">
          <QrCode size={20} />
        </div>
      ),
      destinationTitle: merchantName,
      destinationSubtitle: 'QRIS Bayar',
      destinationAccount: qrisId.startsWith('ID') ? qrisId : `ID ${qrisId}`,
      referenceDisplay: refNo || '241336502683',
    };
  }

  // 6. TRANSFER BANK (DEFAULT)
  const isBiFast = text.includes('bi-fast') || text.includes('bfst');
  const recipient = tx.recipientName || tx.title.replace(/Transfer\s+Ke\s+/i, '').replace(/via\s+BRImo/i, '').trim();
  const bank = tx.recipientBank || (isBiFast ? 'BI-Fast' : 'BANK BRI');
  const acc = tx.recipientAccount || '3051 **** **** 532';

  return {
    kind: 'transfer',
    brand: isBiFast ? 'Transfer BI-Fast' : 'Transfer BRI',
    badgeBg: 'bg-blue-50 text-[#1078CA] border-blue-200',
    badgeText: isBiFast ? 'Transfer BI-Fast' : 'Transfer Bank',
    avatarBg: 'bg-[#1078CA] text-white',
    avatarBorder: 'border-blue-200',
    icon: <Send size={18} className="text-[#1078CA]" />,
    receiptIcon: (
      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#1078CA] flex items-center justify-center shadow-xs">
        <Building2 size={20} />
      </div>
    ),
    destinationTitle: recipient || 'MANSYUR',
    destinationSubtitle: bank,
    destinationAccount: acc,
    referenceDisplay: refNo || '241336502683',
  };
}
