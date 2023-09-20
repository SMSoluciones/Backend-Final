const form = document.getElementById("resetForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  const errMessage = document.getElementById("errorMessage");
  fetch("/api/users/reset-user", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      Toastify({
        text: "Contraseña actualizada",
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
