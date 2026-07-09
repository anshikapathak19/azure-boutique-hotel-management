import React from 'react'
import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = false,
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="flex flex-col gap-5">
        <p className="font-body text-navy/70 leading-relaxed">
          {message}
        </p>
        
        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-navy"
          >
            {cancelText}
          </Button>
          
          <Button
            type="button"
            variant={isDanger ? 'outline' : 'gold'}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={isDanger ? 'border-rose-500 text-rose-600 hover:bg-rose-500/10' : ''}
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
