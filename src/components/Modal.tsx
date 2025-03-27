"use client";

import { Dialog, DialogOverlay, DialogContent } from "./ui/dialog";


type ModalProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
  };
  
  export function Modal({ open, onClose, children }: ModalProps) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}>
        <DialogOverlay>
          <DialogContent className="overflow-y-hidden">
            {children}
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    );
  }
  

