import userModel from "../models/users.model.js";
export default class Users {
  createUser = async (user) => {
    const result = await userModel.create(user);
    return result;
  };

  getAll = async () => {
    const users = await userModel.find().lean();
    return users;
  };

  getByEmail = async (email) => {
    const user = await userModel.findOne({ email }).lean();
    return user;
  };

  updateOne = async (email, user) => {
    const result = await userModel.updateOne({ email }, user);
    return result;
  };

  getById = async (uid) => {
    const user = await userModel.findOne({ _id: uid }).lean();
    return user;
  };

  updateUserRole = async (uid, role) => {
    const user = await userModel.findOne({ _id: uid }).lean();
    if (!user) throw new Error("User not found");
    if (role === "USER" || role === "PREMIUM") {
      const documents = user.documents ? user.documents : [];
      let index = 0;
      for (let i = 0; i < documents.length - 1; i++) {
        if (documents[i] === "identification") {
          index++;
        }
        if (documents[i] === "account_state") {
          index++;
        }
        if (documents[i] === "address") {
          index++;
        }
      }
    }

    user.role = role;
    const result = await userModel.updateOne({ _id: uid }, user);
    return result;
  };

  updateUserDocument = async (uid, files) => {
    const http = "http://localhost:8080";

    const user = await userModel.findOne({ _id: uid }).lean();

    if (!user) throw new Error("User not found");

    const documents = user.documents ? user.documents : [];

    // Profile
    if (files.profile) {
      user.profile = `${http}/src/public/img/profiles/${files.profile[0].filename}`;
    }

    // Identification
    if (files.identification) {
      let index = -1;
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].name === "identification") {
          index = i;
          break;
        }
      }
      const path = `${http}/src/public/img/documents/${files.identification[0].filename}`;

      if (index != -1) {
        documents[index].name = "identification";
        documents[index].reference = path;
      } else {
        documents.push({
          name: "identification",
          reference: path,
        });
      }
    }

    // Account state
    if (files.account_state) {
      let index = -1;
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].name === "account_state") {
          index = i;
          break;
        }
      }
      const path = `${http}/src/public/img/documents/${files.account_state[0].filename}`;
      if (index != -1) {
        documents[index] = {
          name: "account_state",
          reference: path,
        };
      } else {
        documents.push({
          name: "account_state",
          reference: path,
        });
      }
    }

    // Address
    if (files.address) {
      let index = -1;
      for (let i = 0; i < documents.length; i++) {
        if (documents[i].name === "address") {
          index = i;
          break;
        }
      }
      const path = `${http}/src/public/img/documents/${files.address[0].filename}`;
      if (index != -1) {
        documents[index] = {
          name: "address",
          reference: path,
        };
      } else {
        documents.push({
          name: "address",
          reference: path,
        });
      }
    }

    user.documents = documents;
    const result = await userModel.updateOne({ _id: uid }, user);
    return result;
  };

  deleteUser = async (id) => {
    const user = await userModel.deleteOne({ _id: id });
    return user;
  };
}
