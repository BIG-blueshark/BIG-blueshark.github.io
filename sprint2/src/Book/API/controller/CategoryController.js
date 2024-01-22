const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allCategory = (req, res) => {
    try {
        let sql = "select * from category";
        conn.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.OK).json(results);
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

module.exports = { allCategory };
