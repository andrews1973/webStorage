const formulario = document.querySelector("#formulario1");
const mensajes = document.querySelector("#mensajes");
const cuerpoTabla = document.querySelector("#cuerpoTabla");

// Lista de productos
let productos = [];

function mensaje(texto) {
    mensajes.innerHTML += texto + "<br>";
}

const buscarProducto = (nombreProducto) => {
    return productos.find((elemento) => elemento.id === nombreProducto);
};

const guardarProductosLocal = (productos) => {
    // guardar en el local el array de procdutos y mostrarlo
    localStorage.setItem("productos", JSON.stringify(productos));
};

const obtenerProductosLocal = () => {
    // pide los productos al local
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
    return productosGuardados;
};

const pintarProductos = (productos) => {
    cuerpoTabla.innerHTML = "";

    const fragmento = document.createDocumentFragment(); // mejor dentro de la funcion pintar

    if (productos.length === 0) { // si no hay productos

        mensaje(`<strong>No existen productos que mostrar,</strong> agrega alguno`);
    
    } else { // si en el array de productos hay productos los recorremos y pintamos

        productos.forEach(({ id, nombre, cantidad }) => {
            // Crear una fila (tr)
            const fila = document.createElement("tr");

            // Crear una celda para el id
            const celdaId = document.createElement("td");

            // Introducir el id en la celda
            celdaId.textContent = id;

            // Crear una celda para el nombre
            const celdaNombre = document.createElement("td");

            // Introducir el nombre en la celda
            celdaNombre.textContent = nombre;

            // Crear una celda para la cantidad
            const celdaCantidad = document.createElement("td");

            // Introducir la cantidad en la celda
            celdaCantidad.textContent = cantidad;

            // Crear una celda y dentro el boton eliminar
            const celdaEliminar = document.createElement("td");
            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.dataset.id = id;
            botonEliminar.textContent = "Eliminar";

            //introducir el boton en la celda
            celdaEliminar.append(botonEliminar);

            // Añadir las tres celdas a la fila
            fila.append(celdaId, celdaNombre, celdaCantidad, celdaEliminar);

            // Añadir la fila al fragment
            fragmento.append(fila);
        });
        // Añadir todas las filas al tbody, el fragmento al tbody
        cuerpoTabla.append(fragmento);
    }
};

const agregarProducto = (nombreProducto) => {
    // buscamos si el producto existe llamando a la funcion y pasandole el nombre o el id
    const productoEncontrado = buscarProducto(nombreProducto); 
    //Si find lo encuentra nos devuelve el producto, le sumamos 1 a la cantido y si no lo creamos
    if (productoEncontrado) {
        productoEncontrado.cantidad++; // =+1
        mensaje(`Has añadido una unidad más del producto: <strong>${productoEncontrado.nombre}</strong> ahora dispones de <strong>${productoEncontrado.cantidad}</strong> unidades`);
    } else {
        // creamos un nuevo objeto producto con id, nombre y cantidad = 1
        const nuevoProducto = {
            id: nombreProducto,
            nombre: nombreProducto,
            cantidad: 1,
        };
        //productos.push(nuevoProducto) // con push añadiriamos el objeto al array.
        productos = [...productos, nuevoProducto]; // Utilizando spread (...) tambien
        mensaje(`Has añadido el producto: <strong>${nombreProducto}</strong>`);
    }
    // una vez agregado el producto a nuestro array...
    guardarProductosLocal(productos); // guardamos todos los productos en el local pasandole productos a la funcion
    pintarProductos(productos); // pintamos en la tabla de todos los productos del array productos
};

const eliminarProducto = (productoId) => {
    // en este momento el array productos al menos habra un producto. Si no no saldria el boton eliminar
    // busco el producto con ese productoId,  para comprobar su cantidad
    const productoEncontrado = buscarProducto(productoId); 

     if (!productoEncontrado) {
        return;
    }
    if (productoEncontrado.cantidad > 1) {
        //Si la cantidad del producto buscado con find() > 1, modificamos su propiedad cantidad restandole 1
        productoEncontrado.cantidad--; // =-1
        mensaje(`Has eliminado una unidad de: <strong>${productoEncontrado.nombre}</strong> te quedan <strong>${productoEncontrado.cantidad}</strong>`);
    } else {
        // eliminamos del array de productos el producto encontrado si la cantidad es 1
        mensaje(`No hay mas unidades del producto <strong>${productoEncontrado.nombre}</strong> lo has eliminado `);
        // filter nos devolvera en este caso el array de productos sin el producto eliminado
        productos = productos.filter((producto) => producto.id !== productoId);
    }
    guardarProductosLocal(productos); // guardamos en el local los productos actuales
    pintarProductos(productos); // pintamos en la tabla los productos actuales del array productos
};

// eventos

// clic en eliminar
document.addEventListener("click", (ev) => {
    if (ev.target.matches("#tabla button")) {
        eliminarProducto(ev.target.dataset.id);
    }
});

// mandar formulario (contiene boton agregar producto)
formulario.addEventListener("submit", (ev) => {
    ev.preventDefault();

    mensajes.innerHTML = "";
    mensajes.classList.remove("rojo", "verde");

    const nombreProducto = formulario.nombre.value.trim();

    let validado = true;

    // lo primero Validaciones
    if (nombreProducto.length < 3) {
        mensaje("El campo <strong>producto</strong> debe contener al menos <strong>3</strong> caracteres");
        validado = false;
    }

    // si no valida mostramos menajes y si valida agregamos el producto a nuestro array productos
    if (!validado) {
        mensaje("Por favor, <strong>corrige todos los errores del formulario</strong>");
        mensajes.classList.add("rojo");
    } else {

        mensajes.classList.add("verde");

        agregarProducto(nombreProducto);  
    }
});

// inicializamos Recuperar del local y pintar productos
productos = obtenerProductosLocal();
pintarProductos(productos);
