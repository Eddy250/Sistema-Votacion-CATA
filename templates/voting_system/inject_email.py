import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'votes.db')
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("UPDATE voters SET email = 'dobronxsxyz@gmail.com', ha_votado = 0 WHERE codigo = '2023001'")
conn.commit()
conn.close()
print("Email inyectado y voto reseteado para el alumno de prueba 2023001.")
