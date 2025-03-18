"use client";

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1580px] mx-auto px-6 pt-5 pb-5">
      {children}
    </div>
  );
}
