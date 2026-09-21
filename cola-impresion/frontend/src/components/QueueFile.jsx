import { fileExtension } from "../format.js";

export default function QueueFile({
  name,
  position,
  isFront = false,
  isLeaving = false,
  isPrinting = false,
  progress = null,
  onPrint,
}) {
  const porcentaje = progress
    ? Math.round((progress.loaded / Math.max(progress.total, 1)) * 100)
    : 0;

  return (
    <li
      className={[
        "queue-card",
        isFront ? "is-front" : "",
        isLeaving ? "is-leaving" : "",
        progress ? "is-uploading" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={isLeaving ? "true" : undefined}
    >
      <div className="card-inner">
        <span className="card-badge" aria-hidden="true">
          {fileExtension(name)}
        </span>

        <span className="card-name" title={name}>
          {name}
        </span>

        {progress ? (
          <>
            <span className="card-detail">{porcentaje}%</span>
            <span className="card-bar">
              <span
                className="card-bar-fill"
                style={{ width: `${porcentaje}%` }}
              />
            </span>
          </>
        ) : isFront ? (
          <button
            type="button"
            className="print-button"
            onClick={onPrint}
            disabled={isPrinting}
          >
            {isPrinting ? "Imprimiendo" : "Imprimir"}
          </button>
        ) : (
          <span className="card-detail">Posición {position}</span>
        )}
      </div>
    </li>
  );
}
