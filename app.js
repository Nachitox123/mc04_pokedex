// Pokémon types colours
const colours = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
}

// Obtener los primeros {limit} pokémones.
async function obtenerPokemones(limit) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const data = await response.json();
    const pokemonList = data.results;

    const promises = pokemonList.map(async (pokemon) => {
      const response = await fetch(pokemon.url);
      const pokemonData = await response.json();

      return {
        numero: pokemonData.id,
        nombre: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
        urlImagen: pokemonData.sprites.front_default,
        tipos: pokemonData.types,
        altura: pokemonData.height / 10,
        peso: pokemonData.weight / 10,
        movimientos: pokemonData.moves.map((element) => element.move.name),
      };
    });

    const todosPokemones = await Promise.all(promises);
    crearCartas(todosPokemones);
  } catch (error) {
    console.error('Error al obtener los pokemones:\n', error);
  }
}

// Create pokémon cards.
let crearCartas = (pokemones) => {
  let contenedorPokemones = document.getElementById("pokemon-container");

  pokemones.forEach((pokemon) => {
    // Create elements
    let card = document.createElement("div");
    let encabezado = document.createElement("p");
    let titulo = document.createElement("p");
    let imagen = document.createElement("img");
    let pie = document.createElement("p");

    // Add content & style
    encabezado.innerText = `#${pokemon.numero}`;

    titulo.innerText = pokemon.nombre;
    titulo.style.fontWeight = "bold";

    imagen.src = pokemon.urlImagen;

    pokemon.tipos.forEach(tipo => {
      const spanTag = document.createElement("span");

      spanTag.textContent = tipo.type.name.charAt(0).toUpperCase() + tipo.type.name.slice(1);
      spanTag.style.backgroundColor = colours[tipo.type.name];

      pie.appendChild(spanTag);
    });

    // Add elements
    card.append(encabezado, titulo, imagen, pie);
    card.setAttribute("class", "card");
    card.addEventListener('click', function () {
      openModal(pokemon);
    })

    contenedorPokemones.append(card);
  });
};

// Search for pokemons by name.
function filterCards() {
  // Get the search input value.
  const input = document.getElementById('searchPokemon').value.toLowerCase();

  // Get all the cards.
  const cards = document.getElementsByClassName('card');

  for (let card of cards) {
    const title = card.querySelectorAll('p')[1].textContent.toLowerCase();

    if (title.includes(input)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  }
}

// Search for movements by name.
function filterMovements() {
  // Get the search input value.
  const input = document.getElementById('searchMovement').value.toLowerCase();

  // Get all the movements.
  const movements = document.querySelectorAll('#modalMoves span');

  for (let move of movements) {
    const title = move.textContent.toLowerCase();

    if (title.includes(input)) {
      move.style.display = 'block';
    } else {
      move.style.display = 'none';
    }
  }
}

// Open the modal
function openModal(pokemon) {
  const modal = document.getElementById('modal');
  const modalHeader = document.getElementById('modalHeader');
  const modalTypes = document.getElementById('modalTypes');
  const modalImage = document.getElementById('modalImage');
  const modalDetails = document.getElementById('modalDetails');
  const modalMoves = document.getElementById('modalMoves');

  modal.style.display = 'block';

  const modalContent = document.querySelector('.modal-content');
  const width = modalContent.offsetWidth;
  modalContent.style.height = width * 3 / 5 + 'px'; // Set the height to half of the width

  modalHeader.firstChild.textContent = `#${pokemon.numero.toString().padStart(3, '0')}`;
  modalHeader.lastChild.textContent = pokemon.nombre;

  pokemon.tipos.forEach((tipo, index) => {
    if (index === 1) {
      modalTypes.appendChild(document.createElement('br'));
      modalTypes.appendChild(document.createElement('br'));
    }
    const spanTag = document.createElement("span");

    spanTag.textContent = tipo.type.name.charAt(0).toUpperCase() + tipo.type.name.slice(1);
    spanTag.style.backgroundColor = colours[tipo.type.name];

    modalTypes.appendChild(spanTag);
  });

  modalImage.src = pokemon.urlImagen;

  modalDetails.firstChild.textContent = `Height: ${pokemon.altura} m`;
  modalDetails.lastChild.textContent = `Weight: ${pokemon.peso} kg`;

  pokemon.movimientos.forEach(movimiento => {
    const spanTag = document.createElement("span");

    spanTag.textContent = movimiento.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    modalMoves.appendChild(spanTag);
  })
}

// Close the modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';

  // Clear the modal content
  modalHeader.firstChild.textContent = '';
  modalHeader.lastChild.textContent = '';
  modalTypes.textContent = '';
  modalImage.src = '';
  modalDetails.firstChild.textContent = '';
  modalDetails.lastChild.textContent = '';
  modalMoves.textContent = '';
}

// Close the modal when the user clicks the close button
const closeBtn = document.querySelector('.close');
closeBtn.addEventListener('click', closeModal);

window.addEventListener('resize', function () {
  const modalContent = document.querySelector('.modal-content');
  const width = modalContent.offsetWidth;
  modalContent.style.height = width * 3 / 5 + 'px'; // Set the height to half of the width
});

