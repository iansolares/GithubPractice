const listaProductosEl = document.querySelector("#lista-productos");
const mensajeCargaEl = document.querySelector("#mensaje-carga");
const mensajeErrorEl = document.querySelector("#mensaje-error");
const formBuscarEl = document.querySelector("#form-buscar");
const inputBuscarEl = document.querySelector("#input-buscar");

// URLs de la API
const URL_CATALOGO = "https://dummyjson.com/products/category/groceries";
const URL_BUSQUEDA = "https://dummyjson.com/products/search";

// ---------- UI helpers ----------
function mostrarCargando() {
  mensajeCargaEl.textContent = "Cargando productos...";
}

function ocultarCargando() {
  mensajeCargaEl.textContent = "";
}

function mostrarError(mensaje) {
  mensajeErrorEl.textContent = mensaje;
}

function ocultarError() {
  mensajeErrorEl.textContent = "";
}

function crearSpan(clase, texto) {
  const span = document.createElement("span");
  span.className = clase;
  span.textContent = texto;
  return span;
}

formBuscarEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const texto = inputBuscarEl.value.trim();
  if (texto) buscarProductos(texto);
});

// 1. Crea una función async cargarCatalogo():
//    - Haga fetch a URL_CATALOGO (con await).
//    - Si response.ok es false, mandar un Error con un mensaje que incluya
//      response.status, por ejemplo: `Error ${response.status} al cargar
//      el catálogo`.
//    - Si fue exitosa, convierta la respuesta con await response.json() y
//      regrese el arreglo que viene en data.products.

// 2. Crea una función textoRating(reviews):
//    regresa el texto del rating promedio de reviews[i].rating
//    (puedes usar reduce).
//    - Si el arreglo está vacío o no existe: "Sin calificaciones".
//    - Si hay reviews regresa el promedio con un decimal, por ejemplo: "Rating 4.3".
//        - existe una función que redondea a n decimales.

// 3. Crea una función crearElementoProducto(producto):
//    - Regresar un <li> con la siguiente estructura:
//    - debe tener class="producto"
//    - La marca: producto.brand si existe, o el texto "Genérico" si
//      producto.brand es null o undefined.
//    - El código de barras si producto.meta && producto.meta.barcode existe
//      regresar producto.meta.barcode o el texto "N/A" si no existe.
//    - Una <img> con alt producto.title
//      y con src revisar si hay producto.images asignar la primera imagen
//        - si no pueden usar or para asignar producto.thumbnail o vacío "".
//    - Un <div class="producto-info"> que contenga (agregar con append):
//      Usar la función crearSpan de arriba con primer parámetro: 
//      producto-nombre, producto-marca, producto-precio, producto-rating y producto-codigo
//          y el segundo parámetro con el dato correspondiente (asegurarse que sea texto):
//          - El nombre es (producto.title) y el precio en texto (producto.price).
//          - El rating: el texto que regresa textoRating(producto.reviews) (del punto 2).
//          - El codigo de barras de arriba y la marca también de arriba.
//      - Adjunta tanto la <img> como <div> al <li> y regresar el <li>.

// 4. Crea una función pintarProductos(productos) que:
//    - Vacíe #lista-productos (listaProductosEl), puede ser con textContent en vacío.
//    - Recorra el arreglo  y agregue a la lista por cada producto
//      el elemento que regresa crearElementoProducto del punto 3

// 5. Crea una función async init() que:
//    - Llame a ocultarError() y mostrarCargando().
//    - Dentro de un try: llame a cargarCatalogo() del punto 1 con await y,
//      con el resultado, llame a pintarProductos del punto 4.
//    - En el catch, llame a mostrarError con el mensaje del error
//      (error.message).
//    - En el finally, llame a ocultarCargando(). Se ejecuta siempre,
//      haya habido error o no.
//    Fuera de la función 5, descomenta la línea para que init se ejecute
//    cuando la página termine de cargar:

//    document.addEventListener("DOMContentLoaded", init); // DESCOMENTAR (PUNTO 5)

async function buscarProductos(texto) {
  ocultarError();
  mostrarCargando();
  try {
    const response = await fetch(`${URL_BUSQUEDA}?q=${encodeURIComponent(texto)}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status} al buscar "${texto}"`);
    }
    const data = await response.json();
    // La búsqueda de la API trae todas las categorías: nos quedamos con el súper.
    pintarProductos(data.products.filter((p) => p.category === "groceries"));
  } catch (error) {
    mostrarError(error.message);
  } finally {
    ocultarCargando();
  }
}