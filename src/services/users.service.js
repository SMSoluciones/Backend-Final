import {
  getUsers as getUsersRepository,
  createUser as createUserRepository,
  getByEmail as getByEmailUserRepository,
  updateUser as updateUserRepository,
  updateUserDocument as updateUserDocumentRepository,
  updateUserRole as updateUserRoleRepository,
  deleteUser as deleteUserRepository,
  getByIdUser as getByIdUserRepository,
} from "../repositories/user.repository.js";

import moment from "moment";
import resetEmailService from "../services/resetEmail.service.js";

import config from "../config/config.js";

import { generateToken } from "../utils.js";
import deleteEmail from "../services/deleteEmail.service.js";

const inactivityTime = config.inactivity_time;

const createUser = async (user) => {
  const result = await createUserRepository(user);
  return result;
};

const getUsers = async () => {
  const users = await getUsersRepository();
  return users;
};

const getByEmail = async (email) => {
  const user = await getByEmailUserRepository(email);
  return user;
};

const updateUser = async (email, user) => {
  const result = await updateUserRepository(email, user);
  return result;
};

const resetEmailUser = async (email) => {
  const user = await getByEmailUserRepository(email);

  if (!user) {
    return { status: "error", message: "User not found" };
  }

  const accessToken = generateToken({ email }, "1h");

  const message = `Para recuperar su contraseña haga click en el siguiente link: <a href="http://localhost:8080/reset-password/?token=${accessToken}">Recuperar contraseña</a>`;

  await resetEmailService(email, message);
};

const updateUserRole = async (uid, role) => {
  const result = await updateUserRoleRepository(uid, role);
  return result;
};

const updateUserDocument = async (uid, filename) => {
  const result = await updateUserDocumentRepository(uid, filename);
  return result;
};

const deleteUser = async (uid) => {
  const user = await getByIdUserRepository(uid);
  if (!user) {
    throw new Error("Not found");
  }
  const result = await deleteUserRepository(uid);
  const today = new Date();
  const fechaHora = today.toLocaleString();
  const messageEmail1 =
    user.first_name.trim() + "Tu Usuario fue dado de baja de nuestra API";
  const messageEmail2 = " Fecha: " + fechaHora;
  const subjectEmail = "¡Usuario Eliminado!";
  await deleteEmail(user.email, messageEmail1, messageEmail2, subjectEmail);
  return result;
};
const deleteUsers = async () => {
  const users = await getUsersRepository();
  const formatTime = inactivityTime.substring(0, 1);
  let unitedTime = "days";
  if (formatTime === "h") {
    unitedTime = "hours";
  } else if (formatTime === "m") {
    unitedTime = "minutes";
  } else if (formatTime === "s") {
    unitedTime = "seconds";
  }
  const timeInactivity = inactivityTime.substring(1, inactivityTime.length);
  const hoy = moment();
  const usersInact = users.filter(
    (user) =>
      hoy.diff(moment(user.last_connection), unitedTime) > timeInactivity
  );
  for (const user of usersInact) {
    const result = await deleteUserRepository(user._id);
    if (result) {
      const today = new Date();
      const fechaHora = today.toLocaleString();
      const messageEmail1 =
        user.first_name.trim() +
        "Tu Usuario fue dado de baja por Inactividad de nuestra API";
      const messageEmail2 = " Fecha: " + fechaHora;
      const subjectEmail = "¡Usuario Eliminado!";
      await deleteEmail(user.email, messageEmail1, messageEmail2, subjectEmail);
    }
  }
  return usersInact;
};
export {
  createUser,
  getUsers,
  getByEmail,
  updateUser,
  resetEmailUser,
  updateUserDocument,
  updateUserRole,
  deleteUsers,
  deleteUser,
};
