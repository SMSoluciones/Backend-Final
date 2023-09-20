const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (result) => {
      const response = await result.json();

      if (result.status === 200) {
        const user = response.payload;
        localStorage.setItem("user", JSON.stringify(user));

        const currentEmail = localStorage.getItem("email");
        if (currentEmail !== user.email) {
          localStorage.setItem("email", user.email);
          localStorage.removeItem("cart");
          localStorage.removeItem("carrito");
        }

        window.location.replace("/home");
      } else {
        Swal.fire({
          title: response.error || "Error iniciando sesión",
          icon: "warning",
          text: "Atencion",
        });
      }
    })
    .catch((err) => {
      Swal.fire({
        title: "Error iniciando sesión",
        icon: "warning",
        text: "Atencion, " + err.message,
      });
    });
});
