'use client';

import React from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  buttonText: string;
  isOpen: boolean;
  isLoading: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  message,
  onConfirm,
  onCancel,
  isOpen,
  buttonText,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-base-100 p-6 rounded-2xl shadow-lg w-80 text-center animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">{message}</h3>
        <div className="flex justify-around">
          <button onClick={onConfirm} className="btn btn-error btn-sm">
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {buttonText}...
              </>
            ) : (
              'Confirm'
            )}
          </button>
          <button onClick={onCancel} className="btn btn-ghost btn-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
