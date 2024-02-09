import express from "express";
import clientController from "../controllers/client.js";

const router = express.Router();

//Método HTTP: Get Path: /clientes/consultar
router.get("/consultar", clientController.get);

//Método HTTP: Post Path: /clientes/actualizar
router.put("/actualizar/:id", clientController.update);

//Método HTTP: Delete Path: /clientes/borrar
router.delete("/borrar/:id/:auth_email", clientController.delete);
router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;

// Path: backend/routes/auth.routes.js
// Compare this snippet from backend/database/keys.js:
// import { Pool } from "pg";
