import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'votes.db')
conn = sqlite3.connect(db_path)
cur = conn.cursor()

test_users = [
    ('TEST001', 'Eddy Lucana', 'lucanaeddy07@gmail.com', 0),
    ('TEST002', 'Ayrton', 'ayrton73456@gmail.com', 0),
    ('TEST003', 'Deivix', 'deivixzyz@gmail.com', 0),
    ('TEST004', 'Lniki', 'maryapaza1702@gmail.com', 0)
]

for u in test_users:
    cur.execute("INSERT OR REPLACE INTO voters (codigo, nombre, email, ha_votado) VALUES (?, ?, ?, ?)", u)
    # También borramos posibles rastros en la tabla Votos para que no haya IntegrityErrors
    cur.execute("DELETE FROM votos WHERE voter_codigo = ?", (u[0],))

conn.commit()
conn.close()
print('Inyectados con éxito!')
