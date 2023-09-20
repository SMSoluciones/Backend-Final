const socket = io();

// Add products
const addProduct = document.getElementById("addProduct");
addProduct.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = addProduct.elements.title.value;
  const description = addProduct.elements.description.value;
  const price = addProduct.elements.price.value;
  const code = addProduct.elements.code.value;
  const stock = addProduct.elements.stock.value;
  const category = addProduct.elements.category.value;

  socket.emit("newProduct", {
    title,
    description,
    price,
    code,
    stock,
    category,
  });
});

// Update products
socket.on("updateProducts", (data) => {
  const getBody = document.getElementById("productsNow");

  const productsData = data
    .map((e) => {
      return `<tr>
      <th>${e._id}</th>
      <td>${e.title}</td>
      <td>${e.description}</td>
      <td>${e.price}</td>
      <td>${e.code}</td>
      <td>${e.stock}</td>
      <td>${e.category}</td>
      <td>${e.status}</td>
      </tr>`;
    })
    .join("");
  getBody.innerHTML = productsData;
});

// Delete products
const deleteProduct = document.getElementById("deleteProduct");
deleteProduct.addEventListener("submit", (event) => {
  event.preventDefault();
  const _id = deleteProduct.elements._id.value;
  socket.emit("deleteProduct", _id);
});
