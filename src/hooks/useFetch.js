import { useState, useEffect } from 'react';

export const useFetch = (url) => {
    const [ciudades, setCiudades] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (url === null) {
            setCiudades(null);
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

                const datos = await respuesta.json();
                setCiudades(datos.results ?? []);
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
        ciudades,
        cargando,
        error
    };
}