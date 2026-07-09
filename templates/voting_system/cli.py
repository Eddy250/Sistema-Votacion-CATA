import click
from models import db, Candidato, Voter

def register_cli_commands(app):
    @app.cli.command('init-db')
    def init_db_command():
        """Inicializa la base de datos."""
        db.create_all()
        
        # Insertar candidatos de prueba si no hay
        if Candidato.query.count() == 0:
            c1 = Candidato(nombre="Juan Pérez", foto="img/francovidal.png")
            c2 = Candidato(nombre="María González", foto="img/maria.jpg")
            c3 = Candidato(nombre="Voto en Blanco")
            db.session.add_all([c1, c2, c3])
            
        # Insertar algunos votantes de prueba si no hay
        if Voter.query.count() == 0:
            v1 = Voter(codigo="2023001", nombre="Alumno Test 1")
            v2 = Voter(codigo="2023002", nombre="Alumno Test 2")
            db.session.add_all([v1, v2])
            
        db.session.commit()
        print("Base de datos inicializada con candidatos de prueba.")
