// netlify/functions/obtener-tasa.js

export default async (req, context) => {
  try {
    // 1. Hacemos la petición a la web externa desde el servidor de Netlify
    const response = await fetch("https://alcambio.app/");
    const html = await response.text();

    // 2. Buscamos el input con el precio usando expresiones regulares
    const regex = /<input[^>]*type="text"[^>]*inputmode="numeric"[^>]*value="([^"]+)"/;
    const coincidencia = html.match(regex);

    if (coincidencia && coincidencia[1]) {
      let valorDolar = coincidencia[1]; // Ejemplo: "617,64"
      
      // Limpiamos el formato (convertimos "617,64" a número válido 617.64)
      valorDolar = valorDolar.replace(/\./g, '').replace(',', '.');
      const tasaNumerica = parseFloat(valorDolar);

      // Devolvemos la respuesta usando el objeto Response estándar del navegador
      return new Response(JSON.stringify({ tasa: tasaNumerica }), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Evita bloqueos CORS
          "Content-Type": "application/json"
        }
      });
    } else {
      throw new Error("No se encontró el elemento del precio en la página.");
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al obtener la tasa: " + error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
