class Resistor {
  // value debe ser un array
  constructor(value, element) {
    this.element = element;
    this.value = value;
    this.stripes = element.querySelector(".stripe");
  }
}

class Circuito {
  constructor() {}
}

const resistorValue = document.querySelector("#valor_resistencia");

// () => {} es una arrow function, donde

const valorColores = {
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

resistorValue.addEventListener("change", () => {
  let valuesArray = [0, 0, 0, 0];
  let numero = String(resistorValue.value);

  if (numero.length <= 0) {
    return;
  }
  if (numero.length == 1) {
    valuesArray[1] = parseInt(numero);
  } else {
    valuesArray[0] = numero[0];
    valuesArray[1] = numero[1];
    numero.slice(2);
    valuesArray[3] = numero.length;
  }

  for (let i = 0; i < valuesArray.length; i++) {
    document.getElementById(`stripe_${i + 1}`).style.backgroundColor =
      valorColores[valuesArray[i]];
  }
});
