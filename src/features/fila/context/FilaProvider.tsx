// "use client";

// import {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
//   Dispatch,
//   SetStateAction,
// } from "react";
// import { EditaCampos, FilaItem, Status, StatusType } from "@/features/fila/components/types/filaTypes";
// import { setAuthorizationHeader } from "@/api/api";
// import { parseCookies } from "nookies";// Utilitário para ler cookies
// import { toast } from "sonner";
// import { padraoCliente } from "@/lib/utils/padraoCliente"; // Função para padronizar o cliente
// import {
//   adicionarCliente, buscarClientesFila, editarCliente, removerClientes, retornarClienteParaFila,
//   trocarPosicaoCliente as serviceTrocarPosicaoCliente, marcarComoAtendido as serviceMarcarComoAtendido,
//   marcarComoNaoCompareceu as marcarComoNaoCompareceuAPI
// } from "@/features/fila/services/FilaService";



// // interface descrevendo tudo que será compartilhado no contexto
// interface FilaContextType {
//   contagemSelecionada: number;
//   setContagemSelecionada: (count: number) => void;
//   filaData: FilaItem[];
//   setFilaData: Dispatch<SetStateAction<FilaItem[]>>;
//   chamadasData: FilaItem[];
//   setChamadasData: Dispatch<SetStateAction<FilaItem[]>>;
//   setAllClients: Dispatch<SetStateAction<(FilaItem)[]>>;
//   removerSelecionados: (selectedIds: string[]) => Promise<void>;
//   chamarSelecionados: (selectedIds: string[]) => void;
//   trocarPosicaoCliente: (id: string, direction: "up" | "down") => Promise<void>;
//   atualizarStatusEReorganizar: (id: string, status: StatusType) => void;
//   editPerson: (clienteCompleto: FilaItem, camposEditados: EditaCampos) => void;
//   retornarParaFila: (id: string) => void;
//   removerChamada: (id: string) => void;
//   marcarComoAtendido: (id: string) => void;
//   marcarComoNaoCompareceu: (id: string) => void;
//   editPayload: (orig: FilaItem, edicao: EditaCampos) => FilaItem;
//   addPerson: (nome: string, telefone: string, observacao: string) => Promise<void>;
//   updateClientStatus: (id: string, status: StatusType) => void;
//   forceKey: number;
//   forceRender: () => void; // Função para forçar renderização
//   substituirClientes: (clientesNovos: (FilaItem)[]) => void;
// }

// // Cria o contexto com um valor padrão indefinido
// const FilaContext = createContext<FilaContextType | undefined>(undefined);

// // Hook para acessar o contexto de forma mais fácil
// export const useFilaContext = () => {
//   const context = useContext(FilaContext); // acessa o contexto atual
//   if (!context) {
//     throw new Error("useFilaContext deve ser usado dentro de um FilaProvider");
//   }
//   return context;
// };


// export function FilaProvider({ children }: { children: ReactNode }) {
//   const [contagemSelecionada, setContagemSelecionada] = useState(0);
//   const [allClients, setAllClients] = useState<(FilaItem)[]>([]);
//   const [filaData, setFilaData] = useState<FilaItem[]>([]);
//   const [chamadasData, setChamadasData] = useState<FilaItem[]>([]);
//   const [notification, setNotification] = useState<string | null>(null);
//   const [forceKey, setForceKey] = useState(0);

//    // Atualiza filaData e chamadasData sempre que allClients mudar
//    useEffect(() => {
//     const fila = allClients
//         .filter(client => client.status === 1)
//         .sort((a, b) => {
//             const aData = new Date(a.dataHoraOrdenacao ?? a.dataHoraCriado ?? 0).getTime();
//             const bData = new Date(b.dataHoraOrdenacao ?? b.dataHoraCriado ?? 0).getTime();
//             return aData - bData;
//         });
//     const chamadas = allClients.filter(client => client.status !== 1);
//     setFilaData(fila as FilaItem[]);
//     setChamadasData(chamadas as FilaItem[]);
// }, [allClients]);

//   useEffect(() => {
//     async function loadFila() {
//       try {
//         const { "auth.token": token } = parseCookies();
//         if (token) setAuthorizationHeader(token);

//         const fila = await buscarClientesFila();

//         const all = fila.map(item => ({
//           ...item,
//           id: item.id ?? crypto.randomUUID(),
//           filaId: item.filaId ?? "",
//           hash: item.hash ?? "",
//           status: (typeof item.status === "string" ? parseInt(item.status) : item.status) as StatusType,
//           tempo: item.tempo ?? "há 0 minutos",
//           ticket: item.ticket ?? null,
//           observacao: item.observacao ?? "",
//           dataHoraCriado: item.dataHoraCriado ?? new Date().toISOString(),
//         }));

//         setAllClients(all);
//       } catch (error) {
//         console.error("Erro ao carregar fila:", error);
//       }
//     }

//     loadFila();
//   }, []);
  

//   const substituirClientes = (clientesNovos: (FilaItem)[]) => {
//     setAllClients(prev => {
//       const novosIds = new Set(clientesNovos.map(c => c.id));
//       const preservados = prev.filter(c => !novosIds.has(c.id));
//       return [...preservados, ...clientesNovos];
//     });
//   };
  
//   // Função para chamar clientes selecionados (atualiza o status para Chamado)
//   const chamarSelecionados = (selectedIds: string[]) => {
//     setAllClients(prev => {
//       return prev.map(client => {
//         if (selectedIds.includes(client.id)) {
//           return { ...client, status: Status.Chamado, dataHoraChamada: new Date().toISOString() };
//         }
//         return client;
//       });
//     });
//   };


//   const updateClientStatus = (id: string, status: StatusType) => {
//     setAllClients(prev => {
//       const atualizados = prev.map(client =>
//         client.id === id ? { ...client, status } : client
//       );
//       const novosIds = new Set(atualizados.map(c => c.id));
//       const novosClientes = prev.filter(c => !novosIds.has(c.id));
//       return [...novosClientes, ...atualizados];
//     });
//     setForceKey(prev => prev + 1); 
//   };

//   const removerChamada = async (id: string) => {
//     try {
//       await removerClientes([id])

//       // Remove do estado local para sumir da tabela imediatamente
//       setChamadasData(prev => prev.filter(item => item.id !== id)); // Mantém só os itens cujo id é diferente do cliente removido.
//       // se está em allClients:
//       setAllClients(prev => prev.filter(item => item.id !== id));

//       toast.success("Cliente removido com sucesso!");
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message ||
//         "Não foi possível remover o cliente"
//       );
//     }
//   };


//   const marcarComoAtendido = async (id: string) => {
//     try {
//       await serviceMarcarComoAtendido(id);

//       setAllClients(prev => {
//         const atualizados = prev.map(client =>
//           client.id === id ? { ...client, status: 3 } : client
//         );
//         const fila = atualizados.filter(c => c.status === 1);
//         const chamados = atualizados.filter(c => c.status !== 1);

//         return [
//           ...fila.sort((a, b) => (a.posicao! - b.posicao!)),
//           ...chamados
//         ];
//       });

//       toast.success("Cliente marcado como atendido!");
//     } catch (error) {
//       console.error("Erro ao marcar como atendido:", error);
//       toast.error("Erro ao marcar como atendido.");
//     }
//   };


//   const marcarComoNaoCompareceu = async (id: string) => {
//     try {
//       await marcarComoNaoCompareceuAPI(id); // chamada da API
//       updateClientStatus(id, 4); // atualiza o contexto local para refletir o status "Desistiu"
//       toast.success("Cliente marcado como não compareceu!");
//     } catch (error) {
//       console.error("Erro ao marcar como não compareceu:", error);
//       toast.error("Erro ao marcar como não compareceu.");
//     }
//   };


//   const retornarParaFila = async (id: string) => {
//     await retornarClienteParaFila(id)
//     updateClientStatus(id, 1);
//     setNotification("Cliente retornou à fila");
//     setTimeout(() => setNotification(null), 3000);
//   };


//   const removerSelecionados = async (ids: string[]) => {
//     const clientesValidos = allClients.filter(
//       (c) => ids.includes(c.id) && (c.status === 1 || c.status === 2)
//     );

//     if (clientesValidos.length === 0) {
//       console.warn("Nenhum cliente com status válido para remoção.");
//       return;
//     }

//     try {
//       await removerClientes(ids)

//       setAllClients((prev) =>
//         prev.map((client) =>
//           clientesValidos.some((c) => c.id === client.id) // retorna true se algum cliente em clientesValidos tem o mesmo id
//             ? { ...client, status: 5 }
//             : client
//         )
//       );

//       setContagemSelecionada(0);
//       setNotification(`${clientesValidos.length} cliente(s) removido(s)`);
//       setTimeout(() => setNotification(null), 3000);
//     } catch (error) {
//       console.error("Erro ao remover clientes:", error);
//     }
//   };

//   const trocarPosicaoCliente = async (id: string, direction: "up" | "down") => { // id e direction como parametro
//     const fila = allClients // lista todos os clientes do context
//       .filter(c => c.status === 1) // filtra os clientes com status 1 (aguardando)
//       .sort((a, b) => (a.posicao! - b.posicao!)); // Ordena pelo campo posicao, o ! é para garantir que não seja undefined

//     const index = fila.findIndex(c => c.id === id); // Encontra o índice do cliente na fila
//     if (index === -1) return; // Se não encontrar, não faz nada

//     let novaPosicao = fila[index].posicao!; // inicializa a nova posição com a posição atual do cliente

//     if (direction === "up" && index > 0) { // Se a direção for "up" e não estiver no topo
//       novaPosicao = fila[index].posicao! - 1; // Decrementa a posição (subindo na fila)
//     } else if (direction === "down" && index < fila.length - 1) { // Se a direção for "down" e não estiver no final
//       novaPosicao = fila[index].posicao! + 1; // Incrementa a posição (descendo na fila)
//     } else {
//       // Está no topo ou base, não faz nada
//       return;
//     }

//     try {
//       const clientesAPI = await serviceTrocarPosicaoCliente(id, novaPosicao); // Chama a API para trocar a posição do cliente

//       // Atualize seu estado local com o retorno da API

//       setAllClients(prev => { // Atualiza o estado local
//         const chamados = prev.filter(c => c.status !== 1); // Filtra os chamados (status diferente de 1)
//         const aguardando = clientesAPI // Filtra os clientes aguardando (status 1)
//           .filter((c: any) => c.status === 1) // Filtra os clientes aguardando (status 1)
//           .map((item: any) => ({ // Mapeia os clientes aguardando para o formato correto
//             ...item, // Espalha as propriedades do cliente
//             tempo: prev.find(c => c.id === item.id)?.tempo ?? "há 0 minutos" // Mantém o tempo do cliente original ou define como "há 0 minutos"
//           }));
//         return [...aguardando, ...chamados]; // Retorna a nova lista de clientes, com os aguardando atualizados e os chamados inalterados
//       });

//       toast.success("Posição alterada com sucesso!");
//     } catch (err) {
//       toast.error("Erro ao mover cliente");
//     }
//   };

//   const atualizarStatusEReorganizar = (id: string, status: StatusType) => {
//     setAllClients((prev) => {
//       const atualizados = prev.map((c) =>
//         c.id === id ? { ...c, status } : c
//       );
//       const fila = atualizados.filter(c => c.status === 1);
//       const chamados = atualizados.filter(c => c.status !== 1);
//       return [...fila, ...chamados];
//     });
//   };


//   const addPerson = async (nome: string, telefone: string, observacao: string) => {
//     try {
//       await adicionarCliente({
//         nome,
//         telefone,
//         observacao,
//         filaId: "b36f453e-a763-4ee1-ae2d-6660c2740de5", // substitua pelo seu ID correto
//       });

//       const filaAtualizada = await buscarClientesFila();
//       setAllClients(prev => [
//         ...filaAtualizada.map(c => padraoCliente(c)),
//         ...prev.filter(c => c.status !== 1),
//       ]);


//       toast.success("Cliente adicionado com sucesso!");
//     } catch (error) {
//       console.error("Erro ao adicionar cliente:", error);
//       toast.error("Erro ao adicionar cliente.");
//     }
//   };


//   const editPerson = async (clienteCompleto: FilaItem, camposEditados: EditaCampos) => {
//     const payload = editPayload(clienteCompleto, camposEditados);

//     // Valide ANTES de enviar!
//     if (!payload.filaId || !payload.hash) {
//       console.error("Payload inválido: filaId e hash são obrigatórios.", payload);
//       return;
//     }

//     try {
//       await editarCliente(payload)

//       const filaAtualizada = await buscarClientesFila();
//       setAllClients(prev => [
//         ...filaAtualizada.map(c => padraoCliente(c)),
//         ...prev.filter(c => c.status !== 1)
//       ]);
//     } catch (error) {
//       console.error("Erro ao editar cliente:", error);
//     }
//   };

//   const editPayload = (orig: FilaItem, edicao: EditaCampos): FilaItem => {
//     return {
//       ...orig,
//       ...edicao,
//       dataHoraAlterado: new Date().toISOString(),
//       filaId: orig.filaId ?? "",
//       hash: orig.hash ?? "",
//       ticket: orig.ticket ?? null,
//       posicao: orig.posicao !== undefined ? orig.posicao : 0,
//       dataHoraCriado: orig.dataHoraCriado ?? new Date().toISOString(),
//       dataHoraOrdenacao: orig.dataHoraOrdenacao ?? orig.dataHoraCriado ?? new Date().toISOString(),
//       dataHoraChamada: orig.dataHoraChamada ?? null,
//       dataHoraDeletado: orig.dataHoraDeletado ?? null,
//       dataHoraEntrada: orig.dataHoraEntrada ?? null,
//     }
//   }

 

//   // Obj do Contexto com todos os dados e funções que serão compartilhados
//   const contextValue: FilaContextType = {
//     filaData,
//     contagemSelecionada,
//     forceKey,
//     forceRender: () => setForceKey(prev => prev + 1),
//     chamadasData,
//     setContagemSelecionada,
//     setFilaData,
//     setChamadasData,
//     setAllClients,
//     removerSelecionados,
//     chamarSelecionados,
//     updateClientStatus,
//     editPerson,
//     retornarParaFila,
//     removerChamada,
//     marcarComoAtendido,
//     marcarComoNaoCompareceu,
//     trocarPosicaoCliente,
//     atualizarStatusEReorganizar,
//     editPayload,
//     addPerson,
//     substituirClientes,
//   };

//   return (
//     <FilaContext.Provider value={contextValue}>
//       {children}
//     </FilaContext.Provider>
//   );

// }


"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { EditaCampos, FilaItem, Status, StatusType } from "@/features/fila/components/types/filaTypes";
import { setAuthorizationHeader } from "@/api/api";
import { parseCookies } from "nookies";
import { toast } from "sonner";
import { padraoCliente } from "@/lib/utils/padraoCliente";
import {
  adicionarCliente,
  buscarClientesFila,
  editarCliente,
  removerClientes,
  retornarClienteParaFila,
  trocarPosicaoCliente as serviceTrocarPosicaoCliente,
  marcarComoAtendido as serviceMarcarComoAtendido,
  marcarComoNaoCompareceu as marcarComoNaoCompareceuAPI,
  chamarClientesSelecionados,
} from "@/features/fila/services/FilaService";

// Interface do contexto com loading
interface FilaContextType {
  contagemSelecionada: number;
  setContagemSelecionada: (count: number) => void;
  filaData: FilaItem[];
  setFilaData: Dispatch<SetStateAction<FilaItem[]>>;
  chamadasData: FilaItem[];
  setChamadasData: Dispatch<SetStateAction<FilaItem[]>>;
  setAllClients: Dispatch<SetStateAction<FilaItem[]>>;
  removerSelecionados: (selectedIds: string[]) => Promise<void>;
  chamarSelecionados: (selectedIds: string[]) => Promise<void>;
  trocarPosicaoCliente: (id: string, direction: "up" | "down") => Promise<void>;
  atualizarStatusEReorganizar: (id: string, status: StatusType) => void;
  editPerson: (clienteCompleto: FilaItem, camposEditados: EditaCampos) => Promise<void>;
  retornarParaFila: (id: string) => Promise<void>;
  removerChamada: (id: string) => Promise<void>;
  marcarComoAtendido: (id: string) => Promise<void>;
  marcarComoNaoCompareceu: (id: string) => Promise<void>;
  editPayload: (orig: FilaItem, edicao: EditaCampos) => FilaItem;
  addPerson: (nome: string, telefone: string, observacao: string) => Promise<void>;
  updateClientStatus: (id: string, status: StatusType) => void;
  forceKey: number;
  forceRender: () => void;
  substituirClientes: (clientesNovos: FilaItem[]) => void;
  isLoading: boolean; // Novo estado de loading
  setIsLoading: Dispatch<SetStateAction<boolean>>; // Função para atualizar o loading
}

const FilaContext = createContext<FilaContextType | undefined>(undefined);

export const useFilaContext = () => {
  const context = useContext(FilaContext);
  if (!context) {
    throw new Error("useFilaContext deve ser usado dentro de um FilaProvider");
  }
  return context;
};

export function FilaProvider({ children }: { children: ReactNode }) {
  const [contagemSelecionada, setContagemSelecionada] = useState(0);
  const [allClients, setAllClients] = useState<FilaItem[]>([]);
  const [filaData, setFilaData] = useState<FilaItem[]>([]);
  const [chamadasData, setChamadasData] = useState<FilaItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [forceKey, setForceKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Estado de loading

  // Atualiza filaData e chamadasData sempre que allClients mudar
  useEffect(() => {
    const fila = allClients
      .filter(client => client?.status === 1)
      .sort((a, b) => {
        const aData = new Date(a.dataHoraOrdenacao ?? a.dataHoraCriado ?? 0).getTime();
        const bData = new Date(b.dataHoraOrdenacao ?? b.dataHoraCriado ?? 0).getTime();
        return aData - bData;
      });
    const chamadas = allClients.filter(client => client?.status !== 1);
    setFilaData(fila as FilaItem[]);
    setChamadasData(chamadas as FilaItem[]);
  }, [allClients]);

  useEffect(() => {
    async function loadFila() {
      try {
        setIsLoading(true);
        const { "auth.token": token } = parseCookies();
        if (token) setAuthorizationHeader(token);

        const fila = await buscarClientesFila();

        const all = fila.map(item => ({
          ...item,
          id: item.id ?? crypto.randomUUID(),
          filaId: item.filaId ?? "",
          hash: item.hash ?? "",
          status: (typeof item.status === "string" ? parseInt(item.status) : item.status) as StatusType,
          tempo: item.tempo ?? "há 0 minutos",
          ticket: item.ticket ?? null,
          observacao: item.observacao ?? "",
          dataHoraCriado: item.dataHoraCriado ?? new Date().toISOString(),
        }));

        setAllClients(all);
      } catch (error) {
        console.error("Erro ao carregar fila:", error);
        toast.error("Erro ao carregar a fila.");
      } finally {
        setIsLoading(false);
      }
    }

    loadFila();
  }, []);

  const substituirClientes = (clientesNovos: FilaItem[]) => {
    setAllClients(prev => {
      const novosIds = new Set(clientesNovos.map(c => c.id));
      const preservados = prev.filter(c => !novosIds.has(c.id));
      return [...preservados, ...clientesNovos];
    });
  };

  const chamarSelecionados = async (selectedIds: string[]) => {
    try {
      setIsLoading(true);
      await chamarClientesSelecionados(selectedIds);
      setAllClients(prev => {
        return prev.map(client => {
          if (selectedIds.includes(client.id)) {
            return { ...client, status: Status.Chamado, dataHoraChamada: new Date().toISOString() };
          }
          return client;
        });
      });
      setNotification(`${selectedIds.length} cliente(s) chamado(s)`);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Erro ao chamar clientes:", error);
      toast.error("Erro ao chamar clientes.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateClientStatus = (id: string, status: StatusType) => {
    setAllClients(prev => {
      const atualizados = prev.map(client =>
        client.id === id ? { ...client, status } : client
      );
      const novosIds = new Set(atualizados.map(c => c.id));
      const novosClientes = prev.filter(c => !novosIds.has(c.id));
      return [...novosClientes, ...atualizados];
    });
    setForceKey(prev => prev + 1);
  };

  const removerChamada = async (id: string) => {
    try {
      setIsLoading(true);
      await removerClientes([id]);
      setChamadasData(prev => prev.filter(item => item.id !== id));
      setAllClients(prev => prev.filter(item => item.id !== id));
      toast.success("Cliente removido com sucesso!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Não foi possível remover o cliente"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const marcarComoAtendido = async (id: string) => {
    try {
      setIsLoading(true);
      await serviceMarcarComoAtendido(id);
      setAllClients(prev => {
        const atualizados = prev.map(client =>
          client.id === id ? { ...client, status: Status.Atendido } : client
        );
        const fila = atualizados.filter(c => c.status === Status.Aguardando);
        const chamados = atualizados.filter(c => c.status !== Status.Aguardando);
        return [
          ...fila.sort((a, b) => (a.posicao! - b.posicao!)),
          ...chamados,
        ];
      });
      toast.success("Cliente marcado como atendido!");
    } catch (error) {
      console.error("Erro ao marcar como atendido:", error);
      toast.error("Erro ao marcar como atendido.");
    } finally {
      setIsLoading(false);
    }
  };

  const marcarComoNaoCompareceu = async (id: string) => {
    try {
      setIsLoading(true);
      await marcarComoNaoCompareceuAPI(id);
      updateClientStatus(id, Status.Desistente);
      toast.success("Cliente marcado como não compareceu!");
    } catch (error) {
      console.error("Erro ao marcar como não compareceu:", error);
      toast.error("Erro ao marcar como não compareceu.");
    } finally {
      setIsLoading(false);
    }
  };

  const retornarParaFila = async (id: string) => {
    try {
      setIsLoading(true);
      await retornarClienteParaFila(id);
      updateClientStatus(id, Status.Aguardando);
      setNotification("Cliente retornou à fila");
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Erro ao retornar cliente para a fila:", error);
      toast.error("Erro ao retornar cliente para a fila.");
    } finally {
      setIsLoading(false);
    }
  };

  const removerSelecionados = async (ids: string[]) => {
    const clientesValidos = allClients.filter(
      (c) => ids.includes(c.id) && (c.status === Status.Aguardando || c.status === Status.Chamado)
    );

    if (clientesValidos.length === 0) {
      console.warn("Nenhum cliente com status válido para remoção.");
      return;
    }

    try {
      setIsLoading(true);
      await removerClientes(ids);
      setAllClients(prev =>
        prev.map(client =>
          clientesValidos.some(c => c.id === client.id)
            ? { ...client, status: Status.Desistente }
            : client
        )
      );
      setContagemSelecionada(0);
      setNotification(`${clientesValidos.length} cliente(s) removido(s)`);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error("Erro ao remover clientes:", error);
      toast.error("Erro ao remover clientes.");
    } finally {
      setIsLoading(false);
    }
  };

  const trocarPosicaoCliente = async (id: string, direction: "up" | "down") => {
    const fila = allClients
      .filter(c => c.status === Status.Aguardando)
      .sort((a, b) => (a.posicao! - b.posicao!));

    const index = fila.findIndex(c => c.id === id);
    if (index === -1) return;

    let novaPosicao = fila[index].posicao!;
    if (direction === "up" && index > 0) {
      novaPosicao = fila[index].posicao! - 1;
    } else if (direction === "down" && index < fila.length - 1) {
      novaPosicao = fila[index].posicao! + 1;
    } else {
      return;
    }

    try {
      setIsLoading(true);
      const clientesAPI = await serviceTrocarPosicaoCliente(id, novaPosicao);
      setAllClients(prev => {
        const chamados = prev.filter(c => c.status !== Status.Aguardando);
        const aguardando = clientesAPI
          .filter((c: any) => c.status === Status.Aguardando)
          .map((item: any) => ({
            ...item,
            tempo: prev.find(c => c.id === item.id)?.tempo ?? "há 0 minutos",
          }));
        return [...aguardando, ...chamados];
      });
      toast.success("Posição alterada com sucesso!");
    } catch (err) {
      toast.error("Erro ao mover cliente");
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarStatusEReorganizar = (id: string, status: StatusType) => {
    setAllClients(prev => {
      const atualizados = prev.map(c =>
        c.id === id ? { ...c, status } : c
      );
      const fila = atualizados.filter(c => c.status === Status.Aguardando);
      const chamados = atualizados.filter(c => c.status !== Status.Aguardando);
      return [...fila, ...chamados];
    });
  };

  const addPerson = async (nome: string, telefone: string, observacao: string) => {
    try {
      setIsLoading(true);
      await adicionarCliente({
        nome,
        telefone,
        observacao,
        filaId: "b36f453e-a763-4ee1-ae2d-6660c2740de5",
      });

      const filaAtualizada = await buscarClientesFila();
      setAllClients(prev => [
        ...filaAtualizada.map(c => padraoCliente(c)),
        ...prev.filter(c => c.status !== Status.Aguardando),
      ]);
      toast.success("Cliente adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast.error("Erro ao adicionar cliente.");
    } finally {
      setIsLoading(false);
    }
  };

  const editPerson = async (clienteCompleto: FilaItem, camposEditados: EditaCampos) => {
    const payload = editPayload(clienteCompleto, camposEditados);

    if (!payload.filaId || !payload.hash) {
      console.error("Payload inválido: filaId e hash são obrigatórios.", payload);
      return;
    }

    try {
      setIsLoading(true);
      await editarCliente(payload);
      const filaAtualizada = await buscarClientesFila();
      setAllClients(prev => [
        ...filaAtualizada.map(c => padraoCliente(c)),
        ...prev.filter(c => c.status !== Status.Aguardando),
      ]);
      toast.success("Cliente editado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar cliente:", error);
      toast.error("Erro ao editar cliente.");
    } finally {
      setIsLoading(false);
    }
  };

  const editPayload = (orig: FilaItem, edicao: EditaCampos): FilaItem => {
    return {
      ...orig,
      ...edicao,
      dataHoraAlterado: new Date().toISOString(),
      filaId: orig.filaId ?? "",
      hash: orig.hash ?? "",
      ticket: orig.ticket ?? null,
      posicao: orig.posicao !== undefined ? orig.posicao : 0,
      dataHoraCriado: orig.dataHoraCriado ?? new Date().toISOString(),
      dataHoraOrdenacao: orig.dataHoraOrdenacao ?? orig.dataHoraCriado ?? new Date().toISOString(),
      dataHoraChamada: orig.dataHoraChamada ?? null,
      dataHoraDeletado: orig.dataHoraDeletado ?? null,
      dataHoraEntrada: orig.dataHoraEntrada ?? null,
    };
  };

  const contextValue: FilaContextType = {
    filaData,
    contagemSelecionada,
    forceKey,
    forceRender: () => setForceKey(prev => prev + 1),
    chamadasData,
    setContagemSelecionada,
    setFilaData,
    setChamadasData,
    setAllClients,
    removerSelecionados,
    chamarSelecionados,
    updateClientStatus,
    editPerson,
    retornarParaFila,
    removerChamada,
    marcarComoAtendido,
    marcarComoNaoCompareceu,
    trocarPosicaoCliente,
    atualizarStatusEReorganizar,
    editPayload,
    addPerson,
    substituirClientes,
    isLoading, // Novo
    setIsLoading, // Novo
  };

  return (
    <FilaContext.Provider value={contextValue}>
      {children}
    </FilaContext.Provider>
  );
}