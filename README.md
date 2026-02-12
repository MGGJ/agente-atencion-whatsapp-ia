# Agente de Atención a Clientes por WhatsApp con IA
Este proyecto implementa un sistema automatizado de atención a clientes vía WhatsApp utilizando Inteligencia Artificial.

Permite responder mensajes en tiempo real, almacenar conversaciones y automatizar procesos internos, mejorando la eficiencia operativa y reduciendo tiempos de respuesta.

# Objetivo del Sistema

Optimizar la atención al cliente mediante:

-Respuestas automáticas inteligentes

-Gestión estructurada de conversaciones

-Integración con base de datos empresarial

-Automatización de flujos operativos

-Arquitectura escalable lista para producción

# Tecnologías Utilizadas

-WhatsApp API

-n8n (Automatización de procesos)

-Node.js + Express (Backend)

-MCP Server (Integración IA)

-PostgreSQL (Base de datos)

-Docker & Docker Compose (Infraestructura)

-GitHub / GitLab (Control de versiones)

-Render / VPS (Despliegue en la nube)

# Arquitectura del Sistema

El sistema está compuesto por tres servicios principales:

1️⃣ PostgreSQL

Base de datos central donde se almacenan conversaciones y mensajes.

2️⃣ MCP Server

Servidor backend que:

-Recibe mensajes

-Consulta la base de datos

-Envía solicitudes a la IA

-Devuelve respuestas inteligentes

3️⃣ n8n

Orquestador de automatizaciones que:

-Recibe mensajes desde WhatsApp

-Llama al MCP Server

-Gestiona flujos

Todos los servicios se ejecutan mediante contenedores Docker para garantizar portabilidad y escalabilidad.

# Cómo Ejecutar el Sistema
# Clonar el repositorio

git clone TU_REPOSITORIO
cd agente-atencion-whatsapp-ia

# Crear archivo .env

Crear un archivo .env en la raíz del proyecto:
CLAUDE_API_KEY=tu-api_key

⚠️ Este archivo no debe subirse al repositorio.

# Levantar los servicios

Desde la raíz del proyecto ejecutar:

docker compose up --build

# Acceso a los servicios
Servicio	URL
n8n	http://localhost:5678

MCP Server	http://localhost:4000

Health Check	http://localhost:4000/health


# Workflows

Los flujos exportados de n8n se encuentran en:

/workflows

Pueden importarse manualmente desde la interfaz de n8n según el entorno.

# Base de Datos

El sistema utiliza un modelo relacional con:

-Tabla conversaciones

-Tabla mensajes

Cada conversación se relaciona con múltiples mensajes mediante conversacion_id, permitiendo trazabilidad completa del historial del cliente.

# Seguridad y Buenas Prácticas

-Variables sensibles gestionadas mediante .env

-Contenedores aislados mediante Docker Network

-Separación de servicios por responsabilidad

-Preparado para integración con autenticación empresarial

# Escalabilidad y Producción

El sistema puede desplegarse en:

-Render

-VPS empresarial

-Infraestructura cloud privada

-Servidores corporativos con Docker

La arquitectura permite escalar servicios de forma independiente según demanda.

# Estado del Proyecto

✔ Funcional en entorno local
✔ Preparado para entorno de producción
✔ Arquitectura escalable
✔ Base para futuras integraciones 