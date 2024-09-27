import { useEffect } from "react";

export function useKey(key, action) {
  //effect para reagir ao esc do teclado e fechar o filme quando selecionado
  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) {
          action();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("kewdown", callback);
      };
    },
    [action, key]
  );
}
