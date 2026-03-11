// shared/components/FormField.tsx
import { Input } from './Input';
import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export const FormField = ({
  label,
  error,
  hint,
  required,
  ...inputProps
}: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-medium text-(--color-text-secondary)">
        {label}
        {required && <span className="text-[#ef4444] ml-1">*</span>}
      </label>
      <Input error={error} {...inputProps} />
      {hint && !error && (
        <span className="text-xs text-(--color-text-muted)">{hint}</span>
      )}
    </div>
  );
};