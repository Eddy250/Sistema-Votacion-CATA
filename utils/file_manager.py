import os
from werkzeug.utils import secure_filename
from config import Config

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

class FileManager:
    """Clase para manejar la subida y guardado de archivos estáticos."""
    @staticmethod
    def save_candidate_photo(foto):
        if foto and allowed_file(foto.filename):
            filename = secure_filename(foto.filename)
            os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
            foto.save(os.path.join(Config.UPLOAD_FOLDER, filename))
            return "img/" + filename
        return None
