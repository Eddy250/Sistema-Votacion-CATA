import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'votes.db')

if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    try:
        cur.execute('ALTER TABLE voters ADD COLUMN email VARCHAR(120);')
        conn.commit()
        print("Migración exitosa: Columna 'email' añadida a 'voters'.")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e).lower():
            print("La columna 'email' ya existe en 'voters'.")
        else:
            print(f"Error en migración: {e}")
    conn.close()
else:
    print("La base de datos votes.db no existe aún. Será creada por SQLAlchemy luego.")
