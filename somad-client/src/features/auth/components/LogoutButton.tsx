// features/auth/components/LogoutButton.tsx
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/config/routes';


interface LogoutButtonProps {
  variant?: 'primary' | 'ghost' | 'danger';
}

export const LogoutButton = ({ variant = 'ghost' }: LogoutButtonProps) => {
  const { logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <Button
      variant={variant}
      fullWidth
      onClick={handleLogout}
      icon={<LogOut size={16} />}
      iconPosition="left"
      isLoading={isLoading}
    >
      Keluar
    </Button>
  );
};

export default LogoutButton;