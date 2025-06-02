import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white shadow-md rounded-xl p-4 ${className}`}>{children}</div>;
}
