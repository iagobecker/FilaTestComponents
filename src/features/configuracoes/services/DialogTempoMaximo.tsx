"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogTempoMaximoProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DialogTempoMaximo({ isOpen, onClose }: DialogTempoMaximoProps) {
    const [tempo, setTempo] = useState(0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-sm bg-white rounded-lg shadow-lg p-6">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Tempo de tolerância</DialogTitle>
                    <DialogDescription className="text-gray-500 text-sm">
                        Defina o tempo médio de tolerância em minutos, após o cliente ser chamado.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <label htmlFor="tempo" className="block text-sm font-medium text-gray-700">
                        Tempo máximo de tolerância
                    </label>
                    <input
                        id="tempo"
                        type="number"
                        value={tempo}
                        onChange={(e) => setTempo(Number(e.target.value))}
                        min={1}
                        max={60}
                        step={1}
                        onFocus={(e) => e.target.select()}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 custom-number-input"
                    />
                </div>

                <div className="mt-4 flex justify-end">
                    <Button onClick={onClose} className="max-w-[150px] bg-blue-500 text-white hover:bg-blue-700">
                        Salvar
                    </Button>
                </div>
            </DialogContent>

            <style jsx>{`
                /* Mantém os botões de incremento visíveis */
                input[type="number"] {
                    -moz-appearance: textfield; /* Remove setas no Firefox */
                }

                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    opacity: 1 !important;
                }
            `}</style>
        </Dialog>
    );
}
