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
    const body = req.body;

    // Chequeo rápido: si NO hay mensajes o es un estado (statuses)
    // respondemos 200 OK inmediatamente y terminamos
    // Esto evita que n8n cree ejecuciones fallidas por estos eventos

    /*const value = body?.entry?.[0]?.changes?.[0]?.value;
    if (!value?.messages || value?.statuses) {
      // Es un evento de estado (entregado, leído, etc.) → ignoramos
      return res.sendStatus(204);  // ← esta línea es la que cambia todo
    }*/

    // Si llegó aquí → SÍ es un mensaje real del usuario

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

    //console.log("Mensaje recibido:", mensaje);  // ← agrega esta línea
    const respuesta = await askGroq(mensaje);
    //console.log("Respuesta de Groq:", respuesta);  // ← agrega esta también
   

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
