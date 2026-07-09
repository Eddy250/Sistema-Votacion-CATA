# Sistema de Votación Electrónica Escolar

Sistema simple desarrollado con Python, Flask, SQLAlchemy y Tailwind CSS para elecciones locales en colegios.

## Requisitos
- Python 3.8+
- El servidor debe estar conectado a la red local (LAN o WiFi) del colegio.

## Instalación y Ejecución

1. **Instalar dependencias**:
   Abre una terminal en esta carpeta y ejecuta:
   ```bash
   pip install -r requirements.txt
   ```

2. **Inicializar la Base de Datos**:
   Crea el archivo `votes.db` con las tablas necesarias y algunos datos de prueba iniciales:
   ```bash
   flask --app app.py init-db
   ```
   *(Esto creará la tabla y añadirá "Juan Pérez", "María González" y 2 códigos de prueba: 2023001, 2023002)*

3. **Ejecutar el servidor en modo Red Local**:
   ```bash
   python app.py
   ```
   Esto ejecutará el servidor Flask de manera accesible desde otras computadoras en la red local.

4. **Acceso desde otras PCs / celulares**:
   - En la computadora que corre el servidor, averigua tu IP local (usando `ipconfig` en Windows o `ifconfig` / `ip addr` en Mac/Linux). Ej: `192.168.1.150`
   - Los alumnos pueden entrar desde sus navegadores yendo a: **http://192.168.1.150:5000**
   - El panel de administrador está en: **http://192.168.1.150:5000/admin**

## Importar Alumnos Reales (Padrones)
Crea un archivo CSV (por ejemplo `alumnos.csv`) con al menos una columna llamada `codigo` (y opcionalmente `nombre`). 
Luego ejecuta:
```bash
python import_csv.py data/alumnos.csv
```

## Agregar Imágenes reales
Coloca las fotos de los candidatos en `static/img/` y actualiza la base de datos (o la carga inicial en `init-db` dentro de `app.py`) apuntándolas, ej: `img/candidato_1.jpg`.
