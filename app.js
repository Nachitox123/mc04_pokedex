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

let allPokemons = [];

const obtenerPokemones = (limit) => {
  const arrayPokemones = [];
  const URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;
  axios
    .get(URL)
    .then((response) => {
      let infoPokemones = response.data.results;
      infoPokemones.forEach((pokemon) => {
        axios
          .get(pokemon.url)
          .then((infoPokemon) => {
            let infoPokemonIndividual = {
              numero: infoPokemon.data.id,
              nombre: infoPokemon.data.name,
              urlImagen: infoPokemon.data.sprites.front_default,
              tipos: infoPokemon.data.types,
              altura: infoPokemon.data.height,
              peso: infoPokemon.data.weight,
              movimientos: infoPokemon.data.moves,
            };

            arrayPokemones.push(infoPokemonIndividual);
          })
          .catch((error) => error);
      });
    })
    .catch((error) => console.log(error));

  //Ver como poder implementar el PromiseAll()

  setTimeout(() => {
    console.log(arrayPokemones);
    allPokemons = arrayPokemones;
    crearCards(allPokemons);
  }, 3000);
};

let crearCards = (pokemones) => {
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
    encabezado.style.margin = "0";

    titulo.innerText = pokemon.nombre.charAt(0).toUpperCase() + pokemon.nombre.slice(1);
    titulo.style.fontWeight = "bold";
    titulo.style.margin = "0";

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
    
    contenedorPokemones.append(card);
  });
};

// Search for pokemons by name.
function filterCards() {
  // Get the search input value.
  const input = document.getElementById('searchInput').value.toLowerCase();

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

// // Show more pokemon details.
// function showMore() {
//   const cards = document.getElementsByClassName('card');
//   for (let card of cards) {
//     card.style.display = 'block';
//   };
// }