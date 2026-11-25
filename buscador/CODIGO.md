# Navegador web — código documentado

Historial de navegación con dos pilas: páginas visitadas (atrás) y páginas retrocedidas (adelante).

## Implementación original del equipo

Todo el programa fue escrito a mano por el equipo: `buscador.js`, `index.html` y `styles.css`.

### Historial con dos pilas

> **Origen: equipo** — Dos arreglos usados como pilas: `visitados` (atrás) y `retrocedidos` (adelante).

```js
this.visitados = [];
this.retrocedidos = [];
```

### Validar la URL

> **Origen: equipo** — Usa `URL.canParse` sobre lo escrito en la barra.

```js
validarURL() {
  return URL.canParse(this.barra.value);
}
```

### Visitar una página

> **Origen: equipo** — Apila la URL en visitados y vacía las páginas siguientes.

```js
buscar() {
  if (this.validarURL()) {
    this.visitados.push(this.barra.value);
    this.barra.value = "";
    this.retrocedidos = [];
    this.animacionSearchBar()
    this.dibujarVisitados();
    this.dibujarRetrocedidos();
    this.dibujarActual();
    this.animacionSearchBar();
  }
}
```

### Back

> **Origen: equipo** — Saca el tope de visitados y lo apila en retrocedidos.

```js
retroceder() {
  if (this.visitados.length !== 0) {
    this.retrocedidos.push(this.visitados.pop());
    this.animacionSearchBar()
    this.dibujarVisitados();
    this.dibujarRetrocedidos();
    this.dibujarActual();
  }
}
```

### Forward

> **Origen: equipo** — Saca el tope de retrocedidos y lo regresa a visitados.

```js
avanzar(){
  if (this.retrocedidos.length !== 0){
    this.visitados.push(this.retrocedidos.pop());
    this.animacionSearchBar()
    this.dibujarVisitados();
    this.dibujarRetrocedidos();
    this.dibujarActual();
  }
}
```

### Página actual

> **Origen: equipo** — La página actual es el tope de visitados.

```js
dibujarActual(){
  const actual = this.visitados[this.visitados.length - 1];
  this.currentPageElememto.textContent = actual
    ? `Pagina actual: ${actual}`
    : "Pagina actual: "
}
```

### Mostrar las pilas

> **Origen: equipo** — Dibuja cada pila como una lista de URLs.

```js
dibujarVisitados() {
  this.visitadosElemento.innerHTML = this.visitados
    .map((url) => `<li>${url}</li>`)
    .join("");
}
```

### Animación de la barra

> **Origen: equipo** — Escribe el texto de ayuda letra por letra en la barra de búsqueda.

```js
animacionSearchBar(txt = "Empieza a escribir con https://", v = 40){
  let i = 0;

  const escribir = () => {
    if (i <= txt.length){
      this.barra.placeholder = txt.slice(0 , i) + (i < txt.length ? "|" : "");
      i++;
      setTimeout(escribir, v)
    }
  }

  escribir();
}
```

### Botones, Enter y Exit

> **Origen: equipo** — Conecta los botones; Enter también busca y Exit cierra la ventana.

```js
botonBuscar.addEventListener("click", () => buscador.buscar());
buscador.barra.addEventListener("keydown", (e) => {
  if (e.key == "Enter"){
    buscador.buscar();
  }
});
botonRetroceder.addEventListener("click", () => buscador.retroceder());
botonAvanzar.addEventListener("click",() => buscador.avanzar());
botonExit.addEventListener("click", () => window.close());
```

## Generado con IA

El programa no tiene lógica generada con IA. Lo único agregado con inteligencia artificial es esta documentación: este archivo, el panel `visor/` y el botón que lo abre (marcado con `[IA]` en `index.html`).

### Botón "Ver código"

> **Origen: IA** — Abre este panel con la documentación del proyecto.

```html
<button type="button" class="ver-codigo" data-ver-codigo="CODIGO.md" data-titulo="Navegador web">Ver código</button>
```
