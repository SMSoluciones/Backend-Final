const cartPurchase = document.getElementById("finCompra");

const deleteCartProduct = async (pid, cart) => {
  try {
    const result = await fetch(`/api/carts/${cart}/products/${pid}`, {
      method: "DELETE",
    });
    if (result.status === 200) {
      Swal.fire({
        title: "Producto borrado del carro",
        icon: "success",
      }).then(() => {
        window.location.replace(`/carts/${cart}`);
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    Swal.fire({
      title: "Error al borrar el producto",
      icon: "warning",
    });
  }
};

const purchaseCart = async (cid) => {
  try {
    const result = await fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
    });
    const response = await result.json();
    if (result.status === 200) {
      if (response.payload.error) {
        iconsSwal = "warning";
        titleSwal = response.payload.error;
      }
      Swal.fire({
        title: "Compra Finalizada",
        icon: "success",
        text: "Su codigo de compra es: " + response.payload.payload.code,
      }).then(() => {
        window.location.replace("/home");
      });
    } else {
      throw new Error(response.error);
    }
  } catch (error) {
    Swal.fire({
      title: error.message,
      icon: "error",
    });
  }
};
