from models import Voter, Voto, Candidato

class StatsManager:
    """Clase para abstraer cálculos y consultas complejas del dashboard."""
    @staticmethod
    def get_dashboard_stats():
        total_alumnos = Voter.query.count()
        votos_emitidos = Voto.query.count()
        porcentaje = round((votos_emitidos / total_alumnos * 100) if total_alumnos > 0 else 0, 1)
        
        candidatos = Candidato.query.all()
        resultados = []
        chart_labels = []
        chart_data = []
        
        for c in candidatos:
            votos_c = Voto.query.filter_by(candidato_id=c.id).count()
            pct_c = round((votos_c / votos_emitidos * 100) if votos_emitidos > 0 else 0, 1)
            resultados.append({
                'nombre': c.nombre,
                'votos': votos_c,
                'porcentaje': pct_c
            })
            chart_labels.append(c.nombre)
            chart_data.append(votos_c)
            
        # Ordenar resultados por votos descendentes
        resultados.sort(key=lambda x: x['votos'], reverse=True)
        voters_list = [{'codigo': v.codigo, 'nombre': v.nombre, 'email': getattr(v, 'email', None), 'ha_votado': v.ha_votado} for v in Voter.query.all()]
        
        return {
            'total_alumnos': total_alumnos,
            'votos_emitidos': votos_emitidos,
            'porcentaje_participacion': porcentaje,
            'resultados': resultados,
            'chart_labels': chart_labels,
            'chart_data': chart_data,
            'voters_list': voters_list
        }
