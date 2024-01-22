const ensureAuthorization = require("../auth");
const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "root",
        database: "Bookshop",
        dateStrings: true,
    });

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
            const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

            let sql = "insert into delivery (address, receiver, contact) values (?, ?, ?)";
            let values = [delivery.address, delivery.receiver, delivery.contact];
            let [results] = await conn.execute(sql, values);
            let delivery_id = results.insertId;

            sql =
                "insert into orders (book_title, total_quantity, total_price, user_id, delivery_id) values (?, ?, ?, ?, ?)";
            values = [firstBookTitle, totalQuantity, totalPrice, authorization.id, delivery_id];
            [results] = await conn.execute(sql, values);
            let order_id = results.insertId;

            sql = "select book_id, quantity from cartItems where id in (?)";
            let [orderItems, fields] = await conn.query(sql, [items]);

            sql = "insert into orderedBook (order_id, book_id, quantityd) values ?";
            values = [];
            orderItems.forEach((item) => {
                values.push([order_id, item.book_id, item.quantity]);
            });

            results = await conn.query(sql, [values]);

            let result = await deleteCartItems(conn);
            return res.status(StatusCodes.OK).json(result);
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    } finally {
        if (conn) await conn.end();
    }
};

const deleteCartItems = async (conn, items) => {
    try {
        let sql = `delete from cartItems where id in (?)`;

        let result = await conn.query(sql, items);
        return result;
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    } finally {
        if (conn) await conn.end();
    }
};

const getOrders = async (req, res) => {
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
            const conn = await mariadb.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "root",
                database: "Bookshop",
                dateStrings: true,
            });

            let sql = `select orders.id, created_at, address, receiver, contact, book_title, total_quantity, total_price
            from orders left join delivery on orders.delivery_id = delivery.id`;
            let [rows, fields] = await conn.query(sql);
            return res.status(StatusCodes.OK).json(rows);
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    } finally {
        if (conn) await conn.end();
    }
};

const getOrderDetail = async (req, res) => {
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
            const orderId = req.params.id;
            const conn = await mariadb.createConnection({
                host: "127.0.0.1",
                user: "root",
                password: "root",
                database: "Bookshop",
                dateStrings: true,
            });

            let sql = `select book_id, title, author, price, quantity 
            from orderedBook left join books on orderedBook.book_id = books.id
            where order_id = ?`;
            let [rows, fields] = await conn.query(sql, [orderId]);
            return res.status(StatusCodes.OK).json(rows);
        }
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    } finally {
        if (conn) await conn.end();
    }
};

module.exports = { order, getOrders, getOrderDetail };
