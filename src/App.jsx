import { useState } from 'react';
import './App.css';
import { useFetch } from './hooks/useFetch';

export default function app() {
  const [texto, setTexto] = useState("");

  const url = texto.length >= 3 ? `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(texto)}&count=5&language=es` : null;
  const ciudades = useFetch(url);

  const { ciudades: datos, cargando, error } = ciudades;

  return (
    <div>
      <h1>Clima</h1>
      <label>Buscador: </label>
      <input value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Ingrese un valor..."
      />
      {cargando && <p>Buscando...</p>}
      {error && <p>Error: {error}</p>}
      {datos?.length === 0 && <p>Sin resultados</p>}
      <ul>
        {datos?.map(c => <li key={c.id}>{c.name}, {c.admin1}, {c.country} </li>)}
      </ul>
    </div>
  );
}
