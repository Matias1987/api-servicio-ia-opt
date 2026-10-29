import express from 'express';
import multer from 'multer';
import { analizarReceta, analizarRecetaBase64 } from '../controller/recetaController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Definimos la ruta específica para recetas
router.post('/vision/analizar-receta', upload.single('receta_imagen'), analizarRecetaBase64);

export default router;
