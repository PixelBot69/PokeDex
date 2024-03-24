const pokemoncard = document.querySelector(".pokemon-card");
const pokemonsearch = document.querySelector("#searchpoke");
const pokemonidnotfound = document.querySelector("#not-found");
const button = document.querySelector(".load");

let allPokemons = [];
let getPokemon = 0; 

async function fetchAndDisplayPokemons(getPokemon) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${getPokemon === 0 ? 0 : getPokemon * 10}`);
    const data = await response.json();
    const newPokemons = data.results;
    allPokemons = [...allPokemons, ...newPokemons];
    displayPokemons(allPokemons);
  } catch (error) {
    console.error('Error fetching or displaying pokemons:', error);
  }
}

fetchAndDisplayPokemons(getPokemon); 

function displayPokemons(pokemon) {
  pokemoncard.innerHTML = "";

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const pokemonbas = document.createElement("div");
    pokemonbas.className = "list-item";
    pokemonbas.innerHTML = 
    `  
    <div class="row-cols-3">
      <div class="card " style="width: 8rem;" >  
          <img src="placeholder.jpg" data-src="https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokemonID}.svg" class="card-img-top lazyload" alt="${pokemon.name}">
          <div class="card-body">
              <h5 class="card-title">${pokemonID}</h5>
              <p class="card-text">${pokemon.name}</p>
          </div>
      </div>
    </div> 
    `;
    pokemoncard.appendChild(pokemonbas);
  });
  lazyLoadImages();
}

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('.lazyload');
  const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lazyImage = entry.target;
        lazyImage.src = lazyImage.dataset.src;
        lazyImageObserver.unobserve(lazyImage);
      }
    });
  });

  lazyImages.forEach(image => {
    lazyImageObserver.observe(image);
  });
}

pokemonsearch.addEventListener("keyup", Search);

function Search() {
  const searchTerm = pokemonsearch.value.toLowerCase();
  let filteredPokemons;
  if (searchTerm.length != 0) {
    filteredPokemons = allPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().startsWith(searchTerm)
    );
  } else {
    filteredPokemons = allPokemons;
  }

  displayPokemons(filteredPokemons);
  if (filteredPokemons.length === 0) {
    pokemonidnotfound.style.display = "block";
  } else {
    pokemonidnotfound.style.display = "none";
  }
}

button.addEventListener("click", () => {
  getPokemon += 1;
  fetchAndDisplayPokemons(getPokemon);
});


//"https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokemonID}.svg
