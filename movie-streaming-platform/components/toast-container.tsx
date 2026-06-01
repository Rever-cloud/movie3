'use client';

import { useToast } from '@/lib/context';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="glass rounded-lg p-4 shadow-xl flex items-center gap-3 min-w-[280px] max-w-[400px] animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {toast.type === 'success' && (
            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
          )}
          <p className="text-sm text-foreground flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
