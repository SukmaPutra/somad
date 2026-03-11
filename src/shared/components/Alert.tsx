// shared/components/Alert.tsx

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const alertStyles: Record<AlertType, { bg: string; text: string; icon: string }> = {
  success: { bg: 'bg-green-500/10 border-green-500/30', text: 'text-green-400', icon: '✓' },
  error:   { bg: 'bg-red-500/10 border-red-500/30',     text: 'text-red-400',   icon: '✕' },
  warning: { bg: 'bg-yellow-500/10 border-yellow-500/30', text: 'text-yellow-400', icon: '⚠' },
  info:    { bg: 'bg-blue-500/10 border-blue-500/30',   text: 'text-blue-400',  icon: 'ℹ' },
};

export const Alert = ({ type, message, onClose }: AlertProps) => {
  const style = alertStyles[type];

  return (
    <div className={`
      flex items-start gap-3 p-3
      border rounded-lg text-sm
      ${style.bg} ${style.text}
    `}>
      <span className="font-bold mt-0.5">{style.icon}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
      )}
    </div>
  );
};