import {
  getUsers as getUserService,
  createUser as createUserService,
  getByEmail as getByEmailService,
  updateUser as updateUserService,
  resetEmailUser as resetEmailUserService,
  updateUserDocument as updateUserDocumentService,
  updateUserRole as updateUserRoleService,
  deleteUsers as deleteUsersService,
  deleteUser as deleteUserService,
} from "../services/users.service.js";

import {
  createHash,
  generateToken,
  isValidPassword,
  verifyToken,
} from "../utils.js";

import { ROLE_PERMISSIONS } from "../config/access.js";

import { getLogger } from "../utils/logger.js";

const getUsers = async (req, res) => {
  const users = await getUserService();

  const userIteration = users.map((user) => ({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  }));

  res.send(userIteration);
};

// Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let user = {};

  try {
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      user = {
        first_name: "Coder",
        last_name: "House",
        email: "adminCoder@coder.com",
        age: 18,
        role: "ADMIN",
      };
    } else {
      user = await getByEmailService(email);
      if (!user) {
        return res.sendClientError("User not found");
      }

      const comparePassword = isValidPassword(user, password);
      if (!comparePassword) {
        return res.sendClientError("Incorrect credentials");
      }

      user.last_connection = new Date().toISOString();
      await updateUserService(email, user);
    }

    const accessToken = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      last_connection: user.last_connection,
      age: user.age,
    });

    res
      .cookie("coderCookieToken", accessToken, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      })
      .send({ status: "success", message: "User logged in", payload: user });
  } catch (error) {
    getLogger().error(error);
    res.status(400).send({
      status: "error",
      message: "Incorrect credentials",
      payload: error.message,
    });
  }
};

// Register
const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const role = ROLE_PERMISSIONS.USER;
    if (!first_name || !last_name || !role || !email || !password)
      return res.sendClientError("Incomplete values");

    const exists = await getByEmailService(email);

    if (exists) return res.sendClientError("User already exists");

    const hashedPassword = createHash(password);

    const user = {
      ...req.body,
    };

    user.password = hashedPassword;

    const result = await createUserService(user);

    res.sendSuccess(result);
  } catch (error) {
    getLogger().error(error);
    res.sendServerError(error.message);
  }
};

const resetUser = async (req, res) => {
  try {
    const { token, password } = req.body;

    const tokenData = await verifyToken(token);
    const email = tokenData.user.email;

    if (!email || !password)
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });

    const user = await getByEmailService(email);

    if (!user)
      return res.status(400).send({ status: "error", error: "User not found" });

    if (isValidPassword(user, password)) {
      return res.status(400).send({
        status: "error",
        error: "New password must be different from current password",
      });
    }

    const newPass = createHash(password);
    user.password = newPass;

    await updateUserService(email, user);

    res.send({ status: "success", message: "Password reset" });
  } catch (error) {
    getLogger().error(error.message);
    res.status(500).send({ status: "error", error: error.message });
  }
};

const resetEmailUser = async (req, res) => {
  try {
    const email = req.body.email;

    if (!email)
      return res
        .status(400)
        .send({ status: "error", error: "Incomplete values" });

    await resetEmailUserService(email);
    res.send({ status: "success", message: "Email reset" });
  } catch (error) {
    getLogger().error(error.message);
    res.status(500).send({ status: "error", error: error.message });
  }
};

const githubUser = async (req, res) => {
  res.send({ status: "success", message: "User registered" });
};

const githubCallbackUser = async (req, res) => {
  const user = req.user;
  const accessToken = generateToken(user);
  res
    .cookie("coderCookieToken", accessToken, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
    })
    .redirect("/home");
};

// Logout
const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send({ status: "error", error: err });
    res.clearCookie("coderCookieToken");
    res.redirect("/");
  });
};

const updateUserRole = async (req, res) => {
  const uid = req.params.uid;
  const role = req.body.role;
  try {
    const result = await updateUserRoleService(uid, role);
    res.send({
      status: "success",
      message: "User role updated successfully",
    });
  } catch (error) {
    getLogger().warn(error.message);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const updateUserDocument = async (req, res) => {
  const uid = req.params.uid;
  const files = req.files;
  try {
    const result = await updateUserDocumentService(uid, files);

    res.send({
      status: "success",
      message: "User document updated successfully",
    });
  } catch (error) {
    getLogger().warn(error.message);
    res.status(400).send({ status: "error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const uid = req.params.uid;
  try {
    await deleteUserService(uid);
    res.send({
      status: "success",
      message: "Usuario borrado correctamente",
    });
  } catch (error) {
    getLogger().info(
      "[controllers/usersController.js] /deleteUser " + error.message
    );
    res.status(400).send({ status: "error", error: error.message });
  }
};

const deleteUsers = async (req, res) => {
  try {
    const result = await deleteUsersService();

    const resUsers = result.map((user) => ({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    }));

    res.send({
      status: "success",
      message: "Usuarios sin actividad borrados correctamente",
      payload: resUsers,
    });
  } catch (error) {
    getLogger().info(
      "[controllers/usersController.js] /deleteUsers " + error.message
    );
    res.status(400).send({ status: "error", error: error.message });
  }
};

export {
  getUsers,
  loginUser,
  registerUser,
  resetUser,
  logoutUser,
  githubUser,
  githubCallbackUser,
  resetEmailUser,
  updateUserDocument,
  updateUserRole,
  deleteUser,
  deleteUsers,
};
