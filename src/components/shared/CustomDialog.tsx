"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

type CustomDialogProps = {
  title: string;
  description?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean; 
  onOpenChange?: (open: boolean) => void; 
};

export function CustomDialog({ title, description, trigger, children, open, onOpenChange }: CustomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
