import express from 'express';
import multer from 'multer';
import { analizarReceta } from '../controllers/recetaController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Definimos la ruta específica para recetas
router.post('/vision/analizar-receta', upload.single('receta_imagen'), analizarReceta);

export default router;
