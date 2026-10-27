import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          let bg = "bg-white border-forest-100 text-charcoal-800 shadow-eco-lg";
          let icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;

          if (toast.type === "error") {
            bg = "bg-red-50 border-red-200 text-red-900 shadow-lg";
            icon = <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
          } else if (toast.type === "award") {
            bg = "bg-forest-900 border-limeAccent text-white shadow-glow-accent";
            icon = <Sparkles className="w-5 h-5 text-limeAccent shrink-0 animate-pulse" />;
          } else if (toast.type === "info") {
            bg = "bg-blue-50 border-blue-200 text-blue-900 shadow-lg";
            icon = <Info className="w-5 h-5 text-blue-500 shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${bg}`}
            >
              <div className="flex items-center gap-3">
                {icon}
                <p className="text-sm font-medium leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 ml-3 p-1 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
