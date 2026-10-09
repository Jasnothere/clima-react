import { useState, useMemo, useEffect, useRef } from "react";
import "./App.css";
import { useFetch } from "./hooks/useFetch";
import { describirClima } from "./clima";

export default function App() {
  const [texto, setTexto] = useState("");
  const [ciudad, setCiudad] = useState(null);

  const urlCiudades =
    texto.length >= 3
      ? `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(texto)}&count=5&language=es`
      : null;
  const ciudades = useFetch(urlCiudades);

  const urlClima = ciudad
    ? `https://api.open-meteo.com/v1/forecast?latitude=${ciudad.latitude}&longitude=${ciudad.longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
    : null;

  const clima = useFetch(urlClima);

  const resumen = useMemo(() => {
    if (!clima.datos) return null;

    console.log("calculando resumen");

    const {
      time,
      temperature_2m_max: max,
      temperature_2m_min: min,
    } = clima.datos.daily;
    const maxima = Math.max(...max);

    return {
      maxima: maxima,
      minima: Math.min(...min),
      dia: time[max.indexOf(maxima)],
    };
  }, [clima.datos]);

  const entrada = useRef(null);

  useEffect(() => {
    entrada.current.focus();
  }, []);

  const limpiar = () => {
    setTexto("");
    setCiudad(null);
    entrada.current.focus();
  };

  useDebounce(texto, 400);

  return (
    <div>
      <h1>Clima</h1>
      <label>Buscador: </label>
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Ingrese un valor..."
        ref={entrada}
      />
      <button onClick={limpiar}>Limpiar</button>
      {ciudades.cargando && <p>Buscando...</p>}
      {ciudades.error && <p>Error: {ciudades.error}</p>}
      {ciudades.datos && !ciudades.datos.results && <p>Sin resultados</p>}

      <ul>
        {ciudades.datos?.results?.map((c) => (
          <li key={c.id} onClick={() => setCiudad(c)}>
            {c.name}, {c.admin1}, {c.country}
          </li>
        ))}
      </ul>

      {ciudad && (
        <div>
          <h2>{ciudad.name}</h2>

          {clima.cargando && <p>Cargando clima...</p>}
          {clima.error && <p>Error: {clima.error}</p>}

          {clima.datos && (
            <>
              <p>
                {clima.datos.current.temperature_2m} °C ·{" "}
                {describirClima(clima.datos.current.weather_code)} · viento{" "}
                {clima.datos.current.wind_speed_10m} km/h
              </p>

              <p>
                Esta semana: máxima {resumen.maxima} °C, mínima {resumen.minima}{" "}
                °C. El día más caluroso es el {resumen.dia}.
              </p>

              <ul>
                {clima.datos.daily.time.map((fecha, i) => (
                  <li key={fecha}>
                    {fecha}: mínima {clima.datos.daily.temperature_2m_min[i]}{" "}
                    °C, máxima {clima.datos.daily.temperature_2m_max[i]} °C,{" "}
                    {describirClima(clima.datos.daily.weather_code[i])}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
