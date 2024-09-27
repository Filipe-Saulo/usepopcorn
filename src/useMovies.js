import { useState, useEffect } from "react";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  //state abaixo para criar um loading... enquando pega os dados da api
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          const KEY = "f84fc31d";
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          //tratando problemas na internet abaixo
          if (!res.ok)
            throw new Error("Há algum problema ao procurar os filmes");

          const data = await res.json();
          //data.Error === 'false' nao funciona por algum motivo, estou fazendo verificacao com segundo argumento, caso der erro verificar os valores do data no if
          if (
            data.Error === "Movie not found!" ||
            data.Error === "Incorrect IMDb ID." ||
            data.Error === "Too many results."
          )
            throw new Error(
              "Filme não encontrado verifique se a api está funcionando: http://www.omdbapi.com/?apikey=f84fc31d&s=interstellar"
            );

          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
