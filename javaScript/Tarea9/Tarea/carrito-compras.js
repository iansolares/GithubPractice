// Catálogo (dado, no se modifica su tamaño)
let catalogoNombres = ["Manzanas", "Leche", "Pan artesanal", "Zanahorias"];
let catalogoPrecios = [10.0, 18.0, 25.0, 8.0];
let catalogoStock = [5, 0, 3, 8];

// Carrito (inicialmente vacío)
let carritoNombres = [];
let carritoPrecios = [];

/*
  1. agregarAlCarrito(indice)

  Recibe el índice de un producto del catálogo.
  Si el producto no tiene stock (0 o menos), la función debe terminar de inmediato con return false.
    Resuelve este caso primero para ahorrar recursos.
  Si hay stock:
    Agrega el nombre del producto a carritoNombres.
    Agrega su precio a carritoPrecios.
    Resta 1 a su stock en catalogoStock.
    Regresa true.
*/
function agregarAlCarrito(indice) {
  if (catalogoStock[indice] <= 0) {
    return false;
  }
  carritoNombres.push(catalogoNombres[indice]);
  carritoPrecios.push(catalogoPrecios[indice]);
  catalogoStock[indice]--;
  return true;
}

/*
  2. calcularTotalCarrito()
  
  Recorre carritoPrecios con un ciclo for y suma todos los precios.
  Regresa el total como número.
  Si el carrito está vacío, debe regresar 0.
*/
function calcularTotalCarrito() {
  let total = 0;
  for (let precio of carritoPrecios) {
    total += precio;
  }
  return total;
}

/*
  3. vaciarCarrito()

  Devuelve al catálogo el stock de cada producto que esté en el carrito: por cada nombre en carritoNombres, suma 1 al stock que le corresponde.
  Después, deja carritoNombres y carritoPrecios como arreglos vacíos.
*/
function vaciarCarrito() {
  if (carritoNombres.length < 1) {
    return false;
  } else {
    for (let nombre of carritoNombres) {
      catalogoStock[buscarPorNombre(nombre)]++;
    }
    carritoNombres = [];
    carritoPrecios = [];
  }
}
/*
  4. buscarPorNombre(nombre)

  Recibe un texto con el nombre de un producto.

  Recorre catalogoNombres con un ciclo for.
  Si encuentra un nombre exactamente igual, regresa su índice.
  Si termina el ciclo sin encontrarlo, regresa -1.
  No uses indexOf(); la idea es practicar ciclos.
*/
function buscarPorNombre(nombre) {
  for (let i = 0; i < catalogoNombres.length; i++) {
    if (nombre === catalogoNombres[i]) {
      return i;
    }
  }
  return -1;
}

// ============================================================
// A partir de aquí solo es DOM, para que la página se vea y
// se pueda probar a mano. Esto NO es necesario cambiarlo ni parte de la tarea.
// Pueden revisar si quieren el código, pero es parte del dom algo que todavía no vemos
// ============================================================

function actualizarVistaCarrito() {
  const lista = document.querySelector("#listaCarrito");
  const totalEl = document.querySelector("#totalCarrito");
  const stockEls = document.querySelectorAll(".stock");

  lista.replaceChildren();
  for (let i = 0; i < carritoNombres.length; i++) {
    const li = document.createElement("li");
    li.textContent = `${carritoNombres[i]} — $${carritoPrecios[i].toFixed(2)}`;
    lista.append(li);
  }

  totalEl.textContent = `$${calcularTotalCarrito().toFixed(2)}`;

  stockEls.forEach((el) => {
    const indice = parseInt(el.dataset.indice);
    el.textContent =
      catalogoStock[indice] > 0
        ? `Stock: ${catalogoStock[indice]}`
        : "Sin stock";
  });
}

function manejarAgregar(indice) {
  const resultado = agregarAlCarrito(indice);
  if (resultado === "Sin stock") {
    alert("Sin stock");
  }
  actualizarVistaCarrito();
}

function manejarVaciar() {
  vaciarCarrito();
  actualizarVistaCarrito();
}

function manejarBuscar() {
  const nombre = document.querySelector("#inputBuscar").value.trim();
  const indice = buscarPorNombre(nombre);
  const resultadoEl = document.querySelector("#resultadoBuscar");
  resultadoEl.textContent =
    indice === -1 ? "No encontrado" : `Encontrado en el índice ${indice}`;
}

actualizarVistaCarrito();
