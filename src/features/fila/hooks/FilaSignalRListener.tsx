'use client';

import { useFilaSignalR } from "@/features/fila/hooks/useFilaSignalR";
import { useEffect } from "react";
import { carregarDadosIniciais } from "../services/FilaService";
import { useFilaContext } from "../context/FilaProvider";
import { parseCookies } from "nookies";
import { setAuthorizationHeader } from "@/api/api";

export function FilaSignalRListener() {
    const { setAllClients } = useFilaContext();

    useEffect(() => {
        async function carregarDados() {
          try {
            const { "auth.token": token } = parseCookies();
            if (token) setAuthorizationHeader(token); // <--- AQUI está o ponto que faltava
      
            const { filaData, chamadasData } = await carregarDadosIniciais();
            setAllClients([...filaData, ...chamadasData]);
          } catch (error) {
            console.error("Erro ao carregar dados iniciais:", error);
          }
        }
      
        carregarDados();
      }, [setAllClients]);
    useFilaSignalR(); // Remova a duplicação
    
    return null;
}