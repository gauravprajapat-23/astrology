import RoleModal from '@/admin-components/modals/RoleModal';
import { type StaffRole } from '@/lib/supabase';

interface EditRoleModalProps {
  role: StaffRole;
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function EditRoleModal({ role, onClose, onSuccess, onError }: EditRoleModalProps) {
  return (
    <RoleModal
      mode="edit"
      role={role}
      onClose={onClose}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}
