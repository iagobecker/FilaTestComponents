export const LOCAL_STORAGE_KEY = 'codigo-vinculacao';

export function salvarCodigoLocal(codigo: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, codigo);
  }
}

export function obterCodigoLocal(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
  }
  return null;
}

export function removerCodigoLocal() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}
