let cant = 0;

function sumar(stock) {
  if (cant < stock) cant++;
  contadorItem.innerHTML = cant;
}

function restar() {
  if (cant > 0) cant--;
  contadorItem.innerHTML = cant;
}

function getUserUltimoCarrito() {
  let cart = localStorage.getItem("cart");
  const email = localStorage.getItem("email");
  const user = JSON.parse(localStorage.getItem("user"));

  if (cart && email === user.email) {
    return cart;
  }
  if (user.carts.length === 0) {
    return undefined;
  } else {
    cart = user.carts[user.carts.length - 1].cart._id;
    localStorage.setItem("cart", cart);
    localStorage.setItem("email", user.email);

    return cart;
  }
}

async function getCarrito() {
  let cart = getUserUltimoCarrito();

  if (!cart) {
    try {
      const result = await fetch("/api/carts", {
        method: "POST",
      });

      if (result.status === 200) {
        cart = (await result.json()).payload._id;
        const user = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("cart", cart);
        localStorage.setItem("email", user.email);
      } else {
        const response = await result.json();
        throw new Error(response.error || "Error creating cart");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }
  return cart;
}

async function agregarProducto(pid) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user.role === "ADMIN") {
    Swal.fire({
      title: "Usuario no habilitado",
      icon: "warning",
      text: "Atencion",
    });
    return;
  }
  if (cant < 1) {
    Swal.fire({
      title: "La cantidad no puede ser menor que 1",
      icon: "warning",
      text: "Atencion",
    });
    return;
  }
  const cart = await getCarrito();
  try {
    const result = await fetch(`/api/carts/${cart}/products/${pid}`, {
      method: "PUT",
      body: JSON.stringify({
        quantity: cant,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      Swal.fire({
        title: "Producto agregado correctamente",
        icon: "success",
        text: "Atencion",
      });
    } else {
      const response = await result.json();
      throw new Error(response.error || "Error inesperado");
    }
  } catch (error) {
    Swal.fire({
      title: "Error agregando el producto al carrito",
      icon: "warning",
      text: "Atencion, " + error.message,
    });
  }
}

const contadorItem = document.getElementById("idContadorProducto");
contadorItem.innerHTML = cant;
