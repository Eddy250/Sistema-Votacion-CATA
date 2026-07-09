from app import app, db
from models import Candidato

with app.app_context():
    c1 = Candidato.query.get(1)
    if c1:
        c1.foto = "img/francovidal.png"
        db.session.commit()
        print("Candidato 1 actualizado con la nueva foto.")
    else:
        print("Candidato 1 no encontrado.")
        
    c2 = Candidato.query.get(2)
    if c2:
        c2.foto = "img/alanacuña.png"
        db.session.commit()
        print("Candidato 2 actualizado con la nueva foto.")
    else:
        print("Candidato 2 no encontrado.")    
