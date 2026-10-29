import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import iaRoutes from './src/route/iaRoutes.js';

const app = express();
const port = process.env.PORT || 4000;

// Configuración de CORS para permitir peticiones desde tus otros sistemas
/*
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
console.log(allowedOrigins)
app.use(cors({
  origin: (origin, callback) => {
    console.log(origin);
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por políticas de CORS'));
    }
  }
}));*/
app.use(cors({ origin: '*' }));

app.use(express.json());

// Montamos las rutas bajo un prefijo global
app.use('/api/ia', iaRoutes);

app.listen(port, () => {
  console.log(`🚀 Microservicio de IA corriendo de forma independiente en el puerto ${port}`);
});
