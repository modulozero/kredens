import express from "express";
import authRouter from "./auth";
import homeRouter from "./home";

const router = express.Router();

router.use("/", homeRouter);
router.use("/auth", authRouter);

export default router;
