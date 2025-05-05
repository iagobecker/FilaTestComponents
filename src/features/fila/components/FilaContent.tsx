"use client";

import { useFilaContext } from "../context/FilaProvider";
import { HeaderFila } from "./HeaderFila";
import { TableStatusRecentes } from "./table-recentes/TableStatusRecentes";
import { FilaTable } from "./table/FilaTable";



export function FilaContent() {
  const { filaData, setFilaData, chamadasData, addPerson } = useFilaContext();
  return (
    <>
      <HeaderFila addPerson={addPerson} />
      <FilaTable data={filaData} setData={setFilaData} />
      <TableStatusRecentes
        data={chamadasData.map((item) => ({
          ...item,
          status: Number(item.status),
          dataHoraCriado: item.dataHoraCriado ?? "",
        }))}
      />
    </>
  );
}