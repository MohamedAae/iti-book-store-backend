const saltRounds = +process.env.SALTROUNDS,
  express = require("express"),
  router = express.Router(),
  bcrypt = require("bcrypt"),
  helpers = require("../../helpers/api.js"),
  jwt = require("../../auth/token"),
  User = require("./users.model");

router.get("/", jwt.auth, async (req, res, next) => {
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

router.post("/register", async (req, res, next) => {
  const data = req.body;
  try {
    const hashedPassword = await hashPassword(data.password);
    data.password = hashedPassword;
    const user = new User(data);
    const saved = await user.save();
    saved.token = jwt.generateToken(saved._id);
    console.log(saved.token);
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
    { email, password } = data,
    token = jwt.generateToken();

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

    currentUser.token = token;
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
