function calculaCarrito(carrito) {
  let total = 0;
  let cant = 0;

  if (carrito && carrito.products) {
    for (const item of carrito.products) {
      total += item.product.price * item.quantity;
      cant += item.quantity;
    }
  }
}

async function displayCarrito() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user.role === "ADMIN") {
    return;
  }
  let cart = localStorage.getItem("cart");
  try {
    if (!cart) {
      return;
    }

    let carrito = JSON.parse(localStorage.getItem("carrito"));
    if (carrito) calculaCarrito(carrito);

    const result = await fetch(`/api/carts/${cart}`, {
      method: "GET",
    });
    if (result.status !== 200) {
      throw new Error("Error reading cart");
    }

    carrito = await result.json();
    localStorage.setItem("carrito", JSON.stringify(carrito));
    calculaCarrito(carrito);

    return result;
  } catch (error) {
    console.log(error.message);
  }
}

const botonVaciarCarrito = document.getElementById("btnVaciarCarrito");
botonVaciarCarrito.onclick = async () => {
  const cart = localStorage.getItem("cart");

  if (!cart) {
    Swal.fire({
      title: "Todavia No hay Productos en el Carrito",
      icon: "error",
      text: "Atencion",
    });
    return;
  }

  let carrito = JSON.parse(localStorage.getItem("carrito"));
  if (!carrito) {
    const result = await fetch(`/api/carts/${cart}`, {
      method: "GET",
    });
    if (result.status !== 200) {
      throw new Error("Error reading cart");
    }
    carrito = await result.json();
  }

  try {
    for (const item of carrito.products) {
      const result = await fetch(
        `/api/carts/${cart}/product/${item.product._id}`,
        {
          method: "DELETE",
        }
      );
      if (result.status != 200) {
        const response = await result.json();
        throw new Error(response.error || "Error fetching");
      }
    }
  } catch (error) {
    Swal.fire({
      title: "Error vaciando el carrito",
      icon: "warning",
      text: "Atencion, " + error.message,
    });
  }
  Swal.fire({
    title: "Carrito vaciado correctamente",
    icon: "success",
    text: "Atencion",
  }).then(() => {
    window.location.replace("/home");
  });
};

const botonFinCompra = document.getElementById("btnCarrito");
botonFinCompra.onclick = () => {
  const cart = localStorage.getItem("cart");
  if (!cart) {
    Swal.fire({
      title: "Todavia No hay Productos en el Carrito",
      icon: "error",
      text: "Atencion",
    });
    return;
  }
  window.location.replace(`/carts/${cart}`);
};

displayCarrito();
