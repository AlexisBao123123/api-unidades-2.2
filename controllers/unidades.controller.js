// controllers/unidades.controller.js
const pool = require("../config/db");

// ✅ Obtener todas las unidades
const getUnidades = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM unidades ORDER BY id_uni");
    res.json({
      exito: true,
      datos: rows,
      total: rows.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      exito: false,
      error: "Error al obtener las unidades",
      mensaje: error.message
    });
  }
};

// ✅ Obtener una unidad por ID
const getUnidadById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM unidades WHERE id_uni = ?", [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ 
        exito: false,
        error: "Unidad no encontrada" 
      });
    }
    res.json({
      exito: true,
      datos: rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      exito: false,
      error: "Error al buscar la unidad",
      mensaje: error.message
    });
  }
};

// ✅ Crear una nueva unidad
const createUnidad = async (req, res) => {
  try {
    // 🔑 Manejo seguro del body
    const nom_uni = req.body?.nom_uni;

    // Validación
    if (!nom_uni || nom_uni.trim() === '') {
      return res.status(400).json({ 
        exito: false,
        error: "El nombre de la unidad es requerido" 
      });
    }

    if (nom_uni.length > 25) {
      return res.status(400).json({ 
        exito: false,
        error: "El nombre no puede exceder 25 caracteres" 
      });
    }

    const [result] = await pool.query(
      "INSERT INTO unidades (nom_uni) VALUES (?)", 
      [nom_uni.trim()]
    );
    
    res.status(201).json({ 
      exito: true,
      mensaje: "Unidad creada exitosamente",
      datos: {
        id_uni: result.insertId, 
        nom_uni: nom_uni.trim()
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      exito: false,
      error: "Error al crear la unidad",
      mensaje: error.message
    });
  }
};

// ✅ Actualizar una unidad
const updateUnidad = async (req, res) => {
  try {
    const { id } = req.params;
    const nom_uni = req.body?.nom_uni;

    // Validación
    if (!nom_uni || nom_uni.trim() === '') {
      return res.status(400).json({ 
        exito: false,
        error: "El nombre de la unidad es requerido" 
      });
    }

    if (nom_uni.length > 25) {
      return res.status(400).json({ 
        exito: false,
        error: "El nombre no puede exceder 25 caracteres" 
      });
    }

    const [result] = await pool.query(
      "UPDATE unidades SET nom_uni = ? WHERE id_uni = ?",
      [nom_uni.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        exito: false,
        error: "Unidad no encontrada" 
      });
    }

    res.json({ 
      exito: true,
      mensaje: "Unidad actualizada correctamente",
      datos: {
        id_uni: parseInt(id),
        nom_uni: nom_uni.trim()
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      exito: false,
      error: "Error al actualizar la unidad",
      mensaje: error.message
    });
  }
};

// ✅ Eliminar una unidad
const deleteUnidad = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM unidades WHERE id_uni = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        exito: false,
        error: "Unidad no encontrada" 
      });
    }

    res.json({ 
      exito: true,
      mensaje: "Unidad eliminada correctamente",
      id_eliminado: parseInt(id)
    });
  } catch (error) {
    console.error(error);
    
    // Error de foreign key (la unidad está siendo usada en productos)
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        exito: false,
        error: "No se puede eliminar la unidad porque está siendo utilizada en productos"
      });
    }
    
    res.status(500).json({ 
      exito: false,
      error: "Error al eliminar la unidad",
      mensaje: error.message
    });
  }
};

module.exports = {
  getUnidades,
  getUnidadById,
  createUnidad,
  updateUnidad,
  deleteUnidad,
};
