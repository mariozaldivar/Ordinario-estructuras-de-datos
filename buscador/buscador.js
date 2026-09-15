class Buscador {
  constructor() {
    this.barra = document.querySelector("#url");
    this.visitadosElemento = document.querySelector("#retrocedidos");
    this.retrocedidosElemento = document.querySelector("#visitados");
    this.currentPageElememto = document.querySelector("#currentPage");
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

  dibujarActual(){
    const actual = this.visitados[this.visitados.length - 1];
    this.currentPageElememto.textContent = actual
      ? `Pagina actual: ${actual}`
      : "Pagina actual: "
  }

  buscar() {
    if (this.validarURL()) {
      this.visitados.push(this.barra.value);
      this.barra.value = "";
      this.retrocedidos = [];
      this.dibujarVisitados();
      this.dibujarRetrocedidos();
      this.dibujarActual();
    }
  }

  retroceder() {
    if (this.visitados.length !== 0) {
      this.retrocedidos.push(this.visitados.pop());
      this.dibujarVisitados();
      this.dibujarRetrocedidos();
      this.dibujarActual();
    }
  }

  avanzar(){
    if (this.retrocedidos.length !== 0){
      this.visitados.push(this.retrocedidos.pop());
      this.dibujarVisitados();
      this.dibujarRetrocedidos();
      this.dibujarActual();
    }
  }



}



document.addEventListener("DOMContentLoaded", () => {
  const buscador = new Buscador();

  const botonBuscar = document.querySelector("#buscar");
  const botonRetroceder = document.querySelector("#retroceder");
  const botonExit = document.querySelector("#exit");
  const botonAvanzar = document.querySelector("#avanzar");

  botonBuscar.addEventListener("click", () => buscador.buscar());
  botonRetroceder.addEventListener("click", () => buscador.retroceder());
  botonAvanzar.addEventListener("click",() => buscador.avanzar());
  botonExit.addEventListener("click", () => window.close());
});
