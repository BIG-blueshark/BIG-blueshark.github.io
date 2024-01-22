const conn = require("../mariadb");
const { StatusCodes } = require("http-status-codes");

const allSearch = (req, res) => {
    const { word } = req.query;

    if (!word) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "검색어를 입력하세요." });
    }

    try {
        let sql = `select * from books where title LIKE ? OR summary LIKE ? OR detail LIKE ? OR author LIKE ?`;
        const values = [`%${word}%`, `%${word}%`, `%${word}%`, `%${word}%`];
        conn.query(sql, values, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.NOT_FOUND).end();
            }
            if (results.length > 0) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        });
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "검색에 실패했습니다." });
    }
};

module.exports = { allSearch };
