const formulario = document.querySelector("#formulario1");
const mensajes = document.querySelector("#mensajes");
const cuerpoTabla = document.querySelector("#cuerpoTabla");

// Lista de productos
let productos = [];

function mensaje(texto) {
    mensajes.innerHTML += texto + "<br>";
}

const agregarProducto = (nombreProducto) => {
    // hemos recogido y recibido el nombre del producto del formulario con esta dato hay que crear un objeto producto con id nombre y cantidad
    // primero pedir los productos que ya hay en el local y guardarlos el el array productos
    // productos = pedirProductos(); // pero no hace falta, ya recupero los productos al iniciar la aplicación, lineas finales del todo
    // comprobar si ya existe con find(), o includes... aumento cantidad en 1 y si no lo añado al array
    const productoEncontrado = buscarProducto(nombreProducto); // no es necesario pasarle productos el array donde ha de buscar el producto.

    if (productoEncontrado) {
        //Si find lo encuentra nos devuelve el producto, pues modificamos su propiedad cantidad sumandole uno
        productoEncontrado.cantidad++; // =+1
        mensaje(`Has añadido una unidad más del producto: <strong>${productoEncontrado.nombre}</strong> ahora dispones de <strong>${productoEncontrado.cantidad}</strong> unidades`);
    } else {
        // creamos un nuevo objeto producto a partir de su nombre con id igual al nombre y cantidad 1
        const nuevoProducto = {
            id: nombreProducto,
            nombre: nombreProducto,
            cantidad: 1,
        };
        //productos.push(nuevoProducto) // es un array añadiriamos el objeto
        productos = [...productos, nuevoProducto]; // Utilizando spread (...)
        mensaje(`Has añadido el producto: <strong>${nombreProducto}</strong>`);
    }

    guardarProductosLocal(productos); // guardamos todos los productos en el local
    pintarProductos(productos); // pintamos en la tabla
};

const buscarProducto = (nombreProducto) => {
    return productos.find((elemento) => elemento.id === nombreProducto);
};

const guardarProductosLocal = (productos) => {
    // guardar en el local el array de procdutos y mostrarlo
    localStorage.setItem("productos", JSON.stringify(productos));
};

const pedirProductos = () => {
    // pide los productos al local
    const productosGuardados =
        JSON.parse(localStorage.getItem("productos")) || [];
    return productosGuardados;
};

const pintarProductos = (productos) => {
    cuerpoTabla.innerHTML = "";

    const fragmento = document.createDocumentFragment(); // mejor dentro de la funcion pintar

    if (productos.length === 0) {
        mensaje(`<strong>No existen productos que mostrar,</strong> agrega alguno`);
    } else {
        /*
Ojo al desestructurar objetos... Extraemos sus propiedades en variables locales, pero no creamos una copia del objeto. Si cantidad es un número como en los contadores, modificar la variable no modifica la propiedad original del objeto. Si necesitaramos modificar los valores originales al pintar o en otras funciones si necesitaramos modificar una propiedad del objeto original, la desestructuración puede que no sea la opción más adecuada.
*/
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

const eliminarProducto = (productoId) => {
    // no puedo eliminar sin antes haber agregado un producto, por tanto en array productos debe haber al menos un producto o no me sale el boton eliminar
    // si la cantidad mayor que 1 reduzco la cantidad y si es 1 elimino el producto del array
    const productoEncontrado = buscarProducto(productoId); // devuelve el objeto y compruebo existe

     if (!productoEncontrado) {
        return;
    }
    if (productoEncontrado.cantidad > 1) {
        //Si find lo encuentra nos devuelve el producto, pues modificamos su propiedad cantidad restandole 1
        productoEncontrado.cantidad--; // =-1
        mensaje(`Has eliminado una unidad de: <strong>${productoEncontrado.nombre}</strong> te quedan <strong>${productoEncontrado.cantidad}</strong>`);
    } else {
        // eliminamos del array el objeto producto, modificar el array y volver a guardar el array actualizado
        mensaje(`No hay mas unidades del producto <strong>${productoEncontrado.nombre}</strong> lo has eliminado `);
        productos = productos.filter((producto) => producto.id !== productoId);
    }
    guardarProductosLocal(productos);
    pintarProductos(productos);
};

document.addEventListener("click", (ev) => {
    if (ev.target.matches("#tabla button")) {
        eliminarProducto(ev.target.dataset.id);
    }
});

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

    // Mostramos el resultado
    if (!validado) {
        mensaje("Por favor, <strong>corrige todos los errores del formulario</strong>");
        mensajes.classList.add("rojo");
    } else {
        // si valida... mandamos el nombre del producto a la funcion agregrar

        mensajes.classList.add("verde");

        agregarProducto(nombreProducto);
    }
});

productos = pedirProductos();
pintarProductos(productos);
