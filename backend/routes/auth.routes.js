import express from "express";
import authenticationController from "../controllers/auth.js";

const router = express.Router();

//registrar administradores
router.post("/auth/signup/admin", authenticationController.signAdmin);

//registrar agentes
router.post("/auth/signup/agent", authenticationController.signAgent);

//registrar clientes
//Método HTTP: Post Path: /clientes/crear
router.post("/clientes/crear", authenticationController.signClient);

//iniciar sesion
router.post("/auth/signin", authenticationController.signIn);

router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;

// Path: backend/routes/auth.routes.js
// Compare this snippet from backend/database/keys.js:
// import { Pool } from "pg";
