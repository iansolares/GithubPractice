# Pilates Universidad — Notas del Sistema de Reservaciones

### De la reunión con la dueña del estudio

---

## 1. Instalaciones y Capacidad

- El estudio está dividido en dos áreas físicas:
  - **Planta baja** — 5 camas, usadas exclusivamente para clases **grupales**.
  - **Planta alta** — 3 camas, reservadas para clases **semi-particulares** y **particulares**.
- Total: 8 camas en todo el estudio = 8 lugares reservables para clientes, más lista de espera. La lista de espera originalmente era de 2 lugares, pero ahora es de 3 (por clase, en caso de que alguien cancele).
- "10 espacios" = el total de lugares por clase de cara al cliente (8 reservables + [originalmente 2, ahora 3] en lista de espera — el "10" de la nota refleja la cifra anterior de 2 en lista de espera; el total actual es 11 con la lista de espera ahora en 3).

## 2. Tipos de Clase y Paquetes

| Tipo            | Tamaño                               | Ubicación   | Notas                                                                                          |
| --------------- | ------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------- |
| Grupal          | 5 clientes                           | Planta baja | Mayor prioridad de reservación                                                                 |
| Semi-particular | 3 en total (instructor + 2 clientes) | Planta alta | "Transitiva" — pensada como un paso de transición de clases particulares hacia clases grupales |
| Particular      | 1 cliente (instructor + 1)           | Planta alta | Para clientes nuevos o que prefieren atención particular                                       |

- **Orden de prioridad de reservación: Grupal → Semi-particular → Particular**, según qué tipo de clase genera más ingresos para el negocio por sesión.

## 3. Paquetes de Clases y "Tokens"

- Los clientes normalmente compran un **paquete de clases** en lugar de reservar clase por clase — por ejemplo, alguien que asiste 3 veces por semana compraría un **paquete de 12 clases**, pensado para durar aproximadamente un mes.
- Internamente, cada clase comprada dentro de un paquete se representa como un **token**.
- Los tokens son **mensuales y no transferibles** — cualquier token no usado expira al final del mes.
- Reservar una clase consume un token.
- Si un cliente cancela o reagenda (dentro de la ventana permitida — ver sección 6), el mismo token se vuelve a usar para reservar otro horario en lugar de perderse.
- **Pendiente:** Ian aún necesita diseñar el mecanismo real de control/gestión de los tokens.

## 4. Horario Diario / Franjas de Clase

- **Días:** Lunes a sábado
- **Matutino:** 6:00, 7:00, 8:00, luego 9:10, 10:10, 11:10 (clases de 50 min); el turno matutino termina entre 12:00 y 12:10
- **Vespertino:** 17:00, 18:00, 19:00, 20:00
- → 10 franjas de clase al día en total (6 matutinas + 4 vespertinas)

## 5. Personal / Instructores

| Días           | Turno matutino | Turno vespertino |
| -------------- | -------------- | ---------------- |
| Lunes a jueves | 2 instructores | 2 instructores   |
| Viernes        | 2 instructores | 1 instructor     |
| Sábado         | 2 instructores | —                |

- De lunes a jueves (y sábado), los dos instructores cubren ambas áreas al mismo tiempo: clases grupales en planta baja, clases semi-particulares en planta alta.

## 6. Reglas de Reservación y Cancelación

- Dos vías de reservación:
  - **Reservación desde casa:** los clientes reservan y pagan a través del sitio web.
  - **Reservación en persona:** los clientes también pueden agendar en el estudio y pagar en efectivo.
- Ian todavía necesita investigar/implementar el procesamiento de pagos en línea para la vía de reservación por el sitio web.
- **Plazo de cancelación:** se debe cancelar al menos 12 h antes de la clase.
- **Política de reagendado** (escalonada según el aviso previo):
  - **24 h o más antes de la clase:** se puede cambiar a cualquier otro día/horario, si hay espacio disponible.
  - **Entre 12 y 24 h antes de la clase:** solo se puede reagendar dentro del _mismo día_, a otro horario (el sistema debe alertar al admin/cliente de esta restricción).
  - **Menos de 12 h antes de la clase:** la reservación queda fija — no se permiten cambios.
- **Límite de reservación anticipada en línea:** aún sin decidir. La idea es no poner límite del lado del admin, pero sí un límite para los clientes que reservan por el sistema en línea — número exacto **pendiente**.

## 7. Incentivos de Precio — Pendiente

- Descuento por pago anticipado — monto aún sin definir.
- Recargo por pago tardío — monto aún sin definir.

## 8. Clientes VIP

- Tres clientes específicos ya existentes pagan un año completo de clases por adelantado.
- Lo que reciben: su lugar agendado está **siempre garantizado**, sin necesidad de checar disponibilidad — incluso si están fuera de la ciudad.
- No les preocupa perder alguna clase ocasional; su prioridad es tener la certeza de un lugar cuando sí asisten.

## 9. Clase Diagnóstica Inicial — Pendiente

- Los clientes nuevos reciben una clase diagnóstica inicial gratuita (sin costo).
- Aún sin decidir con la dueña: si se debe limitar esto solo a los viernes, ya que el viernes es el día más lento del estudio y así se evitaría desplazar reservaciones regulares en días con más demanda.

## 10. Campos de Datos del Cliente

Del sistema actual: **Nombre completo, Sexo, Edad, Lesiones, Saldo**.

## 11. Roles de Usuario / Estructura del Sitio (boceto, p.2)

- **Vista Cliente:** ve instructor, tipo de clase y horario.
- **Vista Admin:** ve la lista de clientes.
- Boceto de navegación del sitio de cara al cliente: **Inicio / Quiénes somos / Clases** (pestañas).

## 12. Boceto del Calendario Admin (boceto, p.3)

- Un boceto general de cuadrícula/calendario para la vista de agenda del admin. Es solo una referencia de diseño — no se capturó detalle funcional más allá del boceto.

---

## Resumen de Preguntas Abiertas / Pendientes

1. Procesamiento de pagos en línea para el sitio web — aún requiere investigación/implementación.
2. Límite de reservación anticipada en línea para clientes (número exacto).
3. Monto del descuento por pago anticipado.
4. Monto del recargo por pago tardío.
5. Si la clase diagnóstica gratuita inicial es exclusiva de los viernes — aún pendiente con la dueña.
6. Mecanismo de control/gestión de tokens — todavía falta diseñarlo.
