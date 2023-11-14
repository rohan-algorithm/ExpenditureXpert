import express from "express";
import {
//   getProducts,
//   getCustomers,
  getTransactions,
  // addTransactions,
//   getGeography,
} from "../controllers/client.js";

const router = express();

// router.get("/products", getProducts);
// router.get("/customers", getCustomers);
router.get("/create", getTransactions);


// router.get("/geography", getGeography);

export default router;