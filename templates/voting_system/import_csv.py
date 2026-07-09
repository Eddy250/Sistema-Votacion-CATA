import csv
from app import app, db
from models import Voter

def import_voters(csv_file_path):
    # Asegúrate de que estamos en el contexto de la aplicación
    with app.app_context():
        try:
            with open(csv_file_path, mode='r', encoding='utf-8') as file:
                reader = csv.DictReader(file)
                # Verifica que las columnas existan
                if 'codigo' not in reader.fieldnames:
                    print("Error: El archivo CSV debe contener una columna llamada 'codigo'.")
                    return
                
                nuevos = 0
                existentes = 0
                for row in reader:
                    codigo = row['codigo'].strip()
                    nombre = row.get('nombre', '').strip()
                    
                    if not codigo:
                        continue
                        
                    # Verifica si ya existe
                    voter = Voter.query.filter_by(codigo=codigo).first()
                    if voter:
                        existentes += 1
                    else:
                        nuevo_voter = Voter(codigo=codigo, nombre=nombre)
                        db.session.add(nuevo_voter)
                        nuevos += 1
                
                db.session.commit()
                print(f"Importación exitosa. Nuevos códigos: {nuevos}. Códigos existentes saltados: {existentes}.")
        except FileNotFoundError:
            print(f"No se encontró el archivo: {csv_file_path}")
        except Exception as e:
            db.session.rollback()
            print(f"Error importando alumnos: {e}")

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='Importar alumnos desde CSV.')
    parser.add_argument('file', help='Ruta al archivo CSV')
    args = parser.parse_args()
    
    import_voters(args.file)
