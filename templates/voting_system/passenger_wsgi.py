#!/usr/bin/env python3
import sys
import os
import subprocess

def application(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/plain')])
    
    try:
        base_dir = os.path.dirname(__file__)
        req_file = os.path.join(base_dir, 'requirements.txt')
        lib_path = os.path.join(base_dir, 'libs')
        
        output = subprocess.check_output(
            [sys.executable, "-m", "pip", "install", "-t", lib_path, "-r", req_file], 
            stderr=subprocess.STDOUT
        )
        
        return [b"INSTALACION MAGICA COMPLETADA!\n\n", output]
    except subprocess.CalledProcessError as e:
        return [b"ERROR DE INSTALACION:\n\n", e.output]
    except Exception as e:
        return [b"ERROR DESCONOCIDO:\n\n", str(e).encode('utf-8')]
