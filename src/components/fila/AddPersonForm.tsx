"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AddPersonForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [observation, setObservation] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ name, phone, observation });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-0.5 p-0.5">
            <div className=" p-1 rounded-md">
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder=" Nome"
                    required
                    className="mt-1 block w-full h-8 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
            </div>

            <div className=" p-1 rounded-md">
                <label className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder=" (99) 9999-99999"
                    required
                    className="mt-1 block w-full h-8 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
            </div>

            <div className=" p-1 rounded-md">
                <label className="block text-sm font-medium text-gray-700">Observação interna</label>
                <input
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder=" Observação"
                    className="mt-1 block w-full h-8 rounded-sm border border-gray-200 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
            </div>

            <div className="flex justify-end pt-6">
                <Button type="submit" className="max-w-[150px] bg-blue-400 text-white hover:bg-blue-700">
                    Salvar
                </Button>
            </div>
        </form>
    );
}
