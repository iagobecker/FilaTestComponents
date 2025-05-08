"use client";

import { useFilaContext } from "../context/FilaProvider";
import { HeaderFila } from "./HeaderFila";
import { TableRecentes } from "./table-recentes/TableRecentes";
import { FilaTable } from "@/features/fila/components/table/FilaTable";


export function FilaContent() {
  const { clientesAguardando, setclientesAguardando, clientesRecentes, addPerson } = useFilaContext();
  return (
    <>
      <HeaderFila addPerson={addPerson} />
      <FilaTable data={clientesAguardando} setData={setclientesAguardando} />
      <TableRecentes
        data={clientesRecentes.map((item) => ({
          ...item,
          status: Number(item.status),
          dataHoraCriado: item.dataHoraCriado ?? "",
        }))}
      />
    </>
  );
}