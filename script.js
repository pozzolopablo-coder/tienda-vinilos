// =====================================================
// script.js — Funcionalidades de Onda Azul Records
// =====================================================


// ---------- Elementos de la página que vamos a usar ----------
// Los buscamos una sola vez y los guardamos en variables.
const contenedorProductos = document.getElementById("contenedor-productos");
const mensajeSinResultados = document.getElementById("sin-resultados");

// Buscador y filtros
const inputBuscador = document.getElementById("buscador");
const selectIdioma = document.getElementById("filtro-idioma");
const selectDecada = document.getElementById("filtro-decada");
const inputPrecio = document.getElementById("filtro-precio");
const botonLimpiarFiltros = document.getElementById("boton-limpiar-filtros");
// querySelectorAll devuelve TODOS los botones de categoría (una lista)
const botonesCategoria = document.querySelectorAll(".categoria");

// Carrito
const seccionCarrito = document.getElementById("carrito");
const listaCarrito = document.getElementById("lista-carrito");
const mensajeCarritoVacio = document.getElementById("carrito-vacio");
const textoSubtotal = document.getElementById("subtotal");
const textoDescuento = document.getElementById("descuento");
const textoTotal = document.getElementById("total");
const contadorCarrito = document.getElementById("contador-carrito");
const botonCarrito = document.getElementById("boton-carrito");
const botonVaciar = document.getElementById("boton-vaciar");
const botonComprar = document.getElementById("boton-comprar");
const formCupon = document.getElementById("form-cupon");
const inputCupon = document.getElementById("input-cupon");
const estadoCupon = document.getElementById("estado-cupon");
const textoCupon = document.getElementById("texto-cupon");
const botonQuitarCupon = document.getElementById("boton-quitar-cupon");

// Cartelito de mensajes
const cajaMensaje = document.getElementById("mensaje");

// Botón de modo oscuro (🌙 / ☀️)
const botonModoOscuro = document.getElementById("boton-modo-oscuro");

// Nombre con el que guardamos el modo elegido en localStorage
const CLAVE_TEMA = "temaOndaAzul";

// Header (en el celular queda fijo arriba)
const header = document.querySelector(".header");

// Panel del carrito (celular y tablet) y filtros plegables (celular)
const botonCerrarCarrito = document.getElementById("boton-cerrar-carrito");
const fondoCarrito = document.getElementById("fondo-carrito");
const filtrosPlegable = document.getElementById("filtros-plegable");

// matchMedia pregunta por el tamaño de la pantalla.
// .matches es true si se cumple la condición.
const pantallaTablet = window.matchMedia("(min-width: 768px)");   // tablet o más grande
const pantallaCompu = window.matchMedia("(min-width: 1024px)");   // compu

// Favoritos: botón ❤️ del header, su contador y el título de la lista
const botonFavoritos = document.getElementById("boton-favoritos");
const contadorFavoritos = document.getElementById("contador-favoritos");
const tituloProductos = document.getElementById("titulo-productos");


// ---------- Variables de estado ----------
// Guarda la categoría elegida en el menú (al empezar: todas)
let categoriaActual = "todas";

// El carrito: un objeto por cada disco distinto, con SOLO su id y su cantidad.
// Ej: [ { id: 3, cantidad: 2 }, { id: 14, cantidad: 1 } ]
// El nombre, el precio y la imagen se buscan en "productos" por el id.
// Se guarda en localStorage, así que al empezar lo cargamos de ahí.
// CLAVE_CARRITO tiene que estar ANTES: una const no se puede usar
// antes de la línea donde se declara.
const CLAVE_CARRITO = "carritoOndaAzul";
let carrito = cargarCarrito();

// Favoritos: un array con los id de los discos favoritos. Ej: [3, 14]
// (sin cantidad: un disco es favorito o no lo es). También va en localStorage.
const CLAVE_FAVORITOS = "favoritosOndaAzul";
let favoritos = cargarFavoritos();

// true cuando se están mostrando solo los favoritos (botón ❤️ del header)
let verSoloFavoritos = false;

// El cupón de descuento de la tienda (un objeto con sus datos)
const CUPON = {
    codigo: "ONDAAZUL20",   // lo que hay que escribir
    porcentaje: 20,         // 20% de descuento
    minimoDiscos: 3         // solo vale con 3 discos o más en el carrito
};

// true si el usuario aplicó el cupón. También va en localStorage.
const CLAVE_CUPON = "cuponOndaAzul";
let cuponAplicado = cargarCupon();

// Guarda el temporizador del mensaje que se está mostrando,
// para poder cancelarlo si llega un mensaje nuevo.
let temporizadorMensaje = null;

// Igual que el de los mensajes, pero para el filtro de precio:
// espera a que el usuario termine de escribir antes de filtrar.
let temporizadorPrecio = null;


// ---------- Funciones ----------

// Recibe un número (ej: 52000) y devuelve el texto "$52.000".
// toLocaleString("es-AR") pone los puntos de los miles como en Argentina.
function formatearPrecio(numero) {
    return "$" + numero.toLocaleString("es-AR");
}

// Recibe UN producto y devuelve su tarjeta (un <article>) lista para mostrar.
function crearTarjeta(producto) {
    // 1. Creamos el elemento <article> y le ponemos la clase del CSS
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta");

    // 2. Llenamos el interior con un template string.
    //    ${...} reemplaza cada parte por el dato del producto.
    //    El corazón empieza vacío (🤍) y después actualizarCorazon() lo pone bien.
    tarjeta.innerHTML = `
        <button type="button" class="boton-favorito">🤍</button>
        <div class="tapa" style="background: ${producto.tapa}">
            <span class="tapa-titulo">${producto.nombre}</span>
            <img class="tapa-imagen" src="${producto.imagen}" alt="Tapa de ${producto.nombre}, de ${producto.artista}" loading="lazy">
        </div>
        <div class="tarjeta-info">
            <span class="etiqueta-categoria">${categorias[producto.categoria]}</span>
            <h3 class="tarjeta-nombre">${producto.nombre}</h3>
            <p class="tarjeta-artista">${producto.artista}</p>
            <p class="tarjeta-detalle">${producto.idioma} · Años ${producto.decada}</p>
            <p class="tarjeta-precio">${formatearPrecio(producto.precio)}</p>
            <button type="button" class="boton boton-agregar">Agregar al carrito</button>
        </div>
    `;

    // 3. Si la imagen no existe o no carga, el navegador dispara el evento "error".
    //    En ese caso borramos la imagen y queda a la vista el degradado de respaldo
    //    (que está de fondo en la tapa, junto con el nombre del disco).
    const imagen = tarjeta.querySelector(".tapa-imagen");
    imagen.addEventListener("error", function () {
        imagen.remove();
    });

    // 4. Al tocar "Agregar al carrito", agregamos ESTE disco
    const botonAgregar = tarjeta.querySelector(".boton-agregar");
    botonAgregar.addEventListener("click", function () {
        agregarAlCarrito(producto.id);
    });

    // 5. Corazón de favoritos: lo dibujamos lleno o vacío según corresponda,
    //    y al tocarlo, agregamos o sacamos ESTE disco de favoritos
    const botonFavorito = tarjeta.querySelector(".boton-favorito");
    actualizarCorazon(botonFavorito, producto.id);
    botonFavorito.addEventListener("click", function () {
        cambiarFavorito(producto.id, botonFavorito);
    });

    // 6. Devolvemos la tarjeta terminada
    return tarjeta;
}

// Recibe una lista de productos y dibuja una tarjeta por cada uno.
// Recibe la lista por parámetro para poder pasarle solo
// los productos que coinciden con la búsqueda y los filtros.
function mostrarProductos(lista) {
    // Borramos lo que había antes, para no repetir tarjetas
    contenedorProductos.innerHTML = "";

    // El título cambia si estamos viendo los favoritos
    tituloProductos.textContent = verSoloFavoritos ? "Tus favoritos ❤️" : "Nuestros vinilos";

    // Si la lista está vacía mostramos un mensaje
    // (hidden = true lo oculta, hidden = false lo muestra)
    mensajeSinResultados.hidden = lista.length > 0;

    // El texto depende del caso: no hay ningún favorito, o los filtros no encontraron nada
    if (verSoloFavoritos && favoritos.length === 0) {
        mensajeSinResultados.textContent = "Todavía no tenés favoritos. Tocá 🤍 en un disco para guardarlo.";
    } else {
        mensajeSinResultados.textContent = "No encontramos discos con esos filtros 😕";
    }

    // Recorremos la lista: por cada producto creamos su tarjeta
    // y la agregamos adentro del contenedor
    lista.forEach(function (producto) {
        const tarjeta = crearTarjeta(producto);
        contenedorProductos.appendChild(tarjeta);
    });
}


// Pasa un texto a minúsculas y le saca las tildes.
// Ej: "Fantasía" → "fantasia". Así la búsqueda no distingue
// mayúsculas/minúsculas ni palabras con o sin tilde.
function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")                    // separa la letra de su tilde: "í" → "i" + "´"
        .replace(/[\u0300-\u036f]/g, "");    // borra las tildes sueltas
}

// ----- Búsqueda -----
// El buscador es INDEPENDIENTE de los filtros y las categorías:
// busca siempre en los 20 discos y, para que no se vea un filtro
// marcado que no se está usando, deja los filtros como al principio.
function buscar() {
    // trim saca los espacios de los bordes
    const textoBuscado = normalizarTexto(inputBuscador.value.trim());

    // Si quedó un filtro de precio esperando, lo cancelamos
    // (si no, al dispararse borraría esta búsqueda)
    clearTimeout(temporizadorPrecio);

    // Dejamos los filtros y la categoría como al principio,
    // y salimos de la vista de favoritos (el buscador busca en TODOS)
    reiniciarFiltros();
    marcarVistaFavoritos(false);

    // El texto tiene que aparecer en el nombre del disco o en el artista.
    // Si el buscador está vacío, includes("") siempre da true y se ven todos.
    const resultado = productos.filter(function (producto) {
        return normalizarTexto(producto.nombre).includes(textoBuscado) ||
               normalizarTexto(producto.artista).includes(textoBuscado);
    });

    mostrarProductos(resultado);
}

// ----- Filtros -----
// Lee la categoría, el idioma, la década y el precio, y muestra solo
// los discos que cumplen todas esas condiciones a la vez.
// Los filtros tampoco dependen del buscador: al usarlos, se borra la búsqueda.
function aplicarFiltros() {
    // 1. Borramos lo escrito en el buscador
    inputBuscador.value = "";

    // 2. Leemos lo que eligió el usuario
    const idiomaElegido = selectIdioma.value;     // "todos", "Inglés" o "Español"
    const decadaElegida = selectDecada.value;     // "todas" o "1980", "1990", ...
    const precioMaximo = inputPrecio.value;       // texto: "" si está vacío

    // 3. Filtramos: cada disco tiene que pasar las 5 pruebas
    const resultado = productos.filter(function (producto) {
        // Favoritos: si no estamos en la vista de favoritos, pasan todos;
        // si estamos, solo pasan los que están en el array "favoritos"
        const coincideFavorito =
            !verSoloFavoritos || favoritos.includes(producto.id);

        // Categoría: "todas" deja pasar a todos
        const coincideCategoria =
            categoriaActual === "todas" || producto.categoria === categoriaActual;

        // Idioma: "todos" deja pasar a todos
        const coincideIdioma =
            idiomaElegido === "todos" || producto.idioma === idiomaElegido;

        // Década: el select da un texto ("1980") y en el producto es un número (1980).
        // Con Number() convertimos el texto en número para poder compararlos.
        const coincideDecada =
            decadaElegida === "todas" || producto.decada === Number(decadaElegida);

        // Precio: si el campo está vacío no hay límite
        const coincidePrecio =
            precioMaximo === "" || producto.precio <= Number(precioMaximo);

        // && = "y": el disco queda solo si TODAS son verdaderas
        return coincideFavorito && coincideCategoria && coincideIdioma && coincideDecada && coincidePrecio;
    });

    // 4. Mostramos solo los discos que pasaron
    mostrarProductos(resultado);
}

// Guarda la categoría del botón y lo pinta como "activo".
// (No filtra: solo cambia la variable y las clases.)
function marcarCategoria(boton) {
    // dataset.categoria lee el atributo data-categoria del botón
    categoriaActual = boton.dataset.categoria;

    // Sacamos la clase "activa" de todos los botones y se la ponemos solo a este
    botonesCategoria.forEach(function (b) {
        b.classList.remove("activa");
    });
    boton.classList.add("activa");
}

// Se ejecuta con cada tecla en el campo de precio.
// Si filtráramos en cada tecla, al escribir "55000" primero se filtraría
// "hasta $5" y no aparecería ningún disco. Por eso esperamos 0,7 segundos
// sin teclas nuevas (el mismo truco de clearTimeout que en mostrarMensaje).
function esperarPrecio() {
    clearTimeout(temporizadorPrecio);
    temporizadorPrecio = setTimeout(revisarPrecio, 700);
}

// Revisa que el precio no sea negativo y después filtra.
function revisarPrecio() {
    if (Number(inputPrecio.value) < 0) {
        inputPrecio.value = "";
        mostrarMensaje("El precio no puede ser negativo", "aviso");
    }
    aplicarFiltros();
}

// Se ejecuta al tocar un botón de categoría: lo marca y filtra.
function elegirCategoria(boton) {
    marcarCategoria(boton);
    aplicarFiltros();
}

// Deja la categoría y los filtros como al principio (no toca el buscador).
function reiniciarFiltros() {
    selectIdioma.value = "todos";
    selectDecada.value = "todas";
    inputPrecio.value = "";
    marcarCategoria(botonesCategoria[0]); // el primer botón es "Todas"
}

// Botón "Limpiar filtros": deja TODO como al principio y muestra los 20 discos.
function limpiarFiltros() {
    clearTimeout(temporizadorPrecio);   // cancelamos un filtro de precio pendiente
    inputBuscador.value = "";
    reiniciarFiltros();
    marcarVistaFavoritos(false);
    mostrarProductos(productos);
    mostrarMensaje("Filtros limpiados");
}


// ----- Mensajes al usuario -----

// Muestra un cartelito abajo de la pantalla que se va solo.
//   texto    → lo que dice el mensaje
//   tipo     → "normal" (celeste) o "aviso" (amarillo). Si no se pasa, es "normal".
//   duracion → cuántos milisegundos se ve. Si no se pasa, 2500 (2,5 segundos).
function mostrarMensaje(texto, tipo = "normal", duracion = 2500) {
    // 1. Si había un mensaje esperando para irse, cancelamos su temporizador
    //    (si no, escondería este mensaje nuevo antes de tiempo)
    clearTimeout(temporizadorMensaje);

    // 2. Ponemos el texto y el color según el tipo
    cajaMensaje.textContent = texto;
    cajaMensaje.classList.toggle("mensaje-aviso", tipo === "aviso"); // agrega la clase si es aviso, la saca si no

    // 3. Lo mostramos (el CSS hace la animación)
    cajaMensaje.classList.add("visible");

    // 4. setTimeout ejecuta la función después de "duracion" milisegundos:
    //    le saca la clase "visible" y el mensaje desaparece suave
    temporizadorMensaje = setTimeout(function () {
        cajaMensaje.classList.remove("visible");
    }, duracion);
}


// ----- Carrito -----

// Recibe un id y devuelve el disco de "productos" que tiene ese id.
// find devuelve el PRIMER elemento que cumple la condición.
function buscarProducto(id) {
    return productos.find(function (producto) {
        return producto.id === id;
    });
}

// Agrega un disco al carrito. Si ya estaba, le suma 1 a la cantidad
// (así el mismo disco nunca aparece dos veces).
function agregarAlCarrito(id) {
    const item = carrito.find(function (item) {
        return item.id === id;
    });

    const nombre = buscarProducto(id).nombre;

    if (item) {
        item.cantidad++;                          // ya estaba: sumamos 1
        mostrarMensaje(`Sumaste otro «${nombre}» (ahora tenés ${item.cantidad})`);
    } else {
        carrito.push({ id: id, cantidad: 1 });    // no estaba: lo agregamos
        mostrarMensaje(`«${nombre}» agregado al carrito ✓`);
    }

    mostrarCarrito();
}

// Suma o resta unidades de un disco. "cambio" es +1 o -1.
// La cantidad nunca baja de 1: para sacar el disco está el botón 🗑.
function cambiarCantidad(id, cambio) {
    const item = carrito.find(function (item) {
        return item.id === id;
    });

    item.cantidad += cambio;
    if (item.cantidad < 1) {
        item.cantidad = 1;
    }

    mostrarCarrito();
    mostrarMensaje(`«${buscarProducto(id).nombre}»: ahora tenés ${item.cantidad}`);
}

// Saca un disco del carrito: filter arma un carrito nuevo SIN ese id.
function eliminarDelCarrito(id) {
    carrito = carrito.filter(function (item) {
        return item.id !== id;
    });

    mostrarCarrito();
    mostrarMensaje(`«${buscarProducto(id).nombre}» se eliminó del carrito`, "aviso");
}

// Deja el carrito vacío. Vaciar es "empezar de cero": también quita el cupón.
function vaciarCarrito() {
    const teniaCupon = cuponAplicado;

    carrito = [];
    cuponAplicado = false;
    mostrarCarrito();

    if (teniaCupon) {
        mostrarMensaje("Vaciaste el carrito y se quitó el cupón", "aviso");
    } else {
        mostrarMensaje("Vaciaste el carrito", "aviso");
    }
}

// Termina la compra: agradece mostrando el total y vacía el carrito.
// El cupón se "usa" en la compra, así que también se quita.
function finalizarCompra() {
    // Calculamos el total ANTES de vaciar (después sería $0)
    const subtotal = calcularSubtotal();
    const descuento = calcularDescuento(subtotal);
    const total = subtotal - descuento;

    carrito = [];
    cuponAplicado = false;
    mostrarCarrito();

    // Si hubo descuento, lo contamos en el mensaje
    let texto = `¡Gracias por tu compra! Total: ${formatearPrecio(total)} 🎶`;
    if (descuento > 0) {
        texto = `¡Gracias por tu compra! Total: ${formatearPrecio(total)} (ahorraste ${formatearPrecio(descuento)}) 🎶`;
    }

    // 4000 ms = 4 segundos, porque es un mensaje más largo
    mostrarMensaje(texto, "normal", 4000);
}

// Suma precio × cantidad de cada disco del carrito.
function calcularSubtotal() {
    let subtotal = 0;
    carrito.forEach(function (item) {
        const producto = buscarProducto(item.id);
        subtotal += producto.precio * item.cantidad;
    });
    return subtotal;
}

// Devuelve cuánta plata se descuenta con el cupón.
// Como mostrarCarrito() la llama cada vez que algo cambia,
// el descuento se recalcula solo al agregar, sacar o cambiar cantidades.
function calcularDescuento(subtotal) {
    // Sin cupón, no hay descuento
    if (!cuponAplicado) {
        return 0;
    }

    // Con cupón pero menos de 3 discos, todavía no hay descuento
    if (contarUnidades() < CUPON.minimoDiscos) {
        return 0;
    }

    // 20% del subtotal. Math.round redondea a pesos enteros.
    return Math.round(subtotal * CUPON.porcentaje / 100);
}

// Cuenta cuántos discos hay en total (sumando las cantidades).
// Es el número del contador amarillo del header.
function contarUnidades() {
    let unidades = 0;
    carrito.forEach(function (item) {
        unidades += item.cantidad;
    });
    return unidades;
}

// Recibe un elemento del carrito ({ id, cantidad }) y devuelve su <li>.
// Funciona igual que crearTarjeta: createElement + innerHTML + eventos.
function crearItemCarrito(item) {
    const producto = buscarProducto(item.id);

    const li = document.createElement("li");
    li.classList.add("item-carrito");

    // disabled desactiva el botón "−" cuando la cantidad es 1
    li.innerHTML = `
        <div class="item-tapa" style="background: ${producto.tapa}">
            <img src="${producto.imagen}" alt="">
        </div>
        <div class="item-info">
            <p class="item-nombre">${producto.nombre}</p>
            <p class="item-artista">${producto.artista} · ${formatearPrecio(producto.precio)} c/u</p>
        </div>
        <button type="button" class="boton-eliminar" aria-label="Eliminar ${producto.nombre} del carrito">🗑</button>
        <div class="item-cantidad">
            <button type="button" class="boton-cantidad boton-restar" aria-label="Restar uno" ${item.cantidad === 1 ? "disabled" : ""}>−</button>
            <span>${item.cantidad}</span>
            <button type="button" class="boton-cantidad boton-sumar" aria-label="Sumar uno">+</button>
        </div>
        <p class="item-subtotal">${formatearPrecio(producto.precio * item.cantidad)}</p>
    `;

    // Si la imagen no carga, la borramos y queda el degradado (igual que en la tarjeta)
    const imagen = li.querySelector("img");
    imagen.addEventListener("error", function () {
        imagen.remove();
    });

    // Botones de este disco
    li.querySelector(".boton-restar").addEventListener("click", function () {
        cambiarCantidad(item.id, -1);
    });
    li.querySelector(".boton-sumar").addEventListener("click", function () {
        cambiarCantidad(item.id, +1);
    });
    li.querySelector(".boton-eliminar").addEventListener("click", function () {
        eliminarDelCarrito(item.id);
    });

    return li;
}

// Dibuja el carrito completo: la lista, los totales y el contador.
// TODAS las funciones que cambian el carrito terminan llamando a esta.
function mostrarCarrito() {
    // 1. Lista de discos (borramos y volvemos a dibujar, como en mostrarProductos)
    listaCarrito.innerHTML = "";
    carrito.forEach(function (item) {
        listaCarrito.appendChild(crearItemCarrito(item));
    });

    // 2. Mensaje "El carrito está vacío": se ve solo si no hay nada
    const estaVacio = carrito.length === 0;
    mensajeCarritoVacio.hidden = !estaVacio;

    // 3. Subtotal, descuento y total
    const subtotal = calcularSubtotal();
    const descuento = calcularDescuento(subtotal);
    const total = subtotal - descuento;

    textoSubtotal.textContent = formatearPrecio(subtotal);
    // Solo ponemos el "-" adelante si de verdad hay descuento (si no, "-$0" queda raro)
    textoDescuento.textContent = descuento > 0 ? "-" + formatearPrecio(descuento) : formatearPrecio(0);
    textoTotal.textContent = formatearPrecio(total);

    // 4. Contador amarillo del header
    contadorCarrito.textContent = contarUnidades();

    // 5. Con el carrito vacío no se puede vaciar ni comprar
    botonVaciar.disabled = estaVacio;
    botonComprar.disabled = estaVacio;

    // 6. Línea de estado del cupón (aplicado / cuántos discos faltan)
    mostrarEstadoCupon();

    // 7. Guardamos el carrito y el cupón. Como TODAS las acciones del carrito
    //    terminan acá, se guarda solo cada vez que cambia algo.
    guardarCarrito();
    guardarCupon();
}


// ----- Cupón de descuento -----

// Se ejecuta al tocar "Aplicar" (o apretar Enter en el campo).
// Valida lo que escribió el usuario y, si está bien, aplica el cupón.
function aplicarCupon() {
    // 1. Limpiamos lo escrito: todo en mayúsculas y SIN espacios.
    //    Así "ondaazul20", " OndaAzul20 " y "onda azul 20" valen igual.
    const codigo = inputCupon.value.toUpperCase().replaceAll(" ", "");

    // 2. Campo vacío
    if (codigo === "") {
        mostrarMensaje("Escribí un código de cupón", "aviso");
        return;   // return corta la función acá
    }

    // 3. Código incorrecto
    if (codigo !== CUPON.codigo) {
        mostrarMensaje(`El cupón «${codigo}» no es válido`, "aviso");
        return;
    }

    // 4. Ya estaba aplicado
    if (cuponAplicado) {
        mostrarMensaje(`El cupón ${CUPON.codigo} ya está aplicado`);
        inputCupon.value = "";
        return;
    }

    // 5. Código correcto: lo aplicamos y redibujamos el carrito
    //    (mostrarCarrito recalcula el descuento y lo guarda)
    cuponAplicado = true;
    inputCupon.value = "";
    mostrarCarrito();

    // El mensaje depende de si ya hay 3 discos o todavía no
    const faltan = CUPON.minimoDiscos - contarUnidades();
    if (faltan > 0) {
        mostrarMensaje(`Cupón guardado. Sumá ${textoDiscos(faltan)} más para el ${CUPON.porcentaje}%`);
    } else {
        mostrarMensaje(`¡Cupón ${CUPON.codigo} aplicado! ${CUPON.porcentaje}% de descuento 🎉`);
    }
}

// Botón "Quitar": saca el cupón.
function quitarCupon() {
    cuponAplicado = false;
    mostrarCarrito();
    mostrarMensaje("Quitaste el cupón", "aviso");
}

// Devuelve "1 disco" o "2 discos" (singular o plural según el número).
function textoDiscos(cantidad) {
    return cantidad === 1 ? "1 disco" : `${cantidad} discos`;
}

// Muestra u oculta la línea de estado debajo del campo del cupón.
function mostrarEstadoCupon() {
    // Sin cupón: la línea no se ve
    estadoCupon.hidden = !cuponAplicado;
    if (!cuponAplicado) {
        return;
    }

    const faltan = CUPON.minimoDiscos - contarUnidades();
    if (faltan > 0) {
        textoCupon.textContent = `${CUPON.codigo} guardado: sumá ${textoDiscos(faltan)} más para el ${CUPON.porcentaje}%`;
    } else {
        textoCupon.textContent = `✓ ${CUPON.codigo} aplicado: −${CUPON.porcentaje}%`;
    }
}

// Guarda el cupón en localStorage: el código si está aplicado,
// o lo borra (removeItem) si no hay cupón.
function guardarCupon() {
    if (cuponAplicado) {
        localStorage.setItem(CLAVE_CUPON, CUPON.codigo);
    } else {
        localStorage.removeItem(CLAVE_CUPON);
    }
}

// Al entrar: devuelve true si había un cupón válido guardado.
// La primera vez getItem da null, que no es igual al código → false.
function cargarCupon() {
    return localStorage.getItem(CLAVE_CUPON) === CUPON.codigo;
}


// ----- Modo oscuro -----

// Pone o saca el modo oscuro. "oscuro" es true (oscuro) o false (claro).
// Solo cambia lo que se ve: la clase del body y el botón.
function aplicarModo(oscuro) {
    // toggle con true agrega la clase, con false la saca
    document.body.classList.toggle("modo-oscuro", oscuro);

    // El botón muestra a qué modo VAS a pasar si lo tocás
    if (oscuro) {
        botonModoOscuro.textContent = "☀️";
        botonModoOscuro.setAttribute("aria-label", "Activar modo claro");
    } else {
        botonModoOscuro.textContent = "🌙";
        botonModoOscuro.setAttribute("aria-label", "Activar modo oscuro");
    }
}

// Se ejecuta al tocar el botón: pasa al modo contrario, lo guarda y avisa.
function cambiarModo() {
    // contains devuelve true si el body YA tiene la clase (está en oscuro)
    const estabaOscuro = document.body.classList.contains("modo-oscuro");
    const ahoraOscuro = !estabaOscuro;   // ! da vuelta: true → false, false → true

    aplicarModo(ahoraOscuro);

    // Guardamos la elección como texto (no hace falta JSON)
    localStorage.setItem(CLAVE_TEMA, ahoraOscuro ? "oscuro" : "claro");

    mostrarMensaje(ahoraOscuro ? "Modo oscuro activado 🌙" : "Modo claro activado ☀️");
}

// Al entrar: devuelve true si hay que arrancar en modo oscuro.
function cargarModo() {
    const modoGuardado = localStorage.getItem(CLAVE_TEMA);

    // Si el usuario ya eligió, respetamos su elección
    if (modoGuardado === "oscuro") {
        return true;
    }
    if (modoGuardado === "claro") {
        return false;
    }

    // Primera visita (null): usamos la preferencia del dispositivo.
    // matches es true si el celular o la compu están en modo oscuro.
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
}


// ----- Favoritos -----

// Devuelve true si el disco está en favoritos.
function esFavorito(id) {
    return favoritos.includes(id);
}

// Dibuja el corazón de una tarjeta: lleno (❤️) si es favorito, vacío (🤍) si no.
// aria-pressed le dice a los lectores de pantalla si el botón está "apretado".
function actualizarCorazon(boton, id) {
    if (esFavorito(id)) {
        boton.textContent = "❤️";
        boton.setAttribute("aria-label", "Quitar de favoritos");
        boton.setAttribute("aria-pressed", "true");
    } else {
        boton.textContent = "🤍";
        boton.setAttribute("aria-label", "Agregar a favoritos");
        boton.setAttribute("aria-pressed", "false");
    }
}

// Se ejecuta al tocar el corazón de una tarjeta.
// Si el disco no era favorito lo agrega; si ya era, lo saca.
function cambiarFavorito(id, boton) {
    const nombre = buscarProducto(id).nombre;

    if (esFavorito(id)) {
        // Ya era favorito: filter arma un array nuevo SIN ese id
        favoritos = favoritos.filter(function (idFavorito) {
            return idFavorito !== id;
        });
        mostrarMensaje(`«${nombre}» se quitó de favoritos`, "aviso");
    } else {
        // No era favorito: lo agregamos
        favoritos.push(id);
        mostrarMensaje(`«${nombre}» agregado a favoritos ❤️`);
    }

    guardarFavoritos();
    mostrarContadorFavoritos();

    if (verSoloFavoritos) {
        // Si estamos viendo los favoritos, volvemos a filtrar:
        // así el disco que se quitó desaparece de la lista
        aplicarFiltros();
    } else {
        // Si no, solo cambiamos el corazón de esta tarjeta
        // (sin volver a dibujar todo, así no se pierde la búsqueda)
        actualizarCorazon(boton, id);
    }
}

// Pone en el contador del botón ❤️ cuántos favoritos hay.
function mostrarContadorFavoritos() {
    contadorFavoritos.textContent = favoritos.length;
}

// Activa o desactiva la vista de favoritos ("activa" es true o false).
// Solo cambia la variable y cómo se ve el botón ❤️ (no filtra).
function marcarVistaFavoritos(activa) {
    verSoloFavoritos = activa;
    botonFavoritos.classList.toggle("activo", activa);
    botonFavoritos.setAttribute("aria-pressed", activa ? "true" : "false");
}

// Se ejecuta al tocar ❤️ en el header: entra o sale de la vista de favoritos.
// Reutiliza aplicarFiltros() → que a su vez usa mostrarProductos().
function verFavoritos() {
    const entrando = !verSoloFavoritos;   // si no estaba viendo favoritos, ahora entra

    if (entrando) {
        // Al entrar, los filtros vuelven a "Todos" para ver TODOS los favoritos
        reiniciarFiltros();
    }

    marcarVistaFavoritos(entrando);
    aplicarFiltros();

    // Bajamos hasta la lista de discos
    if (pantallaTablet.matches) {
        // Tablet y compu: como siempre, el título queda arriba de todo
        tituloProductos.scrollIntoView({ behavior: "smooth" });
    } else {
        // Celular: el header fijo taparía el título, así que frenamos
        // un poco antes: posición del título - alto del header - 12px de aire
        const destino = tituloProductos.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 12;
        window.scrollTo({ top: destino, behavior: "smooth" });
    }
}

// Guarda los favoritos en localStorage (como texto, con JSON.stringify).
function guardarFavoritos() {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
}

// Lee los favoritos guardados. Funciona igual que cargarCarrito():
// si no hay nada guardado o está roto, devuelve [] (sin favoritos).
function cargarFavoritos() {
    const textoGuardado = localStorage.getItem(CLAVE_FAVORITOS);

    // Primera visita: no hay nada guardado
    if (textoGuardado === null) {
        return [];
    }

    try {
        const favoritosGuardados = JSON.parse(textoGuardado);

        // Dejamos solo los id de discos que siguen existiendo en productos.js
        return favoritosGuardados.filter(function (id) {
            return buscarProducto(id) !== undefined;
        });
    } catch (error) {
        return [];
    }
}


// ----- Panel del carrito y filtros plegables (celular y tablet) -----

// Abre el carrito como panel deslizable. Todo lo visual lo hace el CSS
// cuando el body tiene la clase "carrito-abierto".
function abrirCarrito() {
    document.body.classList.add("carrito-abierto");
    botonCarrito.setAttribute("aria-expanded", "true");
    // Llevamos el foco al ✕ (así con el teclado se puede cerrar enseguida).
    // preventScroll: true = poner el foco SIN mover la página
    botonCerrarCarrito.focus({ preventScroll: true });
}

// Cierra el panel del carrito (si estaba abierto).
function cerrarCarrito() {
    if (!document.body.classList.contains("carrito-abierto")) {
        return;   // ya estaba cerrado: no hacemos nada
    }
    document.body.classList.remove("carrito-abierto");
    botonCarrito.setAttribute("aria-expanded", "false");
    // Devolvemos el foco al botón 🛒, de donde vino el usuario.
    // Sin preventScroll, la página saltaba hasta arriba (donde está el 🛒)
    // y el usuario perdía el lugar donde estaba mirando los discos.
    botonCarrito.focus({ preventScroll: true });
}

// Botón 🛒 del header: en la compu baja hasta el carrito (como siempre);
// en celular y tablet abre el panel.
function irAlCarrito() {
    if (pantallaCompu.matches) {
        seccionCarrito.scrollIntoView({ behavior: "smooth" });
    } else {
        abrirCarrito();
    }
}

// Filtros: en el celular arrancan cerrados; en tablet y compu, siempre abiertos.
// open es el atributo de <details>: true = abierto, false = cerrado.
function acomodarFiltros() {
    filtrosPlegable.open = pantallaTablet.matches;
}

// Se ejecuta al tocar el título "Filtros" (el <summary>).
// En tablet y compu los filtros no se pueden cerrar: preventDefault cancela
// lo que el navegador haría solo (abrir/cerrar), como en el formulario del cupón.
function evitarCerrarFiltros(evento) {
    if (pantallaTablet.matches) {
        evento.preventDefault();
    }
}


// ----- Guardado del carrito (localStorage) -----

// Guarda el carrito en localStorage.
// localStorage solo guarda TEXTO: JSON.stringify convierte el array en texto.
// Ej: [{ id: 3, cantidad: 2 }] → '[{"id":3,"cantidad":2}]'
function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

// Lee el carrito guardado y lo devuelve como array.
// Si no hay nada guardado (primera visita) o está roto, devuelve [] (vacío).
function cargarCarrito() {
    // getItem devuelve el texto guardado, o null si no hay nada
    const textoGuardado = localStorage.getItem(CLAVE_CARRITO);

    // Primera visita: no hay nada guardado → carrito vacío
    if (textoGuardado === null) {
        return [];
    }

    // try/catch: "intentá esto, y si da error, hacé lo del catch".
    // Si el texto está roto, JSON.parse da error y sin el catch
    // se frenaría todo el JavaScript de la página.
    try {
        // JSON.parse convierte el texto de vuelta en un array
        const carritoGuardado = JSON.parse(textoGuardado);

        // Dejamos solo los discos que siguen existiendo en productos.js
        // (si sacamos un disco de la lista, buscarProducto daría undefined)
        return carritoGuardado.filter(function (item) {
            return buscarProducto(item.id) !== undefined;
        });
    } catch (error) {
        return [];
    }
}


// ---------- Eventos ----------
// "input" se dispara con cada letra que se escribe o borra
inputBuscador.addEventListener("input", buscar);
inputPrecio.addEventListener("input", esperarPrecio);

// "change" se dispara cuando se elige otra opción en un select
selectIdioma.addEventListener("change", aplicarFiltros);
selectDecada.addEventListener("change", aplicarFiltros);

// A cada botón de categoría le decimos qué hacer cuando lo tocan
botonesCategoria.forEach(function (boton) {
    boton.addEventListener("click", function () {
        elegirCategoria(boton);
    });
});

botonLimpiarFiltros.addEventListener("click", limpiarFiltros);

// Carrito
botonVaciar.addEventListener("click", vaciarCarrito);
botonComprar.addEventListener("click", finalizarCompra);

// Botón 🛒 del header: abre el panel (celular y tablet) o baja al carrito (compu)
botonCarrito.addEventListener("click", irAlCarrito);

// Formas de cerrar el panel: el ✕, tocar el fondo oscuro o la tecla Escape
botonCerrarCarrito.addEventListener("click", cerrarCarrito);
fondoCarrito.addEventListener("click", cerrarCarrito);
document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        cerrarCarrito();
    }
});

// Si la ventana cambia de tamaño y cruza un límite (ej: girar la tablet),
// acomodamos los filtros y cerramos el panel del carrito.
pantallaTablet.addEventListener("change", acomodarFiltros);
pantallaCompu.addEventListener("change", cerrarCarrito);

// Filtros plegables: en tablet y compu no se pueden cerrar
document.querySelector(".filtros-titulo").addEventListener("click", evitarCerrarFiltros);

// Cupón: "submit" se dispara al tocar "Aplicar" o al apretar Enter en el campo.
// Un formulario, al enviarse, RECARGA la página (y se perdería todo):
// preventDefault evita eso, y en su lugar aplicamos el cupón.
formCupon.addEventListener("submit", function (evento) {
    evento.preventDefault();
    aplicarCupon();
});

botonQuitarCupon.addEventListener("click", quitarCupon);

// Modo oscuro
botonModoOscuro.addEventListener("click", cambiarModo);

// Favoritos: el botón ❤️ del header muestra u oculta la vista de favoritos
botonFavoritos.addEventListener("click", verFavoritos);


// ---------- Inicio ----------
// Cuando se carga la página: ponemos el modo guardado (claro u oscuro),
// y mostramos todos los discos y el carrito guardado.
aplicarModo(cargarModo());
acomodarFiltros();
mostrarContadorFavoritos();
mostrarProductos(productos);
mostrarCarrito();
