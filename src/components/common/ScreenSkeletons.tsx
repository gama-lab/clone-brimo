import React from 'react';
import { StatusBar } from './StatusBar';

/**
 * High-fidelity Skeleton Loaders for BRImo screens
 * Provides realistic shimmer transitions when switching tabs or loading data
 */

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="min-h-full pb-32 bg-slate-50 flex flex-col select-none animate-in fade-in duration-150">
      {/* Top Blue Header */}
      <div className="bg-[#1078CA] px-4 pt-3 pb-24 relative overflow-hidden">
        <StatusBar darkTheme={true} />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            {/* Avatar Circle */}
            <div className="w-10 h-10 rounded-full skeleton-shimmer bg-white/20" />
            <div className="space-y-1.5">
              <div className="w-24 h-3 rounded-full skeleton-shimmer bg-white/20" />
              <div className="w-32 h-4 rounded-full skeleton-shimmer bg-white/30" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full skeleton-shimmer bg-white/20" />
            <div className="w-8 h-8 rounded-full skeleton-shimmer bg-white/20" />
          </div>
        </div>
      </div>

      {/* Saldo Floating Card */}
      <div className="px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-28 h-3.5 rounded-full skeleton-shimmer" />
            <div className="w-5 h-5 rounded-full skeleton-shimmer" />
          </div>
          <div className="w-44 h-7 rounded-lg skeleton-shimmer" />
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="w-32 h-3 rounded-full skeleton-shimmer" />
            <div className="w-16 h-3 rounded-full skeleton-shimmer" />
          </div>
        </div>
      </div>

      {/* 4 Action Pills Card */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl skeleton-shimmer" />
              <div className="w-10 h-2.5 rounded-full skeleton-shimmer" />
            </div>
          ))}
        </div>
      </div>

      {/* 8 Menu Grid */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-28 h-4 rounded-full skeleton-shimmer" />
            <div className="w-16 h-3 rounded-full skeleton-shimmer" />
          </div>
          <div className="grid grid-cols-4 gap-y-4 gap-x-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 rounded-2xl skeleton-shimmer" />
                <div className="w-12 h-2.5 rounded-full skeleton-shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4 mt-4">
        <div className="w-full h-32 rounded-2xl skeleton-shimmer" />
      </div>
    </div>
  );
};

export const MutasiSkeleton: React.FC = () => {
  return (
    <div className="min-h-full pb-32 bg-slate-50 flex flex-col select-none animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-[#1078CA] px-4 pt-3 pb-4">
        <StatusBar darkTheme={true} />
        <div className="flex items-center justify-between mt-2">
          <div className="w-20 h-5 rounded-full skeleton-shimmer bg-white/30" />
          <div className="w-8 h-8 rounded-full skeleton-shimmer bg-white/20" />
        </div>
        {/* Filter Pills */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="w-20 h-7 rounded-full skeleton-shimmer bg-white/30" />
          <div className="w-20 h-7 rounded-full skeleton-shimmer bg-white/20" />
          <div className="w-20 h-7 rounded-full skeleton-shimmer bg-white/20" />
        </div>
      </div>

      {/* List Items */}
      <div className="p-4 space-y-3">
        <div className="w-28 h-3 rounded-full skeleton-shimmer mb-1" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-10 h-10 rounded-xl skeleton-shimmer flex-shrink-0" />
              <div className="space-y-2 flex-1 pr-4">
                <div className="w-3/4 h-3.5 rounded-full skeleton-shimmer" />
                <div className="w-1/2 h-2.5 rounded-full skeleton-shimmer" />
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <div className="w-20 h-4 rounded-full skeleton-shimmer ml-auto" />
              <div className="w-14 h-2.5 rounded-full skeleton-shimmer ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AktivitasSkeleton: React.FC = () => {
  return (
    <div className="min-h-full pb-32 bg-slate-50 flex flex-col select-none animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="bg-[#1078CA] px-4 pt-3 pb-3">
        <StatusBar darkTheme={true} />
        <div className="flex items-center justify-between mt-2">
          <div className="w-24 h-5 rounded-full skeleton-shimmer bg-white/30" />
          <div className="w-8 h-8 rounded-full skeleton-shimmer bg-white/20" />
        </div>
        {/* Category Pills */}
        <div className="flex items-center space-x-2 mt-3 overflow-x-auto no-scrollbar pb-1">
          <div className="w-16 h-7 rounded-full skeleton-shimmer bg-white/30 flex-shrink-0" />
          <div className="w-16 h-7 rounded-full skeleton-shimmer bg-white/20 flex-shrink-0" />
          <div className="w-24 h-7 rounded-full skeleton-shimmer bg-white/20 flex-shrink-0" />
          <div className="w-20 h-7 rounded-full skeleton-shimmer bg-white/20 flex-shrink-0" />
        </div>
      </div>

      {/* List Items */}
      <div className="p-3 space-y-2.5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-10 h-10 rounded-xl skeleton-shimmer flex-shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1 pr-3">
                <div className="w-20 h-3 rounded-md skeleton-shimmer" />
                <div className="w-36 h-3.5 rounded-full skeleton-shimmer" />
                <div className="w-48 h-2.5 rounded-full skeleton-shimmer" />
                <div className="w-24 h-3.5 rounded-full skeleton-shimmer mt-1" />
              </div>
            </div>
            <div className="w-14 h-5 rounded-full skeleton-shimmer flex-shrink-0 mt-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
};
