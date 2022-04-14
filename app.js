// Importo las constantes

import {
  templateCard,
  fragment,
  cards,
  items,
  footer,
  templateFooter,
  templateCarrito,
} from "./constants.js";

// Declaro el carrito vacio

let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  fetchData();

  // Agrego el carrito al local storage

  if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    pintarCarrito();
  }
});

// Acciones de click

cards.addEventListener("click", (e) => {
  addCarrito(e);
});

items.addEventListener("click", (e) => {
  btnAccion(e);
});

// Traigo la data desde comidas.json

const fetchData = async () => {
  try {
    const res = await fetch("comidas.json");
    const data = await res.json();
    pintarCards(data);
  } catch (err) {
    console.log(err);
  }
};

// Pinto las cards de los platos con su respectivo nombre y precio

const pintarCards = (data) => {
  data.forEach((plato) => {
    templateCard.querySelector("h5").textContent = plato.name;
    templateCard.querySelector("p").textContent = plato.price;
    templateCard.querySelector(".btn").dataset.id = plato.id;
    const clone = templateCard.cloneNode(true); // true para que se clonen los nodos hijos
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (objeto) => {
  const plato = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    name: objeto.querySelector("h5").textContent,
    price: objeto.querySelector("p").textContent,
    amount: 1,
  };
  if (carrito.hasOwnProperty(plato.id)) {
    plato.amount = carrito[plato.id].amount + 1;
  }
  carrito[plato.id] = { ...plato };
  pintarCarrito();
};

const pintarCarrito = () => {
  items.innerHTML = "";
  Object.values(carrito).forEach((plato) => {
    templateCarrito.querySelector("th").textContent = plato.id;
    templateCarrito.querySelectorAll("td")[0].textContent = plato.name;
    templateCarrito.querySelectorAll("td")[1].textContent = plato.amount;
    templateCarrito.querySelector(".btn-primary").dataset.id = plato.id;
    templateCarrito.querySelector(".btn-warning").dataset.id = plato.id;
    templateCarrito.querySelector("span").textContent =
      plato.amount * plato.price;

    const clone = templateCarrito.cloneNode(true);
    items.appendChild(clone);
  });

  items.appendChild(fragment);

  pintarFooter();

  localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Variable para pintar el footer

const pintarFooter = () => {
  footer.innerHTML = "";
  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío</th>`;
    return;
  }

  const nCantidad = Object.values(carrito).reduce(
    (acc, { amount }) => acc + amount,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { amount, price }) => acc + amount * price,
    0
  );
  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);
  footer.appendChild(fragment);

  const btnVaciar = document.getElementById("vaciar-carrito");
  btnVaciar.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

// Acciones de boton + y -

const btnAccion = (e) => {
  // Aumentar

  if (e.target.classList.contains("btn-primary")) {
    const plato = carrito[e.target.dataset.id];
    plato.amount++;
    carrito[e.target.dataset.id] = { ...plato };
    pintarCarrito();
  }

  // Disminuir

  if (e.target.classList.contains("btn-warning")) {
    const plato = carrito[e.target.dataset.id];
    plato.amount--;
    if (plato.amount === 0) {
      delete carrito[e.target.dataset.id];
    }
    pintarCarrito();
  }
  e.stopPropagation();
};
