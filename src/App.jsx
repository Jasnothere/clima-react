import{useState, useEffect} from 'react';
import './App.css';

export default function app(){
  const [texto, setTexto] = useState("");
  const [ciudades, setCiudades] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(texto.length < 3){
      setCiudades(null);
      return;
    }

      const controlador = new AbortController();

      async function buscar() {
        setCargando(true);
        setError(null);

        try{

          const respuesta = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(texto)}&count=5&language=es`,
            { signal: controlador.signal }
          );

          if(!respuesta.ok){

            throw new Error("Error " + respuesta.status);
          }

          const datos = await respuesta.json();
          setCiudades(datos.results ?? []);
          setCargando(false);

        }catch(err){
          if(err.name !== "AbortError"){
            setError(err.message);
            setCargando(false);
          }
        }
      }

      buscar();

      return () => controlador.abort();

    


  }, [texto]);

  return (
    <div>
      <h1>Clima</h1>
      <label>Buscador: </label>
      <input value={texto} onChange={e => setTexto(e.target.value)} placeholder= "Ingrese un valor..." />
      {cargando && <p>Buscando...</p>}
      {error && <p>Error: {error}</p>}
      {ciudades?.length === 0 && <p>Sin resultados</p>}
      <ul>
        {ciudades?.map(c => <li key={c.id}>{c.name}, {c.admin1}, {c.country} </li>)}
      </ul>
    </div>
  );
}
