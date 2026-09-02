class Resistor {
  // value debe ser un array
  constructor(value, element, container) {
    this.valorColores = {
      0: "black",
      1: "brown",
      2: "red",
      3: "orange",
      4: "yellow",
      5: "green",
      6: "blue",
      7: "violet",
      8: "grey",
      9: "white",
    };
    this.container = container;
    this.element = element;
    this.value = value;
    this.stripe1 = element.querySelector("#stripe_1");
    this.stripe2 = element.querySelector("#stripe_2");
    this.stripe3 = element.querySelector("#stripe_3");
    this.stripe4 = element.querySelector("#stripe_4");

    this.stripes = [this.stripe1, this.stripe2, this.stripe3, this.stripe4];
    this.valuesArray = [0, 0, 0, 0];
  }

  setResistorValue(number) {
    this.value = number;
    let numberString = number.toString();
    if (numberString.length == 1) {
      this.valuesArray = [0, number, 0, 0];
    } else if (numberString.length >= 2) {
      this.valuesArray = [
        parseInt(numberString[0]),
        parseInt(numberString[1]),
        numberString.length - 2,
        0,
      ];
    } else {
      this.valuesArray = [0, 0, 0, 0];
    }
  }

  colorStripes() {
    for (let i = 0; i < this.stripes.length; i++) {
      this.stripes[i].style.backgroundColor =
        this.valorColores[this.valuesArray[i]];
    }
  }
}

class Circuito {
  constructor() {}
}

// () => {} es una arrow function, donde
document.addEventListener("DOMContentLoaded", () => {
  const resistorValue = document.querySelector("#valor_resistencia");
  const resistorElement = document.querySelector("#resistor");
  const stripesContainer = document.querySelector("#resistences_container");
  const resistor = new Resistor(0, resistorElement, stripesContainer);

  resistorValue.addEventListener("change", () => {
    resistor.setResistorValue(resistorValue.value);
    resistor.colorStripes();
  });
});
