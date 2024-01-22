const ensureAuthorization = require("../auth");
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const addLike = (req, res) => {
    try {
        const book_id = req.params.id;
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
            let sql = "insert into likes (user_id, liked_book_id) values (?, ?)";
            let values = [authorization.id, book_id];

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

const removeLike = (req, res) => {
    try {
        const book_id = req.params.id;
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
            let sql = "delete from likes where user_id = ? and liked_book_id = ?";
            let values = [authorization.id, book_id];
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

module.exports = { addLike, removeLike };
