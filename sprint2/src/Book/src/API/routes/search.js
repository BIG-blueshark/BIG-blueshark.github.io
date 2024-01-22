// 기본 설정
const express = require("express");
const { allSearch } = require("../controller/SearchController");
const router = express.Router();
router.use(express.json());

router.get("/", allSearch);

module.exports = router;
