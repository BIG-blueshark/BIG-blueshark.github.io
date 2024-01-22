const ensureAuthorization = require("../auth");
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const allBooks = (req, res) => {
    try {
        let allBooksResult = {};
        let { category_id, news, limit, currentPage } = req.query;
        let offset = limit * (currentPage - 1);
        let sql =
            "select sql_calc_found_rows *, (select count(*) from likes where books.id = liked_book_id) as likes from books";
        let values = [];
        if (category_id && news) {
            sql +=
                " where category_id=? and pub_date between date_sub(now(), interval 1 month) and now()";
            values = [category_id];
        } else if (category_id) {
            sql += " where category_id=?";
            values = [category_id];
        } else if (news) {
            sql += " where pub_date between date_sub(now(), interval 1  month) and now()";
        }

        sql += " limit ? offset ?";
        values.push(parseInt(limit), offset);

        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                // return res.status(StatusCodes.BAD_REQUEST).end();
            }
            if (results.length) {
                results.map(function (result) {
                    result.pubDate = result.pub_date;
                    delete result.pub_date;
                });
                allBooksResult.books = results;
            } else return res.status(StatusCodes.NOT_FOUND).end();
        });

        sql += "select found_rows()";
        conn.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            let pagenation = {
                currentPage: parseInt(currentPage),
                totalCount: results.length > 0 ? results[0]["found_rows()"] : 0,
            };
            allBooksResult.pagenation = pagenation;
            return res.status(StatusCodes.OK).json(allBooksResult);
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

const bookDetail = (req, res) => {
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
            let book_id = req.params.id;
            let sql, values;
            if (authorization instanceof ReferenceError) {
                values = [book_id];
                sql = `select * (select count(*) from likes where liked_book_id=books.id) as likes
                from books from books left join category on books.category_id = category.category_id where books.id=?`;
            } else {
                values = [authorization.id, book_id, book_id];
                sql = `select * (select count(*) from likes where liked_book_id=books.id) as likes, 
                (select exists (select * from likes where user_id=? and liked_book_id=?)) as liked 
                from books from books left join category on books.category_id = category.category_id where books.id=?`;
            }

            conn.query(sql, values, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }
                if (results[0]) return res.status(StatusCodes.CREATED).json(results[0]);
                else return res.status(StatusCodes.NOT_FOUND).end();
            });
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

module.exports = { allBooks, bookDetail };
