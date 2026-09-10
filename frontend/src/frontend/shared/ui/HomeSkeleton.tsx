import React from 'react';
import { Skeleton } from '@/frontend/shared/ui/skeleton';

export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden animate-pulse">
      {/* Navbar Skeleton */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-4 w-32 bg-slate-200" />
            <Skeleton className="h-3 w-24 bg-slate-100" />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <Skeleton className="h-4 w-16 bg-slate-200" />
          <Skeleton className="h-4 w-20 bg-slate-200" />
          <Skeleton className="h-4 w-16 bg-slate-200" />
          <Skeleton className="h-4 w-24 bg-slate-200" />
          <Skeleton className="h-4 w-20 bg-slate-200" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-xl bg-slate-200" />
          <Skeleton className="h-10 w-10 rounded-full bg-slate-200" />
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <div className="relative w-full min-h-[620px] lg:min-h-[720px] bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-slate-900/95 py-12 md:py-20 px-4 md:px-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Badge */}
          <Skeleton className="h-8 w-64 rounded-full bg-slate-700/60 mb-6" />
          {/* Main Title */}
          <Skeleton className="h-12 md:h-16 w-3/4 max-w-2xl rounded-2xl bg-slate-700/70 mb-4" />
          <Skeleton className="h-6 md:h-8 w-1/2 max-w-xl rounded-xl bg-slate-700/50 mb-8" />

          {/* Booking Card Box */}
          <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-20 bg-slate-200" />
                <Skeleton className="h-12 w-full rounded-xl bg-slate-100" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-20 bg-slate-200" />
                <Skeleton className="h-12 w-full rounded-xl bg-slate-100" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-20 bg-slate-200" />
                <Skeleton className="h-12 w-full rounded-xl bg-slate-100" />
              </div>
              <div className="flex flex-col justify-end">
                <Skeleton className="h-12 w-full rounded-xl bg-emerald-600/30" />
              </div>
            </div>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            <Skeleton className="h-6 w-36 rounded-full bg-slate-700/50" />
            <Skeleton className="h-6 w-40 rounded-full bg-slate-700/50" />
            <Skeleton className="h-6 w-32 rounded-full bg-slate-700/50" />
          </div>
        </div>
      </div>

      {/* Tours / Packages Carousel Skeleton */}
      <section className="py-16 md:py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <Skeleton className="h-5 w-32 rounded-full bg-slate-200 mb-3" />
          <Skeleton className="h-10 w-72 md:w-96 rounded-xl bg-slate-300 mb-3" />
          <Skeleton className="h-4 w-60 md:w-80 rounded bg-slate-200" />
        </div>

        {/* 3 Tour Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-[460px]"
            >
              {/* Card Image Shimmer */}
              <div className="relative h-[220px] w-full bg-slate-200">
                <Skeleton className="absolute top-4 right-4 h-7 w-24 rounded-full bg-slate-300" />
                <div className="absolute bottom-4 left-5 right-5 flex flex-col gap-2">
                  <Skeleton className="h-4 w-28 bg-slate-300" />
                  <Skeleton className="h-6 w-48 bg-slate-300" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-6 mb-4">
                  <Skeleton className="h-4 w-24 bg-slate-200" />
                  <Skeleton className="h-4 w-28 bg-slate-200" />
                </div>
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-20 rounded-full bg-slate-100" />
                  <Skeleton className="h-6 w-24 rounded-full bg-slate-100" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-3 w-14 bg-slate-200" />
                    <Skeleton className="h-6 w-24 bg-slate-300" />
                  </div>
                  <Skeleton className="h-10 w-28 rounded-xl bg-emerald-600/30" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
