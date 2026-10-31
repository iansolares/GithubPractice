const API = "https://jsonplaceholder.typicode.com";
// ---------- datos de respaldo (solo se usan si no hay internet) ----------
const USUARIOS_RESPALDO = [
  {
    id: 1,
    name: "Leanne Graham",
    email: "sincere@april.biz",
    address: { city: "Gwenborough", geo: { lat: "-37.3159", lng: "81.1496" } },
    company: { name: "Romaguera-Crona" },
  },
  {
    id: 2,
    name: "Ervin Howell",
    email: "shanna@melissa.tv",
    address: { city: "Wisokyburgh", geo: { lat: "-43.9509", lng: "-34.4618" } },
    company: { name: "Deckow-Crist" },
  },
  {
    id: 3,
    name: "Clementine Bauch",
    email: "nathan@yesenia.net",
    address: { city: "McKenziehaven", geo: { lat: "-68.6102", lng: "-47.0653" } },
    company: { name: "Romaguera-Jacobson" },
  },
];


function tareasRespaldo(userId) {
  return [
    { userId, id: 1, title: "delectus aut autem", completed: false },
    { userId, id: 2, title: "quis ut nam facilis", completed: true },
    { userId, id: 3, title: "fugiat veniam minus", completed: true },
    { userId, id: 4, title: "et porro tempora", completed: true },
  ];
}


function respuestaFalsa(ok, status, data) {
  return Promise.resolve({ ok, status, json: () => Promise.resolve(data) });
}


function fetchRespaldo(url) {
  const urlStr = String(url);
  if (urlStr.includes(".invalid")) return Promise.reject(new TypeError("Failed to fetch"));
  if (urlStr.includes("/users/9999")) return respuestaFalsa(false, 404, {});
  if (urlStr.includes("/todos?userId=")) {
    const id = Number(decodeURIComponent(urlStr.split("userId=")[1]));
    return respuestaFalsa(true, 200, id >= 1 && id <= 3 ? tareasRespaldo(id) : []);
  }
  if (urlStr.endsWith("/users")) return respuestaFalsa(true, 200, USUARIOS_RESPALDO);
  return respuestaFalsa(false, 404, {});
}


const FETCH_REAL = window.fetch.bind(window);
document.querySelector("#chk-respaldo").addEventListener("change", (e) => {
  window.fetch = e.target.checked ? fetchRespaldo : FETCH_REAL;
});


// ---------- utilidades de impresión en pantalla ----------
function imprimir(id, valor) {
  document.querySelector("#" + id).textContent = typeof valor === "string" ? valor : JSON.stringify(valor, null, 2);
}


function imprimirError(id, error) {
  imprimir(id, "Falló: " + error.message + "  (¿sin internet? activa los datos de respaldo)");
}


document.querySelector("#btn-1").addEventListener("click", async () => {
  try {
    const response = await fetch(`${API}/users`);
    imprimir("out-1", {
      "¿qué es response?": "un objeto Response, NO los datos todavía",
      ok: response.ok,
      status: response.status,
    });
  } catch (error) {
    imprimirError("out-1", error);
  }
});


document.querySelector("#btn-2").addEventListener("click", async () => {
  try {
    const response = await fetch(`${API}/users/1`);
    const data = await response.json();
    imprimir("out-2", { "response.status": response.status, data: data });
    console.log(data.address.city);
  } catch (error) {
    imprimirError("out-2", error);
  }
});


document.querySelector("#btn-3").addEventListener("click", async () => {
  console.log("Random User Medium");
  try {
    const response = await fetch(`https://randomuser.me/api/`);
    const data = await response.json();
    console.log(data);
    console.log(data.results[0])
    const foto = (data.results[0].picture.medium)
    document.querySelector("#miImagen").src=foto;
  } catch (error) {
    console.log("Error en api randomuser");
  }
});






