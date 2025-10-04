const express = require("express");
const router = express.Router();
const {
  getUnidades,
  getUnidadById,
  createUnidad,
  updateUnidad,
  deleteUnidad,
} = require("../controllers/unidades.controller");

// 🔗 Endpoints
router.get("/", getUnidades);            // GET    http://localhost:25253/api/unidades
router.get("/:id", getUnidadById);       // GET    http://localhost:25253/api/unidades/1
router.post("/", createUnidad);          // POST   http://localhost:25253/api/unidades
router.put("/:id", updateUnidad);        // PUT    http://localhost:25253/api/unidades/1
router.delete("/:id", deleteUnidad);     // DELETE http://localhost:25253/api/unidades/1

module.exports = router;
