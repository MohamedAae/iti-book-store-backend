const express = require("express"),
  bcrypt = require("bcrypt"),
  saltRounds = +process.env.SALTROUNDS,
  router = express.Router(),
  User = require("./users.model"),
  helpers = require("../../helpers/api.js");

router.get("/", async (req, res, next) => {
  let user;
  try {
    user = await User.find();
    return res.status(201).json({
      success: true,
      code: 201,
      user: user,
    });
  } catch (err) {
    return helpers.handleError(err, res);
  }
});

router.post("/regester", async (req, res, next) => {
  const data = req.body;
  try {
    const hashedPassword = await hashPassword(data.password);
    data.password = hashedPassword;
    const user = new User(data);
    const saved = await user.save();
    return res.status(201).json({
      success: true,
      code: 201,
      user: saved,
    });
  } catch (err) {
    return helpers.handleError(err, res);
  }
});

router.post("/login", async (req, res, next) => {
  const data = req.body,
    { email, password } = data;

  try {
    const currentUser = await User.findOne({ email: email });

    console.log(currentUser);
    if (!currentUser) {
      return helpers.handleError("user not exist", res);
    }
    const match = await bcrypt.compare(password, currentUser.password);

    if (!match) {
      return helpers.handleError("err data login", res);
    }
    return res.status(201).json({
      success: true,
      code: 201,
      user: currentUser,
    });
  } catch (err) {
    return helpers.handleError(err, res);
  }
});

const hashPassword = (plainpassword) => {
  let passwordHash = bcrypt
    .hash(plainpassword, saltRounds)
    .then(function (hash) {
      return hash;
    });
  return passwordHash.then((res, rej) => {
    return res;
  });
};

module.exports = router;
