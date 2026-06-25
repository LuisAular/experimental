// netlify/functions/obtener-tasa.js

exports.handler = async function(event, context) {
  try {
    // 1. Hacemos la petición a la web externa desde el servidor de Netlify
    const response = await fetch("https://alcambio.app/");
    const html = await response.text();

    // 2. Buscamos el input específico usando expresiones regulares (búsqueda de texto avanzada)
    // Buscamos un input que tenga type="text", inputmode="numeric" y extraemos su value
    const regex = /<input[^>]*type="text"[^>]*inputmode="numeric"[^>]*value="([^"]+)"/;
    const coincidencia = html.match(regex);

    if (coincidencia && coincidencia[1]) {
      let valorDolar = coincidencia[1]; // Ejemplo: "617,64"
      
      // Limpiamos el formato (convertir "617,64" de texto a número válido 617.64)
      valorDolar = valorDolar.replace('.', '').replace(',', '.');
      const tasaNumerica = parseFloat(valorDolar);

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", // Permite que tu app lo lea sin bloqueos CORS
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ tasa: tasaNumerica })
      };
    } else {
      throw new Error("No se encontró el elemento del precio en la página.");
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al obtener la tasa: " + error.message })
    };
  }
};