const saltRounds    = +process.env.SALTROUNDS,
    User            = require("./users.model"),
    bcrypt          = require("bcrypt"),
    helpers         = require("../../helpers/api.js"),
    jwt           = require("../../auth/token");

const Controller = {
    get: async (req, res, next) => {
        let user;
        try {
            user = await User.find();
            return res.status(201).json({
                success : true,
                code    : 201,
                user    : user,
            });
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    getPermissions: async (req, res, next) => {
        const id = req.params.id;
        console.log(req);
        try {
            const user = await User.findById({_id: id});
            const isAdmin = user.isAdmin ? user.isAdmin : false;
            return res.status(201).json({
                success: true,
                code: 201,
                isAdmin,
            });
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    create: async (req, res, next) => {
        const data = req.body;
        try {
            const exist = await User.findOne({email: data.email});
            if (exist) {
                return helpers.handleError(`Email Already Exists.`, res);
            }

            if (data.password.length < 6) return helpers.handleError(`Password must be more than 5 characters.`, res);

            const hashedPassword = await hashPassword(data.password);
            data.password = hashedPassword;
            const user = new User(data);

            const saved = await user.save();
            saved.token = jwt.generateToken(saved._id);
            return res.status(201).json({
                success : true,
                code    : 201,
                user    : saved,
            });
        } catch (err) {
            console.log(err);
            if (err.name === 'ValidationError') {
                console.error(Object.values(err.errors).map(val => val.message))
            } else {
                console.error(err);
            }
            console.log(err);
            return helpers.handleError(err, res);
        }
    },

    login: async (req, res, next) => {
        const data              = req.body,
            { email, password } = data;


        try {
            const currentUser = await User.findOne({ email: email });
            if (!currentUser) {
                return helpers.handleError("This email doesn't exist.", res);
            }

            const match = await bcrypt.compare(password, currentUser.password);
            if (!match) {
                return helpers.handleError("Check your credentials.", res);
            }

            const token = jwt.generateToken(currentUser._id, currentUser.isAdmin);
            currentUser.token       = token;
            currentUser.rememberMe  = data.rememberMe;
            return res.status(201).json({
                success : true,
                code    : 201,
                user    : currentUser,
            });
        } catch (err) {
            return helpers.handleError(err, res);
        }
    },

    checkIfExist: async (req, res, next) => {
        try {
            const currentUser = await User.findOne(req.body);
            if (!currentUser) {
                return res.status(201).json({
                    success : true,
                    code    : 201,
                    exists    : false,
                });
            }

            return res.status(201).json({
                success : true,
                code    : 201,
                exists    : true,
            });
        } catch (err) {
            return helpers.handleError(err, res);
        }
    }
}

const hashPassword = (plainPassword) => {
    let passwordHash = bcrypt
        .hash(plainPassword, saltRounds)
        .then(function (hash) {
            return hash;
        });
    return passwordHash.then((res, rej) => {
        return res;
    });
};

module.exports = Controller;
