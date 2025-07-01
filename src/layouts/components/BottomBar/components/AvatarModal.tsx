import NavMenu from '@/layouts/components/NavMenu';
import { Modal, ModalContent } from '@heroui/react';

interface AvatarModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

function AvatarModal({ isOpen, setOpen }: AvatarModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      size="5xl"
      backdrop="blur"
      placement="bottom"
      onOpenChange={setOpen}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut',
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
    >
      <ModalContent>
        <NavMenu type="bottombar" />
      </ModalContent>
    </Modal>
  );
}

export default AvatarModal;
