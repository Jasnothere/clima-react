import { useState, useEffect } from 'react';

export const useFetch = (url) => {
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (url === null) {
            setDatos(null);
            setError(null);
            setCargando(false);
            return;
        }

        const controlador = new AbortController();

        async function buscar() {
            setCargando(true);
            setError(null);

            try {

                const respuesta = await fetch(
                    url,
                    { signal: controlador.signal }
                );

                if (!respuesta.ok) {

                    throw new Error("Error " + respuesta.status);
                }

                const resultado = await respuesta.json();
                setDatos(resultado);
                setCargando(false);

            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                    setCargando(false);
                }
            }
        }

        buscar();

        return () => controlador.abort();

    }, [url]);

    return {
        datos,
        cargando,
        error
    };
}