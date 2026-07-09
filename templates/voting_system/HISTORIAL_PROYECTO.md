# 🧠 MEMORIA DEL PROYECTO: SISTEMA DE VOTACIÓN V2 (FINAL)

> **📝 INSTRUCCIÓN PARA LA IA (EN CASA):**
> El usuario te pasará las credenciales de su VPS de Hostinger. Tu misión inmediata es:
> 1. Conectar por SSH/WinSCP al VPS
> 2. Subir la carpeta `voting_system` (sin `voting-frontend` ni `node_modules`)
> 3. Instalar Python3, pip y las dependencias en el VPS
> 4. Configurar el servidor con gunicorn + nginx
> 5. Cambiar la IP en `voting-frontend/src/api.js` a la IP pública del VPS
> 6. Recompilar: `npm run build` → `npx cap sync` → Build APK en Android Studio
> 7. El APK final ya conectará al backend real en internet

## 🚨 REPORTE DE INCIDENCIA PARA EL INGENIERO (CPANEL / HOSTING SSD)
El sistema intentó ser desplegado en el Hosting Compartido SSD proporcionado (`elecciones.daddyti.com`). Hubo una falla total del entorno debido a bloqueos y mala configuración del propio servidor:

**Error Fatal de LiteSpeed (Log de servidor):**
`lscgid: execve():/usr/bin/python-html2text: No such file or directory`

**Explicación para el ingeniero:**
- **Terminal bloqueada:** El usuario no tenía permisos SSH/Terminal habilitados en cPanel para instalar `requeriments.txt` localmente.
- **Handler CGI Invalido:** El Servidor LiteSpeed está ruteando mal las aplicaciones Python WSGI hacia un ejecutable de texto obsoleto o inexistente (`python-html2text`) en lugar de pasar el proceso a Phusion Passenger o al binario correcto de Python 3.
- **Se requiere VPS/PaaS:** Hasta que el ingeniero no corrija las Jail Jails de CloudLinux del hosting, o modifique los handlers MIME nativos para Python LSAPI, es imposible correr backends limpios ahí. 

---

## ESTADO ACTUAL DEL CÓDIGO (100% funcional en local):

### ✅ Backend Python (Flask API REST)
- `app.py` → Entry point con CORS habilitado
- `routes/main.py` → Login, Candidatos, Voto + Webhook a n8n
- `routes/admin.py` → Stats, CRUD Candidatos, Export CSV
- Base de datos: `votes.db` (SQLite)

### ✅ Frontend React (Vite + Tailwind V4)
- Carpeta: `voting-frontend/`
- Build compilado en: `voting-frontend/dist/`

### ✅ n8n (Automatización de Correos)
- Workflow listo: `workflow_correos_n8n.json`
- Funciona perfecto conectándolo al Webhook local o de producción.

### ✅ App Android (APK Generado)
- Proyecto configurado con Capacitor JS en `android/`
- **FALTA ÚNICAMENTE:** Cambiar IP en `api.js` de `127.0.0.1` a la IP de producción del VPS, y recompilar.

---

## PASOS PARA OBTENER TU DEMO EN VIVO HOY MISMO (VPS HOSTINGER)

**1. Preparar el Entorno en el VPS (En tu casa):**
```bash
# Una vez conectado por SSH al VPS como 'root'
sudo apt update && sudo apt install python3 python3-pip python3-venv -y
cd /root/voting_system
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

**2. Ejecutar el Servidor en Vivo:**
```bash
# Prenderá el servidor en el puerto 5000 a prueba de balas
gunicorn --bind 0.0.0.0:5000 app:app
```

**3. Activar la App Móvil (El toquecido final):**
- En tu PC: Entra a `voting-frontend/src/api.js`
- Cambia `http://127.0.0.1:5000/api` por `http://LA_IP_DE_TU_VPS:5000/api`
- Corre en VScode: `npm run build` luego `npx cap sync`
- Abre Android Studio y genera el APK.
- ¡Toda la clase podrá votar hoy desde sus teléfonos!
