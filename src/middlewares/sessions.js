export const publicAccess = (req, res, next) => {
  if (req.session?.user) {
    return res.redirect("/products"); // Redirige a la vista de productos si el usuario ha iniciado sesión
  } else {
    next();
  }
};

export const privateAccess = (req, res, next) => {
  if (!req.session?.user) {
    return res.redirect("/login"); // Redirige a la vista de login si el usuario no ha iniciado sesión
  } else {
    next();
  }
};
