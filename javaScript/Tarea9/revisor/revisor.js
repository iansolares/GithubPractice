/**
 * @param {string} codigoFuente - contenido de carrito-compras.js
 * @returns {object} funciones de lectura + funciones del alumno
 */
function cargarModulo(codigoFuente) {
  const cuerpo =
    codigoFuente +
    `\n;return {
      leerCatalogoNombres: () => catalogoNombres,
      leerCatalogoPrecios: () => catalogoPrecios,
      leerCatalogoStock: () => catalogoStock,
      leerCarritoNombres: () => carritoNombres,
      leerCarritoPrecios: () => carritoPrecios,
      // Llena el carrito directo, sin pasar por agregarAlCarrito — así
      // las pruebas de calcularTotalCarrito y vaciarCarrito no dependen
      // de que agregarAlCarrito esté bien implementado.
      llenarCarrito: (nombres, precios) => {
        carritoNombres.push(...nombres);
        carritoPrecios.push(...precios);
      },
      agregarAlCarrito,
      calcularTotalCarrito,
      vaciarCarrito,
      buscarPorNombre,
    };`;
  return new Function("document", "alert", cuerpo)(crearDocumentoFalso(), () => {});
}

function crearElementoFalso() {
  return {
    textContent: "",
    innerHTML: "",
    value: "",
    dataset: {},
    style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    append() {},
    appendChild() {},
    replaceChildren() {},
    addEventListener() {},
  };
}

function crearDocumentoFalso() {
  return {
    querySelector: crearElementoFalso,
    getElementById: crearElementoFalso,
    createElement: crearElementoFalso,
    querySelectorAll: () => [],
    addEventListener() {},
  };
}

/**
 * Cada prueba recibe el código fuente del alumno y regresa un
 * booleano si funciona. Los puntos suman 100.
 */
const pruebas = [
  {
    id: "P1",
    nombre: "agregarAlCarrito agrega el producto y regresa true cuando hay stock",
    puntos: 15,
    ejecutar(codigo) {
      const carrito = cargarModulo(codigo);
      const resultado = carrito.agregarAlCarrito(0); // Manzanas, stock inicial 5
      return resultado === true && carrito.leerCarritoNombres().includes("Manzanas") && carrito.leerCarritoPrecios().includes(10);
    },
  },
  {
    id: "P2",
    nombre: "agregarAlCarrito descuenta el stock del producto",
    puntos: 10,
    ejecutar(codigo) {
      const carrito = cargarModulo(codigo);
      carrito.agregarAlCarrito(0);
      return carrito.leerCatalogoStock()[0] === 4;
    },
  },
  {
    id: "P3",
    nombre: "agregarAlCarrito sin stock regresa false y no agrega nada",
    puntos: 15,
    ejecutar(codigo) {
      const carrito = cargarModulo(codigo);
      const resultado = carrito.agregarAlCarrito(1); // Leche, stock inicial 0
      return resultado === false && carrito.leerCarritoNombres().length === 0 && carrito.leerCarritoPrecios().length === 0;
    },
  },
  {
    id: "P4",
    nombre: "calcularTotalCarrito suma correctamente varios productos",
    puntos: 10,
    ejecutar(codigo) {
      const carrito = cargarModulo(codigo);
      carrito.llenarCarrito(["Manzanas", "Pan artesanal"], [10, 25]);
      return carrito.calcularTotalCarrito() === 35;
    },
  },
  {
    id: "P5",
    nombre: "calcularTotalCarrito regresa 0 con el carrito vacío",
    puntos: 5,
    ejecutar(codigo) {
      const carrito = cargarModulo(codigo);
      return carrito.calcularTotalCarrito() === 0;
    },
  },
  {
    id: "P6",
    nombre: "vaciarCarrito deja carritoNombres y carritoPrecios vacíos",
    puntos: 10,
    ejecutar(codigo) {
      const carrito = cargarModulo(codigo);
      carrito.llenarCarrito(["Manzanas", "Zanahorias"], [10, 8]);
      carrito.vaciarCarrito();
      return carrito.leerCarritoNombres().length === 0 && carrito.leerCarritoPrecios().length === 0;
    },
  },
  {
    id: "P7",
    nombre: "vaciarCarrito devuelve el stock de cada producto al catálogo",
    puntos: 15,
    ejecutar(codigo) {
      const carrito = cargarModulo(codigo);
      const stockManzanas = carrito.leerCatalogoStock()[0];
      const stockZanahorias = carrito.leerCatalogoStock()[3];
      carrito.llenarCarrito(["Manzanas", "Manzanas", "Zanahorias"], [10, 10, 8]);
      carrito.vaciarCarrito();
      const stock = carrito.leerCatalogoStock();
      return stock[0] === stockManzanas + 2 && stock[3] === stockZanahorias + 1;
    },
  },
  {
    id: "P8",
    nombre: "buscarPorNombre encuentra el índice correcto",
    puntos: 10,
    ejecutar(codigo) {
      const carrito = cargarModulo(codigo);
      return carrito.buscarPorNombre("Leche") === 1;
    },
  },
  {
    id: "P9",
    nombre: "buscarPorNombre regresa -1 si el nombre no existe",
    puntos: 10,
    ejecutar(codigo) {
      const carrito = cargarModulo(codigo);
      return carrito.buscarPorNombre("Refrescos") === -1;
    },
  },
];

// ============================================================
// UI — : checkbox (gris/rojo/verde) por punto, barra de progreso,
// botón para procesar todo, y para "Probar" por punto.
// ============================================================

let score = null;
let barFill = null;

function construirChecklist() {
  const lista = document.getElementById("checklist");
  lista.innerHTML = "";
  pruebas.forEach((prueba) => {
    const li = document.createElement("li");
    li.className = "punto";
    li.innerHTML = `
      <button class="btnProbarUna" data-id="${prueba.id}">Probar</button>
      <input type="checkbox" />
      <label id="${prueba.id}">${prueba.nombre} (${prueba.puntos} pts)</label>
    `;
    lista.appendChild(li);
  });

  lista.querySelectorAll(".btnProbarUna").forEach((boton) => {
    boton.addEventListener("click", () => probarUna(boton.dataset.id));
  });
}

async function resetScore() {
  score.textContent = "0";
  barFill.style.width = "0%";
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach((checkbox) => {
    checkbox.disabled = true;
    checkbox.checked = false;
  });
  document.querySelectorAll(".error-message").forEach((el) => el.remove());
}

function marcarResultado(id, paso, mensajeError) {
  const label = document.querySelector(`#${id}`);
  const checkbox = label ? label.previousElementSibling : null;
  const previoError = label && label.nextElementSibling && label.nextElementSibling.classList.contains("error-message") ? label.nextElementSibling : null;
  if (previoError) previoError.remove();

  if (checkbox) {
    checkbox.disabled = true;
    checkbox.checked = paso;
  }
  if (!paso && mensajeError && label) {
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.style.color = "red";
    errorDiv.textContent = mensajeError;
    label.insertAdjacentElement("afterend", errorDiv);
  }
}

function actualizarScore() {
  const total = pruebas.reduce((suma, prueba) => {
    const label = document.querySelector(`#${prueba.id}`);
    const checkbox = label ? label.previousElementSibling : null;
    return suma + (checkbox && checkbox.checked ? prueba.puntos : 0);
  }, 0);
  score.textContent = total;
  barFill.style.width = total + "%";
}

function leerCodigoFuente() {
  const codigo = document.getElementById("codeInput").value;
  return codigo.trim() ? codigo : null;
}

async function probarUna(id) {
  const codigoFuente = leerCodigoFuente();
  if (!codigoFuente) {
    alert("Sube el archivo carrito-compras.js o pega el código en el cuadro de texto.");
    return;
  }
  const prueba = pruebas.find((p) => p.id === id);
  let paso = false;
  let error = "";
  try {
    paso = Boolean(prueba.ejecutar(codigoFuente));
  } catch (e) {
    error = e.message;
  }
  marcarResultado(id, paso, error);
  actualizarScore();
}

async function procesarTodo() {
  const codigoFuente = leerCodigoFuente();
  if (!codigoFuente) {
    alert("Por favor, pega tu código en el área de texto.");
    return;
  }
  await resetScore();
  for (const prueba of pruebas) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    let paso = false;
    let error = "";
    try {
      paso = Boolean(prueba.ejecutar(codigoFuente));
    } catch (e) {
      error = e.message;
    }
    marcarResultado(prueba.id, paso, error);
    actualizarScore();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  score = document.querySelector("#score");
  barFill = document.querySelector("#progress-bar-fill");
  construirChecklist();
  resetScore();

  document.getElementById("processCodeButton").addEventListener("click", procesarTodo);

  document.getElementById("fileinput").addEventListener("change", async (evt) => {
    const archivo = evt.target.files[0];
    if (!archivo) return;
    if (!archivo.name.toLowerCase().endsWith(".js")) {
      alert("Solo se aceptan archivos .js");
      evt.target.value = "";
      return;
    }
    document.getElementById("codeInput").value = await archivo.text();
    await procesarTodo();
  });
});