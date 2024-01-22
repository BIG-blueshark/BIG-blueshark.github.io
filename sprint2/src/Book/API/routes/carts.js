// 기본 설정
const express = require("express");
const router = express.Router();
router.use(express.json());
const { addToCart, getCartItems, removeCartItem } = require("../controller/CartController");

router.post("/", addToCart);

router.get("/", getCartItems);

router.delete("/:id", removeCartItem);

module.exports = router;
