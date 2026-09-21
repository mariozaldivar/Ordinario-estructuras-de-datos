import { useRef, useState } from "react";

export default function Upload({ onFiles, disabled = false }) {
  const inputRef = useRef(null);
  const [arrastrando, setArrastrando] = useState(false);

  function entregarArchivos(fileList) {
    const archivos = Array.from(fileList ?? []);
    if (archivos.length > 0) onFiles(archivos);
  }

  function handleDrop(event) {
    event.preventDefault();
    setArrastrando(false);
    if (!disabled) entregarArchivos(event.dataTransfer.files);
  }

  function handleDragOver(event) {
    event.preventDefault();
    if (!disabled) setArrastrando(true);
  }

  return (
    <div
      className={`upload-band${arrastrando ? " is-dragging" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setArrastrando(false)}
    >
      <svg
        className="upload-icon"
        viewBox="0 0 48 48"
        role="presentation"
        aria-hidden="true"
      >
        <path
          d="M24 31V13m0 0-7 7m7-7 7 7"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 30v4a3 3 0 0 0 3 3h20a3 3 0 0 0 3-3v-4"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <p className="upload-title">Arrastra y suelta tu archivo</p>
      <span className="upload-or">o</span>

      <button
        type="button"
        className="browse-button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Buscar
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="upload-input"
        onChange={(event) => {
          entregarArchivos(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
}
