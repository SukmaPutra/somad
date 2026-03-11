// shared/components/Input.tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, leftIcon, rightIcon, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-(--color-text-muted)">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={`
              w-full
              bg-(--color-input-bg)
              text-(--color-text-primary)
              border rounded-lg px-4 py-2.5
              placeholder:text-(--color-text-muted)
              focus:outline-none focus:ring-2 focus:ring-[#137fec]
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error
                ? "border-[#ef4444]"
                : "border-(--color-input-border)] hover:border-[#137fec]/50"
              }
              ${leftIcon  ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-(--color-text-muted)">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span className="text-[#ef4444] text-xs">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";