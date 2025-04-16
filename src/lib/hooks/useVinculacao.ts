'use client';

import { useEffect, useState } from 'react';

export function useVinculacaoStatus() {
  const [vinculado, setVinculado] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const codigo = localStorage.getItem('codigo-vinculacao');

      if (codigo) {
        setVinculado(true);
        localStorage.removeItem('codigo-vinculacao');

        setTimeout(() => {
          setVinculado(false);
        }, 4000);
      }
    }
  }, []);

  return vinculado;
}
