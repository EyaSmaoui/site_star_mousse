// controllers/user.Controller.js
const userModel = require('../models/user.model');

module.exports.esm = async (req, res) => {
  console.log("Route /users/esm");
  res.status(200).json("marhbe bik");
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.addUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const payload = { email, password };
    if (username) payload.username = username;

    const newUser = new userModel(payload);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.addAdmin = async (req, res) => {
  try {
    const { email, password, permission } = req.body;
    const newAdmin = new userModel({ email, password, role: 'admin', permission });
    await newAdmin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await userModel.findByIdAndDelete(id);
    if (!deleteUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.UpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, location, username } = req.body;
    const updateUser = await userModel.findByIdAndUpdate(
      id, { phone, location, username },
      { new: true }
    );
    if (!updateUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updateUser);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.recherchegebyUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { amount } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.searchUsers = async (req, res) => {
  try {
    const { username, email, role, phone, location } = req.query;

    // Build the query object based on the provided parameters
    const query = {};
    if (username) query.username = username;
    if (email) query.email = email;
    if (role) query.role = role;
    if (phone) query.phone = phone;
    if (location) query.location = location;

    // Search for users based on the query
    const users = await userModel.find(query);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports.adduserWithPhoto = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const photo = req.file ? req.file.path : null; // Assuming you're using multer for file uploads

    const payload = { email, password, photo };
    if (username) payload.username = username;

    const newUser = new userModel(payload);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const jwt = require('jsonwebtoken');
const maxAge = 2 * 20; // 2 minutes in seconds
const scretkey = process.env.JWT_SECRET_KEY;
const createToken = (id) => {
  return jwt.sign({ id }, scretkey, {
    expiresIn: maxAge,
  });
};
module.exports.login = async (req, res) => {
  try {
    //logic for login
    const { email, password } = req.body;
    const user = await userModel.Login(email, password);
    const token = createToken(user._id);
    res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};
module.exports.getAuthUser = async (req, res) => {
  try {
    //logic
    const user = req.session.user;
   res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};