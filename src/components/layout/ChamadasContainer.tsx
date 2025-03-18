"use client";

export function ChamadasContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-0.5 shadow-sm mt-4">
      {children}
    </div>
  );
}
