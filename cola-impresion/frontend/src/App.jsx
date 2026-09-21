import { useCallback, useEffect, useState } from "react";
import Upload from "./components/Upload.jsx";
import Queue from "./components/Queue.jsx";
import { fetchQueue, printFile, uploadFile } from "./api.js";
import "./App.css";

let contadorPendientes = 0;

const DURACION_SALIDA = 380;

function App() {
  const [files, setFiles] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printing, setPrinting] = useState(false);
  const [leavingName, setLeavingName] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const cola = await fetchQueue();
      setFiles(cola);
      setError(null);
    } catch (problema) {
      setError(problema.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleFiles(archivos) {
    setNotice(null);

    for (const archivo of archivos) {
      const id = ++contadorPendientes;
      setPending((actuales) => [
        ...actuales,
        { id, name: archivo.name, loaded: 0, total: archivo.size },
      ]);

      try {
        await uploadFile(archivo, (loaded, total) => {
          setPending((actuales) =>
            actuales.map((item) =>
              item.id === id ? { ...item, loaded, total } : item,
            ),
          );
        });
        setError(null);
        setNotice(`Encolaste ${archivo.name}`);
      } catch (problema) {
        setError(problema.message);
      } finally {
        setPending((actuales) => actuales.filter((item) => item.id !== id));
      }

      await refresh();
    }
  }

  async function handlePrint() {
    if (files.length === 0) return;

    setPrinting(true);
    setNotice(null);
    setLeavingName(files[0]);

    try {
      const resultado = await printFile();
      await new Promise((listo) => setTimeout(listo, DURACION_SALIDA));
      setError(null);
      setNotice(`Imprimiste ${resultado.name}`);
    } catch (problema) {
      setError(problema.message);
    } finally {
      setPrinting(false);
      await refresh();
      setLeavingName(null);
    }
  }

  const enEspera = files.length;

  return (
    <main className="page">
      <header className="page-head">
        <h1>Cola de impresión</h1>
        <p>
          Los archivos se imprimen en el orden en que llegan: entran por el
          final y salen por el frente.
        </p>
      </header>

      <section className="card">
        <Queue
          files={files}
          pending={pending}
          loading={loading}
          printing={printing}
          leavingName={leavingName}
          onPrint={handlePrint}
        />
        <Upload onFiles={handleFiles} disabled={printing} />
      </section>

      <footer className="page-foot" role="status">
        {error ? (
          <p className="message is-error">{error}</p>
        ) : notice ? (
          <p className="message">{notice}</p>
        ) : (
          <p className="message">
            {enEspera === 0
              ? "Sin trabajos en espera"
              : enEspera === 1
                ? "1 trabajo en espera"
                : `${enEspera} trabajos en espera`}
          </p>
        )}
      </footer>
    </main>
  );
}

export default App;
