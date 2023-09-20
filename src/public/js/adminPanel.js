async function guardarRoleUsuario(uid) {
  guardarRoleUsuario.disabled = true;
  const UserRole = document.getElementById("idUserRole");
  try {
    const result = await fetch(`/api/users/premium/${uid}`, {
      method: "PUT",
      body: JSON.stringify({
        role: UserRole.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 200) {
      Swal.fire({
        title: "Rol Modificado correctamente",
        icon: "success",
        text: "Atencion",
      }).then(() => {
        window.location.replace("/admin");
      });
    } else {
      const response = await result.json();
      throw new Error(response.error || "Error inesperado");
    }
  } catch (error) {
    Swal.fire({
      title: "Error modificando Rol",
      icon: "warning",
      text: "Atencion " + error.message,
    });
  } finally {
    guardarRoleUsuario.disabled = false;
  }
}

async function borrarUsuario(uid) {
  borrarUsuario.disabled = true;
  try {
    const result = await fetch(`/api/users/${uid}`, {
      method: "DELETE",
    });
    if (result.status === 200) {
      Swal.fire({
        title: "Usuario Eliminado correctamente",
        icon: "success",
        text: "Atencion",
      }).then(() => {
        window.location.replace("/admin");
      });
    } else {
      throw new Error();
    }
  } catch (error) {
    Swal.fire({
      title: "Error Eliminado Usuario",
      icon: "warning",
      text: "Atencion",
    });
  } finally {
    borrarUsuario.disabled = false;
  }
}
