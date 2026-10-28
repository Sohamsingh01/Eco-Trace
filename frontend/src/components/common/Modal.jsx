import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-xl",
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop with Smooth Blur */}
      <div
        className="fixed inset-0 bg-charcoal-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog with Scale & Depth Entrance */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          ref={dialogRef}
          className={`relative transform overflow-hidden rounded-3xl bg-white text-left shadow-[0_25px_60px_-15px_rgba(22,101,52,0.25)] transition-all sm:my-8 w-full ${maxWidth} border border-forest-100 animate-in fade-in zoom-in-95 duration-200`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-gray-100 bg-gradient-to-r from-forest-50/70 to-emerald-50/30">
            <h3
              id="modal-title"
              className="text-lg font-black text-forest-950 tracking-tight"
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-charcoal-400 hover:text-charcoal-800 hover:bg-white active:scale-95 transition-all shadow-sm"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
