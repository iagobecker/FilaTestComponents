"use client";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1580px] mx-auto px-2 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-5">
      {children}
    </div>
  );
}
