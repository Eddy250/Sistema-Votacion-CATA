from flask import Flask
from config import Config
from models import db
from routes.main import main_bp
from routes.admin import admin_bp
from cli import register_cli_commands
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

# Permitir conexión del frontend externo (React/Next)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

db.init_app(app)

# Exponer la API base
app.register_blueprint(main_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api/admin')

register_cli_commands(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
