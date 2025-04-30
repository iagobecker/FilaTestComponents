// "use client";

// import { HeaderFila } from "@/features/fila/components/HeaderFila";
// import { FilaTable } from "@/features/fila/components/table/FilaTable";
// import { TableStatusRecentes } from "@/features/fila/components/table-recentes/TableStatusRecentes";
// import { useFilaContext } from "@/features/fila/context/FilaProvider";

// export function FilaConteudo() {
//   const { filaData, setFilaData, chamadasData, addPerson, forceKey } = useFilaContext();

//   return (
//     <>
//       <HeaderFila addPerson={addPerson} />
//       <FilaTable key={forceKey} data={filaData} setData={setFilaData} />
//       <TableStatusRecentes data={chamadasData.map(item => ({
//         ...item,
//         dataHoraCriado: item.dataHoraCriado || "",
//       }))} />

//     </>
//   );
// }



"use client";

import { HeaderFila } from "@/features/fila/components/HeaderFila";
import { FilaTable } from "@/features/fila/components/table/FilaTable";
import { TableStatusRecentes } from "@/features/fila/components/table-recentes/TableStatusRecentes";
import { useFilaContext } from "@/features/fila/context/FilaProvider";

export function FilaConteudo() {
  const { filaData, setFilaData, chamadasData, addPerson, forceKey, isLoading } = useFilaContext();

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span className="text-gray-700">Carregando...</span>
          </div>
        </div>
      )}
      <HeaderFila addPerson={addPerson} />
      <FilaTable key={forceKey} data={filaData} setData={setFilaData} />
      <TableStatusRecentes
        data={chamadasData.map(item => ({
          ...item,
          dataHoraCriado: item.dataHoraCriado || "",
        }))}
      />
    </div>
  );
}