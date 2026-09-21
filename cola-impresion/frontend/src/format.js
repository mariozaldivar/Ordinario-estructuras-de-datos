/** Formatea bytes a una unidad legible: 243 B, 8.4 KB, 1.2 MB. */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Extension del archivo para la insignia redonda; maximo 4 caracteres. */
export function fileExtension(name) {
  const punto = name.lastIndexOf(".");
  if (punto === -1 || punto === name.length - 1) return "?";
  return name.slice(punto + 1, punto + 5).toUpperCase();
}
