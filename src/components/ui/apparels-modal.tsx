// components/ui/apparels-modal.tsx
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Modal = ({ isOpen, onClose }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: "", size: "", price: "" });

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="modal-title"
      aria-hidden={!isOpen}
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white p-6 rounded-lg w-1/3"
        ref={modalRef}
        tabIndex={-1}
      >
        <h2 id="modal-title" className="text-2xl font-semibold mb-4">
          Add Apparel
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter apparel name"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Size</label>
            <input
              type="text"
              name="size"
              placeholder="Enter apparel size"
              className="w-full p-2 border rounded"
              value={formData.size}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Price</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              className="w-full p-2 border rounded"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
