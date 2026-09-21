from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import shutil
import os
import json
import traceback

app = FastAPI(title="Cola de impresion")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_PATH = Path(__file__).resolve().parent
FILES_PATH = BASE_PATH / "files"
QUEUE_PATH = BASE_PATH / "queue.json"


def read_queue() -> list[str]:
    """Lee la cola desde disco. Si no existe, arranca vacia"""
    if not QUEUE_PATH.exists():
        return []
    with open(QUEUE_PATH, "r") as json_queue:
        return json.load(json_queue)


def write_queue(queue: list[str]) -> None:
    """Persiste la cola en disco"""
    with open(QUEUE_PATH, "w") as json_queue:
        json.dump(queue, json_queue, indent=2)


@app.get("/")
def prueba():
    return {"Esto es una prueba": "404 not found"}


@app.post("/uploadfile")
def uploadFile(file: UploadFile = File(...)):
    """Encola un archivo: lo guarda en disco y lo agrega al final."""
    try:
        file_name = os.path.basename(file.filename)
        FILES_PATH.mkdir(parents=True, exist_ok=True)
        upload_directory = FILES_PATH / file_name
        with open(upload_directory, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        queue = read_queue()
        queue.append(file_name)
        write_queue(queue)

        return {"status": "saved", "name": file_name, "position": len(queue)}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"No se pudo encolar el archivo: {e}"
        )


@app.post("/getfiles")
def getFiles():
    """Devuelve la cola completa, del frente (indice 0) al final."""
    try:
        return read_queue()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"No se pudo leer la cola: {e}")


@app.post("/printfile")
def printFile():
    """Imprime: saca el archivo del frente de la cola y lo borra del disco."""
    try:
        queue = read_queue()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"No se pudo leer la cola: {e}")

    if not queue:
        raise HTTPException(status_code=409, detail="La cola esta vacia")

    try:
        file_name = queue.pop(0)
        (FILES_PATH / file_name).unlink(True)
        write_queue(queue)

        return {"status": "printed", "name": file_name, "remaining": len(queue)}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"No se pudo imprimir el archivo: {e}"
        )
