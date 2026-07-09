# 🧠 MEMORIA DEL PROYECTO: SISTEMA DE VOTACIÓN V2 (Desacoplado)

> **📝 INSTRUCCIÓN PARA LA IA DEL FUTURO (EN CASA):**
> Hola, colega IA. Si el usuario te envía este archivo, significa que continuaremos trabajando desde su computadora de casa (que tiene más RAM e internet). Nuestra misión es ayudarle a terminar y montar el sistema "Next-Gen". 
> **EL ESTADO ACTUAL DEL PROYECTO ES EL SIGUIENTE:**

## 1. Arquitectura Construida Correctamente:
- **Backend (Python / Flask):** Ya no renderiza HTML (`app.py` y `routes/main.py`). Se convirtió en una API REST pura que devuelve respuestas JSON y maneja CORS globalmente. Escucha en `http://localhost:5000/api`.
- **Frontend (React + Vite + Tailwind CSS V4):** Creamos una carpeta paralela llamada `voting-frontend`. Implementamos Glassmorphism estético superior con animaciones `framer-motion` (Login, Tarjetas de Voto, y un Dashboard Administrativo con `react-chartjs-2`). Escucha en `http://localhost:5173`.
- **Base de Datos (SQLite):** El archivo `data/alumnos.csv` ha sido usado pero la BD SQLite ya tiene anexada la columna clave `email` mediante un script de migración, lista para notificaciones n8n.

## 2. Automatización n8n Lista (A Pendiente de Prueba):
- Dejamos preparado el archivo maestro `workflow_correos_n8n.json` en la raíz del proyecto.
- En la PC de trabajo remoto (colegio), el internet era demasiado lento para descargar el peso de `n8n` global (`npm install -g n8n`), por lo que su instalación quedó a medias o falló por timeout.
- **Tu misión en Casa:**
  1. Instalar y arrancar n8n localmente (aprovechando el internet rápido): `npx n8n start`.
  2. Importar el archivo JSON de correos en el panel de `localhost:5678`.
  3. Solicitar al usuario las credenciales (Contraseña de Aplicación de Gmail o cuenta SendGrid del equipo de Sistemas).
  4. Realizar la prueba final empaquetada.

## 3. Próximos Pasos Pendientes:
- [ ] Ejecutar exitosamente el flujo web hacia n8n para el comprobante de votos.
- [ ] Crear otro flujo similar para emitir el "Reporte Analítico en Excel" a los profesores al terminar las votaciones.
- [ ] Opcional Final: Empaquetar todo el frontend en un APK usando **Capacitor JS** para publicarlo en la Play Store, según la consulta del cliente.

**NO BORRES ESTE ARCHIVO.** El usuario lo utilizará siempre como puente de memoria entre sus dispositivos.
