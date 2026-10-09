import { useState, useEffect } from 'react';

export const useDebounce = (valor, ms) => {
    const [valorDemorado, setValorDemorado] = useState(valor);

    useEffect(() => {
        const id = setTimeout(() => {
            setValorDemorado(valor);
        }, ms);

        return () => clearTimeout(id);
    }, [valor, ms]);

    return valorDemorado;
}
