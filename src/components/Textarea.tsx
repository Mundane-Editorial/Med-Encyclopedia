import { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`input min-h-[120px] resize-y ${error ? 'border-red-300 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
}
