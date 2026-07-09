import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

# Cargar variables de entorno locales si existe el archivo .env
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    # Usar DB en la nube si existe, sino cargar la SQLite local.
    db_uri = os.environ.get('DATABASE_URL') or 'sqlite:///' + os.path.join(basedir, 'votes.db')
    if db_uri.startswith("postgres://"):
        db_uri = db_uri.replace("postgres://", "postgresql://", 1)
        
    SQLALCHEMY_DATABASE_URI = db_uri
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # En producción (la nube), se leerá la contraseña secreta del servidor.
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave-secreta-muy-segura-para-sesiones'
    
    UPLOAD_FOLDER = os.path.join(basedir, 'static', 'img')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
