import RoleModal from '@/admin-components/modals/RoleModal';

interface AddRoleModalProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function AddRoleModal({ onClose, onSuccess, onError }: AddRoleModalProps) {
  return (
    <RoleModal
      mode="add"
      onClose={onClose}
      onSuccess={onSuccess}
      onError={onError}
    />
  );
}
