from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Voter(db.Model):
    __tablename__ = 'voters'
    codigo = db.Column(db.String(50), primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=True) # Para notificaciones n8n
    ha_votado = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Voter {self.codigo}>'

class Candidato(db.Model):
    __tablename__ = 'candidatos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.String(500), nullable=True) # opcional
    foto = db.Column(db.String(200), nullable=True) # ruta a la imagen en static/img/

    def __repr__(self):
        return f'<Candidato {self.nombre}>'

class Voto(db.Model):
    __tablename__ = 'votos'
    id = db.Column(db.Integer, primary_key=True)
    candidato_id = db.Column(db.Integer, db.ForeignKey('candidatos.id'), nullable=False)
    voter_codigo = db.Column(db.String(50), db.ForeignKey('voters.codigo'), nullable=False, unique=True) # Evita doble voto a nivel de DB
    
    # Para acceder al candidato desde el voto si es necesario
    candidato = db.relationship('Candidato', backref=db.backref('votos', lazy=True))

    def __repr__(self):
        return f'<Voto por Candidato {self.candidato_id}>'
