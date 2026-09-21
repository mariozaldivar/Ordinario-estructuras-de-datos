import QueueFile from "./QueueFile.jsx";

export default function Queue({
  files,
  pending,
  loading,
  printing,
  leavingName,
  onPrint,
}) {
  if (loading) {
    return (
      <div className="queue-area">
        <p className="queue-empty">Cargando la cola…</p>
      </div>
    );
  }

  if (files.length === 0 && pending.length === 0) {
    return (
      <div className="queue-area">
        <p className="queue-empty">
          La cola está vacía. Sube un archivo para encolarlo.
        </p>
      </div>
    );
  }

  return (
    <div className="queue-area">
      <ol className="queue-track">
        {files.map((name, indice) => (
          <QueueFile
            key={`${name}-${indice}`}
            name={name}
            position={indice + 1}
            isFront={indice === 0}
            isPrinting={indice === 0 && printing}
            isLeaving={indice === 0 && name === leavingName}
            onPrint={onPrint}
          />
        ))}

        {pending.map((archivo) => (
          <QueueFile
            key={archivo.id}
            name={archivo.name}
            position={files.length + 1}
            progress={archivo}
          />
        ))}
      </ol>

      <div className="queue-axis">
        <span>← sale por el frente</span>
        <span>entra por el final →</span>
      </div>
    </div>
  );
}
