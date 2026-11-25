/* [IA] ARCHIVO GENERADO CON INTELIGENCIA ARTIFICIAL (visor de la documentación). */

/**
 * Panel "Ver código": una segunda ventana que se abre sobre la página del
 * proyecto y muestra su CODIGO.md interpretado con MarkdownRenderer.
 *
 * Uso: un botón con data-ver-codigo="ruta/al/CODIGO.md" y data-titulo="Proyecto".
 */

/** Tiempo que el botón muestra "Copiado", en milisegundos. */
const COPY_FEEDBACK_DURATION = 1500;

/**
 * Panel lateral con la documentación de código de un proyecto.
 */
class CodePanel {
  /**
   * @param {HTMLButtonElement} button Botón que abre el panel.
   */
  constructor(button) {
    this.markdownPath = button.dataset.verCodigo;
    this.title = button.dataset.titulo ?? "Proyecto";
    this.renderer = new MarkdownRenderer(new SyntaxHighlighter());
    this.loaded = false;
    this.dialog = this.createDialog();

    button.addEventListener("click", () => this.open());
  }

  /**
   * Crea el diálogo del panel con su encabezado y el área de contenido.
   * @returns {HTMLDialogElement}
   */
  createDialog() {
    const dialog = document.createElement("dialog");
    dialog.className = "panel-codigo";
    dialog.setAttribute("aria-label", `Código documentado: ${this.title}`);

    const header = document.createElement("header");
    const heading = document.createElement("div");
    const title = document.createElement("h2");
    const legend = document.createElement("p");
    const closeButton = document.createElement("button");

    title.textContent = `Código · ${this.title}`;
    legend.className = "panel-leyenda";
    legend.append(this.createBadge("Equipo", "equipo"), " programado por el equipo ", this.createBadge("IA", "ia"), " generado con IA");
    heading.append(title, legend);

    closeButton.type = "button";
    closeButton.className = "panel-cerrar";
    closeButton.textContent = "✕";
    closeButton.setAttribute("aria-label", "Cerrar");
    closeButton.addEventListener("click", () => dialog.close());

    header.append(heading, closeButton);

    this.content = document.createElement("div");
    this.content.className = "panel-contenido";

    dialog.append(header, this.content);

    // Un clic fuera del panel (sobre el fondo oscuro) lo cierra.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    document.body.append(dialog);
    return dialog;
  }

  /**
   * Crea una etiqueta de color para la leyenda.
   * @param {string} text Texto de la etiqueta.
   * @param {"equipo"|"ia"} type Tipo de origen.
   * @returns {HTMLSpanElement}
   */
  createBadge(text, type) {
    const badge = document.createElement("span");
    badge.className = `panel-insignia ${type}`;
    badge.textContent = text;
    return badge;
  }

  /** Abre el panel; la primera vez descarga y dibuja la documentación. */
  async open() {
    this.dialog.showModal();
    if (!this.loaded) {
      await this.load();
    }
  }

  /** Descarga el CODIGO.md y lo muestra interpretado. */
  async load() {
    this.content.textContent = "Cargando…";

    try {
      const response = await fetch(this.markdownPath);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      this.content.innerHTML = this.renderer.render(await response.text());
      this.markParts();
      this.enableCopyButtons();
      this.loaded = true;
    } catch {
      this.showNotice();
    }
  }

  /** Explica por qué no se pudo leer el archivo (página abierta como archivo local). */
  showNotice() {
    const notice = document.createElement("div");
    const title = document.createElement("strong");
    const detail = document.createElement("p");

    notice.className = "panel-aviso";
    title.textContent = "No se pudo leer la documentación";
    detail.textContent =
      "El navegador no permite leer archivos cuando la página se abre con doble clic. Ábrela desde GitHub Pages " +
      "o con un servidor local: en la carpeta del repositorio ejecuta «python3 -m http.server» y entra a http://localhost:8000.";
    notice.append(title, detail);
    this.content.replaceChildren(notice);
  }

  /**
   * Da color a los dos grandes apartados del documento: la implementación
   * original del equipo (siempre primero) y lo generado con IA (al final).
   */
  markParts() {
    for (const heading of this.content.querySelectorAll("h2")) {
      const isAiPart = heading.textContent.trim().startsWith("Generado con IA");
      heading.classList.add("parte", isAiPart ? "parte-ia" : "parte-equipo");
    }
  }

  /** Agrega a cada bloque de código el comportamiento del botón "Copiar". */
  enableCopyButtons() {
    for (const button of this.content.querySelectorAll(".copiar")) {
      button.addEventListener("click", async () => {
        const code = button.closest("figure").querySelector("code").textContent;
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "Copiado";
        } catch {
          button.textContent = "No se pudo copiar";
        }
        setTimeout(() => (button.textContent = "Copiar"), COPY_FEEDBACK_DURATION);
      });
    }
  }
}

for (const button of document.querySelectorAll("[data-ver-codigo]")) {
  new CodePanel(button);
}
