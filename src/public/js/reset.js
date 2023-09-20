const form = document.getElementById("resetForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/users/reset", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      Toastify({
        text: "Se ha enviado un mail a su correo",
        duration: 3000,
        gravity: "top",
        position: "center",
        backgroundColor: "#4caf50",
      }).showToast();

      setTimeout(function () {
        window.location.replace("/");
      }, 3000);
    }
  });
});
