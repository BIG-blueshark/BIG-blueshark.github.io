const ensureAuthorization = require("../auth");
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const addToCart = (req, res) => {
    try {
        const { book_id, quantity } = req.body;
        let authorization = ensureAuthorization(req, res);

        if (authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "로그인 세션이 만료",
            });
        } else if (authorization instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "잘못된 토큰",
            });
        } else {
            let sql = "insert into cartItems (book_id, quantity, user_id) values (?, ?, ?)";
            let values = [book_id, quantity, authorization.id];

            conn.query(sql, values, (err, results) => {
                if (err || results.affectedRows < 1) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                return res.status(StatusCodes.OK).json(results);
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

const getCartItems = (req, res) => {
    try {
        const { selected } = req.body;
        let authorization = ensureAuthorization(req, res);
        if (authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "로그인 세션이 만료",
            });
        } else if (authorization instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "잘못된 토큰",
            });
        } else {
            let sql = `select cartItems.id, book_id, title, summary, quantity, price
            from cartItems left join books 
            on cartItems.book_id = books.id
            where user_id = ?`;
            let values = [authorization.id];

            if (selected) {
                sql += ` and cartItems.id in (?)`;
                values.push(selected);
            }

            conn.query(sql, values, (err, results) => {
                if (err || results.affectedRows < 1) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                return res.status(StatusCodes.OK).json(results);
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

const removeCartItem = (req, res) => {
    try {
        let authorization = ensureAuthorization(req, res);
        if (authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "로그인 세션이 만료",
            });
        } else if (authorization instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "잘못된 토큰",
            });
        } else {
            const cartItemId = req.params.id;
            let sql = "delete from cartItems where id = ?";

            conn.query(sql, cartItemId, (err, results) => {
                if (err || results.affectedRows < 1) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                return res.status(StatusCodes.OK).json(results);
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

module.exports = { addToCart, getCartItems, removeCartItem };
