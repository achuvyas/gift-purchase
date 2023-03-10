const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchase");

router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const purchase = new Purchase({
    merchantName: req.body.merchantName,
    discountPercent: req.body.discountPercent,
    totalAmount: req.body.totalAmount,
    cashbackExpected: req.body.cashbackExpected,
  });
  try {
    const newPurchase = await purchase.save();
    res.status(201).json(newPurchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch("/:id", getPurchase, async (req, res) => {
  if (req.body.merchantName != null) {
    res.purchase.merchantName = req.body.merchantName;
  }
  if (req.body.totalAmount != null) {
    res.purchase.totalAmount = req.body.totalAmount;
  }
  if (req.body.discountPercent != null) {
    res.purchase.discountPercent = req.body.discountPercent;
  }
  if (req.body.cashbackExpected != null) {
    res.purchase.cashbackExpected = req.body.cashbackExpected;
  }
  try {
    const updatedPurchase = await res.purchase.save();
    res.json(updatedPurchase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  // console.log(req.params.id, "req");
  try {
    await Purchase.deleteOne({ _id: req.params.id });

    res.json({ message: "Deleted the Purchase" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getPurchase(req, res, next) {
  let purchase;
  try {
    purchase = await Purchase.findById(req.params.id);
    if (purchase == null) {
      return res.status(404).json({ message: "Cannot find purchase" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.purchase = purchase;
  next();
}

module.exports = router;
