import Modal from './Modal'

export default function FilterDrawer({ open, onClose, children }) {
  return <Modal open={open} onClose={onClose} title="Filters">{children}</Modal>
}
