const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const join = (req, res) => {
    try {
        const { email, password } = req.body;
        const salt = crypto.randomBytes(10).toString("base64");
        const hashPassword = crypto
            .pbkdf2Sync(password, salt, 10000, 10, 64, "sha512")
            .toString("base64");

        let sql = "insert into users (email, password, salt) values (?, ?, ?)";
        let values = [email, hashPassword, salt];

        conn.query(sql, values, (err, results) => {
            if (err || results.affectedRows < 1) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.CREATED).json(results);
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

const login = (req, res) => {
    try {
        const { email, password } = req.body;

        let sql = "select * from users where email = ?";

        conn.query(sql, [email], (err, results) => {
            if (err || results.affectedRows < 1) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            const loginUser = results[0];
            if (!loginUser) return res.status(StatusCodes.UNAUTHORIZED).end();

            const hashPassword = crypto
                .pbkdf2Sync(password, loginUser.salt, 10000, 10, 64, "sha512")
                .toString("base64");
            if (loginUser.password == hashPassword) {
                const token = jwt.sign(
                    {
                        id: loginUser.id,
                        email: loginUser.email,
                    },
                    process.env.PRIVATE_KEY,
                    {
                        expiresIn: "5m",
                        issuer: "N",
                    }
                );
                res.cookie("token", token, {
                    httpOnly: true,
                });
                console.log(token);

                return res.status(StatusCodes.OK).join(results);
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

const passordResetRequest = (req, res) => {
    try {
        const { email } = req.body;

        let sql = "select * from users where email = ?";

        conn.query(sql, [email], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            const user = results[0];
            if (user) {
                return res.status(StatusCodes.OK).json({ email: email });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

const passwordReset = (req, res) => {
    try {
        const { email, password } = req.body;
        const salt = crypto.randomBytes(10).toString("base64");
        const hashPassword = crypto
            .pbkdf2Sync(password, salt, 10000, 10, 64, "sha512")
            .toString("base64");

        let sql = "update users set password=?, salt=? where email=?";
        let values = [hashPassword, salt, email];

        conn.query(sql, values, (err, results) => {
            if (err || results.affectedRows < 1) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

module.exports = { join, login, passordResetRequest, passwordReset };
