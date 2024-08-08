import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p>Are you sure you want to delete this item?</p>
          <div className="flex justify-end mt-4">
            <button
              className="btn bg-red-500 hover:bg-red-600 text-white mr-2"
              onClick={onConfirm}
            >
              Confirm
            </button>
            <button
              className="btn bg-gray-500 hover:bg-gray-600 text-white"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmationModal;
