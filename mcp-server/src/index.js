import "dotenv/config";
import express from "express";
import cors from "cors";
import pkg from "pg";
import { askGroq } from "./ia/groq.js";

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "postgres",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres1",
  database: process.env.DB_NAME || "agente_whatsapp_ia",
  port: 5432,
});

app.get("/health", (req, res) => {
  res.json({ status: "MCP Server OK" });
});

app.post("/ask-ia", async (req, res) => {
  try {
    const { telefono, mensaje } = req.body;

    if (!telefono || !mensaje) {
      return res.status(400).json({
        ok: false,
        error: "Faltan campos telefono o mensaje",
      });
    }

    // Buscar conversación
    let result = await pool.query(
      "SELECT id FROM conversaciones WHERE telefono = $1",
      [telefono]
    );

    let conversacionId;

    // Crear si no existe
    if (result.rows.length === 0) {
      const insert = await pool.query(
        "INSERT INTO conversaciones (telefono) VALUES ($1) RETURNING id",
        [telefono]
      );
      conversacionId = insert.rows[0].id;
    } else {
      conversacionId = result.rows[0].id;
    }

    // Guardar mensaje usuario
    await pool.query(
      `
      INSERT INTO mensajes (conversacion_id, origen, mensaje)
      VALUES ($1, 'usuario', $2)
      `,
      [conversacionId, mensaje]
    );

    // Llamar IA
    const respuesta = await askGroq(mensaje);

    // Guardar respuesta agente
    await pool.query(
      `
      INSERT INTO mensajes (conversacion_id, origen, mensaje)
      VALUES ($1, 'agente', $2)
      `,
      [conversacionId, respuesta]
    );

    // Responder
    res.json({
      ok: true,
      respuesta,
    });
  } catch (error) {
    console.error("Error IA:", error);
    res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
});

  



app.listen(4000, () => {
  console.log("Servidor IA corriendo en http://localhost:4000");
});
