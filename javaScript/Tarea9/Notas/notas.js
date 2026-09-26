let intentos = 0;
intentos = intentos + 1; // ok, let permite reasignar

const maximoIntentos = 10;
//maximoIntentos = 20; // Error: Assignment to constant variable.

let pendientes = ["tarea", "examen"];
pendientes = []; // ok: let permite reasignar

const invitados = ["Ana", "Miguel", "Luis"]; // Establece un arreglo constante
invitados.pop(); // Quita del final
invitados.push("Carla"); // Carla es agregada al final
//invitados = []; // Error: Assignment to constant variable.
invitados.shift(); //Quita del inicio
invitados.unshift("Neto"); // Agrega al inicio

invitados[2]; //Revisar por index

invitados[2] = "Javier"; //Reasignar por index

let prueba = "No borrar";

if (true) {
  let prueba = "hola";
  console.log(prueba);
}

console.log(prueba);

let dato = "hola";
console.log("dato es: " + typeof dato);

dato = 5;
console.log("dato es: " + typeof dato);

let edad = 70;
let tieneCredencial = false;

if (edad >= 18 && tieneCredencial) {
  console.log("Puede entrar");
}

if (edad < 12 || edad > 65) {
  console.log(`Tarifa especial con ${edad} años`);
}

let nombre = "ian alejandro";

console.log(`El doble de ${edad} es ${edad * 2}`);
console.log(`En mayúsculas: ${nombre.toUpperCase()}`);

let temperatura = 30;

if (temperatura >= 30) {
  console.log("Hace mucho calor");
} else if (temperatura > 20) {
  console.log("Clima agradable");
} else {
  console.log("Hace frío");
}

let dia = 2;

switch (dia) {
  case 1:
    console.log("Lunes");
    break;
  case 2:
    console.log("Martes");
    break;
  case 3:
    console.log("Miércoles");
    break;
  default:
    console.log("Otro día");
}

console.clear();

edad = 80;

let entrada = edad >= 18 ? (edad >= 60 ? "Adulto Mayor" : "Adulto") : "Menor";

console.log(`El usuario es ${entrada.toLowerCase}`);

console.clear();

// for clásico
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// while
intentos = 0;
while (intentos < 3) {
  console.log("Intento " + intentos);
  intentos = intentos + 1;
}

// for...of sobre un arreglo
let colores = ["rojo", "verde", "azul"];
for (let color of colores) {
  console.log(color);
}

console.clear();

for (let invitado of invitados) {
  console.log(invitado);
}

console.clear();

for (let i = 0; i < 30; i++) {
  if (i === 20) break; // termina el ciclo por completo
  if (i % 2 === 0) continue; // salta a la siguiente vuelta
  console.log(i); // imprime 1, 3
}

console.clear();

let numero;
do {
  numero = Math.floor(Math.random() * 10);
  console.log(numero);
} while (numero !== 7);

console.clear();

// Declaración de función
function sumar(a, b) {
  return a + b;
}

// Función flecha (arrow function), guardada en una variable
const sumar2 = (a, b) => {
  return a + b;
};

console.log("sumar" + sumar(2, 3)); // 5
console.log("sumar 2 " + sumar2(2, 3)); // 5

/* FUNCIONES COMO CONST PARA QUE NO SE PUEDAN REDECLARAR */

console.clear();

// Con else: el caso normal queda anidado
function dividir(a, b) {
  if (b !== 0) {
    return a / b;
  } else {
    return null;
  }
}

// Con cláusula de guarda: el caso inválido sale primero
function dividir2(a, b) {
  if (b === 0) {
    return null; // se sale aquí, lo de abajo ya no corre
  }
  return a / b;
}

console.clear();

function esMayorDeEdad(edad) {
  if (edad < 18) {
    return false;
  }
  console.log("Si puede votar");
  return true;
}

if (!esMayorDeEdad(15)) {
  console.log("No puede votar");
}

function saludar(nombre = "invitado") {
  return `Hola, ${nombre}`;
}

saludar("Luis"); // "Hola, Luis"
saludar(); // "Hola, invitado"

console.clear();

let precio = 50;
let cantidad = 4;

function calcularSubtotal(precio, cantidad) {
  return precio * cantidad;
}

function calcularConImpuesto(precio, cantidad) {
  const subtotal = calcularSubtotal(precio, cantidad);
  return subtotal * 1.16;
}

console.clear();

let frutas = ["manzana", "pera", "uva"];

frutas.length; // 3
frutas[0]; // "manzana"
frutas[frutas.length - 1]; // "uva" (el último elemento)

frutas.push("mango"); // agrega al final
frutas; // ["manzana", "pera", "uva", "mango"]

console.clear();

let vidas = [3, 3, 3];

vidas[1] = 5; // [3, 5, 3]
vidas[0] = vidas[0] - 1; // [2, 5, 3]  (usa su propio valor para calcular el nuevo)
vidas[0]--;
vidas[2]++;
vidas[1] += 5;

let calificaciones = [8, 9, 7, 10];
let aprobados = 0; // empieza en 0

for (let i = 0; i < calificaciones.length; i++) {
  if (calificaciones[i] >= 8) {
    aprobados = aprobados + 1;
  }
}

console.log(aprobados + " Aprobados"); // 3

console.clear();

// Regresa la posición del primer número mayor que el límite
function buscarPrimeroMayor(numeros, limite) {
  for (let i = 0; i < numeros.length; i++) {
    if (numeros[i] > limite) {
      return i;
    }
  }
  return -1; // ninguno fue mayor
}

buscarPrimeroMayor([4, 9, 12], 8); // 1
buscarPrimeroMayor([4, 9, 12], 20); // -1

let temperaturas = [35, 23, 8, -2, 5, 19, 20];

temperaturas.forEach((element) => console.log(element * 2));

const dobletemperaturas = temperaturas.map((temperatura) => temperatura * 2);

console.clear();

temperaturas.forEach((element) => console.log(temperatura));

function saludar() {
  document.querySelector("#mensaje").textContent = "¡Hola!";
}
