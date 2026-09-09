class Buscador {
  constructor() {
    this.barra = document.querySelector("#url");
    this.visitadosElemento = document.querySelector("#visitados");
    this.retrocedidosElemento = document.querySelector("#retrocedidos");
    this.visitados = [];
    this.retrocedidos = [];
  }

  validarURL() {
    return URL.canParse(this.barra.value);
  }

  dibujarVisitados() {
    this.visitadosElemento.innerHTML = this.visitados
      .map((url) => `<li>${url}</li>`)
      .join("");
  }

  dibujarRetrocedidos() {
    this.retrocedidosElemento.innerHTML = this.retrocedidos
      .map((url) => `<li>${url}</li>`)
      .join("");
  }

  buscar() {
    if (this.validarURL()) {
      this.visitados.push(this.barra.value);
      this.barra.value = "";
      this.retrocedidos = [];
      this.dibujarVisitados();
      this.dibujarRetrocedidos();
    }
  }

  retroceder() {
    if (this.visitados.length !== 0) {
      this.retrocedidos.push(this.visitados.pop());
      this.dibujarVisitados();
      this.dibujarRetrocedidos();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const buscador = new Buscador();

  const botonBuscar = document.querySelector("#buscar");
  const botonRetroceder = document.querySelector("#retroceder");

  botonBuscar.addEventListener("click", () => buscador.buscar());
  botonRetroceder.addEventListener("click", () => buscador.retroceder());
});
