/* [IA] ARCHIVO GENERADO CON INTELIGENCIA ARTIFICIAL (visor de la documentación). */

/**
 * Intérprete de Markdown y resaltador de sintaxis del visor de documentación.
 *
 * Convierte el subconjunto de Markdown que usan los archivos CODIGO.md
 * (encabezados, párrafos, listas, citas, tablas, bloques de código y formato
 * en línea) a HTML. Todo el texto se escapa antes de insertarse, así que el
 * contenido del .md nunca se interpreta como HTML.
 */

/**
 * Escapa los caracteres especiales de HTML.
 * @param {string} text Texto original.
 * @returns {string} Texto seguro para insertar en HTML.
 */
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * Resaltador de sintaxis sencillo para JavaScript, Python, CSS y HTML.
 * Divide el código en fichas (comentarios, cadenas, números, palabras clave...)
 * y envuelve cada una en un <span> con su clase.
 */
class SyntaxHighlighter {
  constructor() {
    const jsKeywords = [
      "async", "await", "break", "case", "catch", "class", "const", "continue", "default", "delete", "do", "else",
      "export", "extends", "finally", "for", "function", "if", "import", "in", "instanceof", "let", "new", "of",
      "return", "static", "super", "switch", "this", "throw", "try", "typeof", "var", "void", "while", "yield",
    ];
    const jsLiterals = ["true", "false", "null", "undefined", "Infinity", "NaN"];
    const pythonKeywords = [
      "and", "as", "assert", "break", "case", "class", "continue", "def", "del", "elif", "else", "except",
      "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "match", "not", "or", "pass",
      "raise", "return", "self", "try", "while", "with", "yield",
    ];
    const pythonLiterals = ["True", "False", "None"];

    /** Reglas por lenguaje: patrones de comentario y cadena, palabras clave y literales. */
    this.languages = {
      js: {
        comment: String.raw`\/\/[^\n]*|\/\*[\s\S]*?\*\/`,
        string: String.raw`\`(?:\\[\s\S]|[^\\\`])*\`|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'`,
        keywords: new Set(jsKeywords),
        literals: new Set(jsLiterals),
      },
      python: {
        comment: String.raw`#[^\n]*`,
        string: String.raw`[rfbu]{0,2}"""[\s\S]*?"""|[rfbu]{0,2}'''[\s\S]*?'''|[rfbu]{0,2}"(?:\\.|[^"\\\n])*"|[rfbu]{0,2}'(?:\\.|[^'\\\n])*'`,
        keywords: new Set(pythonKeywords),
        literals: new Set(pythonLiterals),
      },
      css: {
        comment: String.raw`\/\*[\s\S]*?\*\/`,
        string: String.raw`"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'`,
        keywords: new Set(),
        literals: new Set(),
      },
      html: {
        comment: String.raw`<!--[\s\S]*?-->`,
        string: String.raw`"(?:\\.|[^"\\\n])*"`,
        keywords: new Set(),
        literals: new Set(),
      },
    };
    this.aliases = { javascript: "js", py: "python", python3: "python" };
  }

  /**
   * Resalta un fragmento de código.
   * @param {string} code Código fuente.
   * @param {string} language Lenguaje indicado en el bloque (```js, ```python...).
   * @returns {string} HTML con las fichas envueltas en <span>.
   */
  highlight(code, language) {
    const rules = this.languages[this.aliases[language] ?? language];
    if (rules === undefined) {
      return escapeHtml(code);
    }

    const tokenPattern = new RegExp(
      `(${rules.comment})|(${rules.string})|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_$][\\w$]*)`,
      "g",
    );

    let html = "";
    let lastIndex = 0;

    for (const match of code.matchAll(tokenPattern)) {
      html += escapeHtml(code.slice(lastIndex, match.index));
      html += this.wrapToken(match, rules, code, match.index + match[0].length);
      lastIndex = match.index + match[0].length;
    }

    return html + escapeHtml(code.slice(lastIndex));
  }

  /**
   * Envuelve una ficha según su tipo.
   * @param {RegExpMatchArray} match Coincidencia de la expresión de fichas.
   * @param {object} rules Reglas del lenguaje.
   * @param {string} code Código completo (para mirar el carácter siguiente).
   * @param {number} endIndex Posición donde termina la ficha.
   * @returns {string}
   */
  wrapToken(match, rules, code, endIndex) {
    const [token, comment, string, number, word] = match;
    const span = (className) => `<span class="tok-${className}">${escapeHtml(token)}</span>`;

    if (comment !== undefined) return span("comentario");
    if (string !== undefined) return span("cadena");
    if (number !== undefined) return span("numero");

    if (word !== undefined) {
      if (rules.keywords.has(word)) return span("clave");
      if (rules.literals.has(word)) return span("literal");
      if (/^[A-Z]/.test(word)) return span("clase");
      if (code[endIndex] === "(") return span("funcion");
    }
    return escapeHtml(token);
  }
}

/**
 * Intérprete de Markdown: convierte texto Markdown a HTML.
 */
class MarkdownRenderer {
  /**
   * @param {SyntaxHighlighter} highlighter Resaltador para los bloques de código.
   */
  constructor(highlighter) {
    this.highlighter = highlighter;
  }

  /**
   * Convierte un documento Markdown completo a HTML.
   * @param {string} markdown Texto Markdown.
   * @returns {string} HTML resultante.
   */
  render(markdown) {
    return this.renderBlocks(markdown.replace(/\r\n?/g, "\n").split("\n"));
  }

  /**
   * Interpreta una lista de líneas como bloques (encabezados, listas, tablas...).
   * @param {string[]} lines Líneas del documento o de una cita.
   * @returns {string}
   */
  renderBlocks(lines) {
    const html = [];
    let index = 0;

    while (index < lines.length) {
      const line = lines[index];

      if (line.trim() === "") {
        index += 1;
      } else if (/^\s*```/.test(line)) {
        index = this.renderCodeBlock(lines, index, html);
      } else if (/^#{1,6}\s/.test(line)) {
        html.push(this.renderHeading(line));
        index += 1;
      } else if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) {
        html.push("<hr />");
        index += 1;
      } else if (/^\s*>/.test(line)) {
        index = this.renderBlockquote(lines, index, html);
      } else if (this.isTableStart(lines, index)) {
        index = this.renderTable(lines, index, html);
      } else if (/^\s*([-*+]|\d+\.)\s+/.test(line)) {
        index = this.renderList(lines, index, html);
      } else {
        index = this.renderParagraph(lines, index, html);
      }
    }

    return html.join("\n");
  }

  /**
   * Bloque de código delimitado por ```lenguaje ... ```.
   * @returns {number} Índice de la línea siguiente al bloque.
   */
  renderCodeBlock(lines, start, html) {
    const language = lines[start].trim().slice(3).trim().toLowerCase();
    const code = [];
    let index = start + 1;

    while (index < lines.length && !/^\s*```\s*$/.test(lines[index])) {
      code.push(lines[index]);
      index += 1;
    }

    const label = language === "" ? "texto" : language;
    html.push(
      `<figure class="bloque-codigo"><figcaption><span>${escapeHtml(label)}</span>` +
        `<button type="button" class="copiar">Copiar</button></figcaption>` +
        `<pre><code>${this.highlighter.highlight(code.join("\n"), language)}</code></pre></figure>`,
    );
    return index + 1;
  }

  /**
   * Encabezado (# a ######).
   * @param {string} line Línea del encabezado.
   * @returns {string}
   */
  renderHeading(line) {
    const [, hashes, text] = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    const level = hashes.length;
    return `<h${level}>${this.renderInline(text)}</h${level}>`;
  }

  /**
   * Cita (> ...). Si empieza con "**Origen: equipo**" u "**Origen: IA**" se
   * marca con una clase para mostrarla como etiqueta de origen del código.
   * @returns {number}
   */
  renderBlockquote(lines, start, html) {
    const inner = [];
    let index = start;

    while (index < lines.length && /^\s*>/.test(lines[index])) {
      inner.push(lines[index].replace(/^\s*>\s?/, ""));
      index += 1;
    }

    const firstLine = inner[0].toLowerCase();
    let className = "cita";
    if (firstLine.startsWith("**origen: equipo")) className = "cita origen-equipo";
    else if (firstLine.startsWith("**origen: ia")) className = "cita origen-ia";
    else if (firstLine.startsWith("**origen: mixto")) className = "cita origen-mixto";

    html.push(`<blockquote class="${className}">${this.renderBlocks(inner)}</blockquote>`);
    return index;
  }

  /**
   * Indica si en la línea empieza una tabla (encabezado seguido de |---|---|).
   * @returns {boolean}
   */
  isTableStart(lines, index) {
    return (
      lines[index].includes("|") &&
      index + 1 < lines.length &&
      /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(lines[index + 1])
    );
  }

  /**
   * Divide una fila de tabla en celdas (respeta \| dentro de una celda).
   * @param {string} line Fila de la tabla.
   * @returns {string[]}
   */
  splitRow(line) {
    return line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split(/(?<!\\)\|/)
      .map((cell) => cell.trim().replace(/\\\|/g, "|"));
  }

  /**
   * Tabla con encabezado y filas.
   * @returns {number}
   */
  renderTable(lines, start, html) {
    const header = this.splitRow(lines[start]);
    const rows = [];
    let index = start + 2;

    while (index < lines.length && lines[index].includes("|") && lines[index].trim() !== "") {
      rows.push(this.splitRow(lines[index]));
      index += 1;
    }

    const head = header.map((cell) => `<th>${this.renderInline(cell)}</th>`).join("");
    const body = rows
      .map((row) => `<tr>${header.map((_, column) => `<td>${this.renderInline(row[column] ?? "")}</td>`).join("")}</tr>`)
      .join("");

    html.push(`<div class="tabla"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`);
    return index;
  }

  /**
   * Lista con viñetas o numerada (un nivel; las líneas con sangría continúan el elemento).
   * @returns {number}
   */
  renderList(lines, start, html) {
    const ordered = /^\s*\d+\./.test(lines[start]);
    const items = [];
    let index = start;

    while (index < lines.length) {
      const line = lines[index];
      const itemMatch = line.match(/^\s*(?:[-*+]|\d+\.)\s+(.*)$/);

      if (itemMatch) {
        items.push(itemMatch[1]);
      } else if (/^\s{2,}\S/.test(line) && items.length > 0) {
        items[items.length - 1] += ` ${line.trim()}`;
      } else {
        break;
      }
      index += 1;
    }

    const tag = ordered ? "ol" : "ul";
    html.push(`<${tag}>${items.map((item) => `<li>${this.renderInline(item)}</li>`).join("")}</${tag}>`);
    return index;
  }

  /**
   * Párrafo: líneas seguidas hasta una línea vacía o el inicio de otro bloque.
   * @returns {number}
   */
  renderParagraph(lines, start, html) {
    const text = [];
    let index = start;

    while (
      index < lines.length &&
      lines[index].trim() !== "" &&
      !/^\s*(```|#{1,6}\s|>|([-*+]|\d+\.)\s+)/.test(lines[index]) &&
      !this.isTableStart(lines, index)
    ) {
      text.push(lines[index].trim());
      index += 1;
    }

    html.push(`<p>${this.renderInline(text.join(" "))}</p>`);
    return index;
  }

  /**
   * Formato en línea: `código`, **negritas**, *cursivas* y [enlaces](url).
   * @param {string} text Texto de una línea o celda.
   * @returns {string}
   */
  renderInline(text) {
    const codeSpans = [];

    // El código en línea se aparta primero para que su contenido no se interprete.
    let html = text.replace(/`([^`]+)`/g, (_, code) => {
      codeSpans.push(`<code>${escapeHtml(code)}</code>`);
      return `\u0000${codeSpans.length - 1}\u0000`;
    });

    html = escapeHtml(html)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => this.renderLink(label, url))
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*\w])\*([^*\s][^*]*)\*(?!\w)/g, "$1<em>$2</em>");

    return html.replace(/\u0000(\d+)\u0000/g, (_, position) => codeSpans[Number(position)]);
  }

  /**
   * Enlace; solo se permiten direcciones http(s), relativas o anclas internas.
   * @param {string} label Texto ya escapado.
   * @param {string} url Dirección ya escapada.
   * @returns {string}
   */
  renderLink(label, url) {
    if (!/^(https?:\/\/|#|\.{0,2}\/|[\w-]+[\w./-]*$)/i.test(url) || /^javascript:/i.test(url)) {
      return label;
    }
    const external = /^https?:\/\//i.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${url}"${external}>${label}</a>`;
  }
}
