const listaProductosEl = document.querySelector("#lista-productos");
const panelCheckout = document.querySelector("#panel-checkout");
const productoSeleccionadoEl = document.querySelector("#producto-seleccionado");
const inputCantidad = document.querySelector("#input-cantidad");
const selectMetodoPago = document.querySelector("#select-metodo-pago");
const labelTarjeta = document.querySelector("#label-tarjeta");
const inputTarjeta = document.querySelector("#input-tarjeta");
const btnFinalizar = document.querySelector("#btn-finalizar");
const estadoEl = document.querySelector("#estado-checkout");
const totalCompraEl = document.querySelector("#total-compra");

// Datos (dados, no se modifica su tamaño; stockDisponible SÍ cambia en
// tiempo de ejecución cuando una compra se confirma, ver punto 6)
const productosDisponibles = [
  { id: "p1", nombre: "Café de grano 500g", precio: 110, stockDisponible: 8 },
  { id: "p2", nombre: "Café de grano 1kg", precio: 180, stockDisponible: 6 },
  { id: "p3", nombre: "Café de grano 5kg", precio: 800, stockDisponible: 3 },
];

let productoActual = null;

// ---------- Pintar catálogo y UI (dado, no modificar) ----------
function renderizarProductos() {
  listaProductosEl.innerHTML = "";
  productosDisponibles.forEach((producto) => {
    const li = document.createElement("li");
    li.className = "producto";
    li.innerHTML = `
      <div class="info">
        <strong>${producto.nombre}</strong>
        <span class="precio">$${producto.precio}</span>
        ${
          producto.stockDisponible === 0
            ? '<span class="sin-stock">Sin stock</span>'
            : `<span class="stock">Stock: ${producto.stockDisponible}</span>`
        }
      </div>
      <button ${producto.stockDisponible === 0 ? "disabled" : ""}>Comprar</button>
    `;
    li.querySelector("button").addEventListener("click", () => seleccionarProducto(producto));
    listaProductosEl.append(li);
  });
}

function seleccionarProducto(producto) {
  productoActual = producto;
  productoSeleccionadoEl.textContent = `${producto.nombre} — $${producto.precio} c/u`;
  panelCheckout.hidden = false;
  estadoEl.textContent = "";
  estadoEl.className = "estado";
  inputCantidad.value = 1;
  inputCantidad.max = producto.stockDisponible;
  inputTarjeta.value = "";
  actualizarTotal();
}

// Recalcula el total a pagar cada vez que cambia la cantidad.
function actualizarTotal() {
  if (!productoActual) return;
  const cantidad = Number(inputCantidad.value) || 0;
  totalCompraEl.textContent = `Total: $${(productoActual.precio * cantidad).toFixed(2)}`;
}

inputCantidad.addEventListener("input", actualizarTotal);

selectMetodoPago.addEventListener("change", function () {
  labelTarjeta.hidden = this.value !== "tarjeta";
});

function mostrarEstado(texto) {
  estadoEl.textContent = texto;
  estadoEl.className = "estado cargando";
}

function mostrarExito(pedido) {
  estadoEl.textContent = `¡Pedido #${pedido.numeroPedido} confirmado! ${pedido.cantidad} x ${pedido.producto}`;
  estadoEl.className = "estado exito";
}

function mostrarError(mensaje) {
  estadoEl.textContent = mensaje;
  estadoEl.className = "estado error";
}

// ---------- Cronómetro del cobro  ----------
// llama a iniciarCronometro() justo antes de la
// carrera entre procesarPago y crearTimeoutPago, y a detenerCronometro()
// en cuanto esa carrera termine (haya éxito o error).
const tiempoPagoEl = document.querySelector("#tiempo-pago");
let inicioPago = null;
let intervaloPago = null;

function iniciarCronometro() {
  inicioPago = performance.now();
  actualizarCronometro();
  intervaloPago = setInterval(actualizarCronometro, 100);
}

function actualizarCronometro() {
  const transcurrido = ((performance.now() - inicioPago) / 1000).toFixed(1);
  tiempoPagoEl.textContent = `Tiempo de cobro: ${transcurrido}s (límite 5s)`;
}

function detenerCronometro() {
  clearInterval(intervaloPago);
}

// btnFinalizar.addEventListener("click", realizarCheckout);
document.addEventListener("DOMContentLoaded", renderizarProductos);

// Los puntos a hacer de la tarea:

// 1. Crea una función verificarStock(producto, cantidad) que regrese una
//    promesa y use setTimeout de 500ms para simular que
//    consulta al servidor. Pasados los 500ms:
//    - Si el stock disponible del producto >= cantidad, la promesa se resuelve.
//    - Si no, se rechaza con un Error que diga:
//      `No hay stock suficiente de ${producto.nombre}`.

// 2. Crea una función validarMetodoPago(metodo, numeroTarjeta) que regrese
//    una promesa y use setTimeout de 500ms para simular la validación.
//    Pasados los 500ms:
//    - Si metodo es "paypal", se resuelve siempre.
//    - Si metodo es "tarjeta" y numeroTarjeta tiene exactamente 16
//      dígitos, se resuelve. Para revisarlo puedes usar 
//      la expresión regular /^\d{16}$ con test()
//    - En cualquier otro caso, se rechaza con un Error "Número de
//      tarjeta inválido".

// 3. Crea una función procesarPago(monto, metodo, senal) que regrese una
//    promesa que simule el cobro:
//    - Con setTimeout, tarda un tiempo aleatorio entre 300ms y 6000ms
//    - Al terminar ese tiempo, el cobro puede fallar: se rechaza con un
//      Error "No se pudo conectar con la entidad emisora, intenta de
//      nuevo" falla el 40% de las veces si metodo es "paypal" y el 20% de las
//      veces si es "tarjeta".
//    - Si no falla, se resuelve con un objeto { folioPago }. El
//      folioPago es un número al azar: Math.floor(Math.random() * 1000000)
//    
//    - Opcional, usar senal como un AbortSignal. Si se da,
//      escucha su evento "abort" con senal.addEventListener("abort", ...).
//      Cuando se aborte antes de que termine el cobro, cancela el
//      setTimeout con clearTimeout y rechaza con un Error "Cobro
//      cancelado".

// 4. Crea una función crearTimeoutPago(ms) que regrese una promesa que
//    nunca se resuelve: con setTimeout, pasados "ms" milisegundos se
//    rechaza con un Error "El pago tardó demasiado, intenta de nuevo".


// 5. Crea una función confirmarPedido(producto, cantidad) que regrese una
//    promesa y use setTimeout de 400ms para simular que confirma el
//    pedido. Pasados los 400ms, se resuelve con un objeto
//    { numeroPedido, producto: producto.nombre, cantidad }. numeroPedido
//    es un número al azar de hasta 6 dígitos.

// 6. Crea una función async realizarCheckout() que haga todo el proceso
//    de compra con lo que el usuario escribió en el formulario: la
//    cantidad (inputCantidad), el método de pago (selectMetodoPago) y el
//    número de tarjeta (inputTarjeta), pueden hacerlo en orden:

//    - Deshabilita el botón #btn-finalizar mientras dura el proceso.
//    - Dentro de un try (que indica más tarde donde termina)
//    - Muestra el estado "Verificando stock y método de pago..." (con
//      mostrarEstado) y usa await Promise.all([...]) para correr tanto
//      verificarStock como validarMetodoPago al mismo tiempo con sus respectivos
//      parámetros.
//    - Muestra el estado "Procesando pago..." y llama a
//      iniciarCronometro().
//    - Crea un AbortController y usa
//      await Promise.race([...]) entre procesarPago(monto, metodo,
//      controlador.signal) y crearTimeoutPago(5000)
//      monto = productoActual.precio * cantidad. Así, si el cobro tarda
//      más de 5s, gana el timeout y se muestra su error.
//      Esta carrera va dentro de su propio try/finally, y en el finally:
//      llama a detenerCronometro() y a controlador.abort().
//      abort() nos ayuda a cancelar el cobro en caso de que siga corriendo.
//    - Después muestra el estado "Confirmando pedido..." y espera con await a
//      confirmarPedido con sus respectivos parámetros.
//      Con el pedido que regresa la función llama a mostrarExito,
//      después resta la cantidad comprada del stockDisponible del producto actual y
//      llama a renderizarProductos() para que el catálogo muestre el
//      stock nuevo.
//    - Todo lo anterior va dentro del primer try.
//    - En el catch (si falla cualquier paso) muestra error.message con mostrarError.
//    - En el finally del try principal vuelve a habilitar el botón
//      #btn-finalizar para activarlo nuevamente.
//
//    Después de la función, al final del archivo descomenta la línea
//    btnFinalizar.addEventListener(...) para que llame a la función
