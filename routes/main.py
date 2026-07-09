from flask import Blueprint, request, jsonify
from models import db, Voter, Voto, Candidato
import requests
import json

main_bp = Blueprint('main', __name__)

# Webhook URL base por defecto de n8n para pruebas o producción
N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/nuevo-voto'

@main_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('codigo'):
        return jsonify({'error': 'Por favor, ingresa un código válido.'}), 400
        
    codigo = data.get('codigo')
    voter = Voter.query.filter_by(codigo=codigo).first()
    
    if not voter:
        return jsonify({'error': 'Código no encontrado. Verifica si fuiste registrado en el padrón.'}), 404
        
    if voter.ha_votado:
        return jsonify({'error': 'Este código ya ha sido utilizado para votar.'}), 403
        
    return jsonify({
        'success': True,
        'message': 'Login exitoso.',
        'voter': {'codigo': voter.codigo, 'nombre': voter.nombre, 'email': voter.email}
    }), 200

@main_bp.route('/candidatos', methods=['GET'])
def get_candidatos():
    candidatos = Candidato.query.all()
    return jsonify([{
        'id': c.id,
        'nombre': c.nombre,
        'descripcion': c.descripcion,
        'foto': f"/static/{c.foto}" if c.foto else None
    } for c in candidatos]), 200

@main_bp.route('/voto', methods=['POST'])
def voto():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Faltan datos.'}), 400

    voter_codigo = data.get('voter_codigo')
    candidato_id = data.get('candidato_id')
    
    if not voter_codigo or not candidato_id:
        return jsonify({'error': 'Código de votante o candidato faltante.'}), 400
        
    voter = Voter.query.filter_by(codigo=voter_codigo).first()
    if not voter or voter.ha_votado:
        return jsonify({'error': 'Estudiante no autorizado o ya votó.'}), 403

    candidato = Candidato.query.get(candidato_id)
    if not candidato:
        return jsonify({'error': 'Candidato no válido.'}), 404

    nuevo_voto = Voto(candidato_id=int(candidato_id), voter_codigo=voter_codigo)
    voter.ha_votado = True
    
    try:
        db.session.add(nuevo_voto)
        db.session.commit()
        
        # Disparo ultra-rápido asíncrono hacia n8n
        if voter.email:
            try:
                payload = {
                    "voter_nombre": voter.nombre,
                    "voter_email": voter.email,
                    "voter_codigo": voter.codigo,
                    "candidato_nombre": candidato.nombre
                }
                # Solicitud "fuego y olvido" con límite de timeout ultra bajo
                requests.post(N8N_WEBHOOK_URL, json=payload, timeout=2)
            except requests.exceptions.Timeout:
                # Se ignora si el n8n tarda en responder, al alumno no debe importarle
                pass
            except Exception as e:
                print(f"Error interno contactando al Webhook de n8n: {e}")
                
        return jsonify({'success': True, 'message': '¡Tu voto ha sido registrado correctamente!'}), 200
    except Exception as e:
        db.session.rollback()
        print(f"Error DB: {e}")
        return jsonify({'error': 'Ocurrió un error en el servidor al registrar el voto. Intentar de nuevo.'}), 500
