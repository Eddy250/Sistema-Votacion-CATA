from flask import Blueprint, request, jsonify
from models import db, Candidato, Voto
from utils.file_manager import FileManager
from utils.stats_manager import StatsManager

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    """Retorna las estadísticas del dashboard en JSON"""
    try:
        stats = StatsManager.get_dashboard_stats()
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/candidatos', methods=['GET', 'POST'])
def admin_candidatos():
    if request.method == 'GET':
        candidatos = Candidato.query.all()
        return jsonify([{
            'id': c.id,
            'nombre': c.nombre,
            'descripcion': c.descripcion,
            'foto': f"/static/{c.foto}" if c.foto else None
        } for c in candidatos]), 200

    if request.method == 'POST':
        # multipart/form-data expected
        nombre = request.form.get('nombre')
        descripcion = request.form.get('descripcion')
        foto = request.files.get('foto')

        if not nombre:
            return jsonify({'error': 'El nombre es obligatorio'}), 400

        ruta_foto = FileManager.save_candidate_photo(foto)
        nuevo_candidato = Candidato(nombre=nombre, descripcion=descripcion, foto=ruta_foto)
        db.session.add(nuevo_candidato)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Candidato agregado', 'id': nuevo_candidato.id}), 201

@admin_bp.route('/candidatos/<int:candidato_id>', methods=['PUT', 'DELETE'])
def admin_candidatos_manage(candidato_id):
    candidato = Candidato.query.get(candidato_id)
    if not candidato:
        return jsonify({'error': 'Candidato no encontrado'}), 404

    if request.method == 'PUT':
        if request.form.get('nombre'):
            candidato.nombre = request.form.get('nombre')
        if request.form.get('descripcion') is not None:
            candidato.descripcion = request.form.get('descripcion')
        
        foto = request.files.get('foto')
        ruta_foto = FileManager.save_candidate_photo(foto)
        if ruta_foto:
            candidato.foto = ruta_foto
            
        db.session.commit()
        return jsonify({'success': True, 'message': 'Candidato actualizado'}), 200

    if request.method == 'DELETE':
        Voto.query.filter_by(candidato_id=candidato.id).delete()
        db.session.delete(candidato)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Candidato eliminado'}), 200
