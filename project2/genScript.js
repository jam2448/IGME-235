
const url = "https://pokeapi.co/api/v2/";

// Function to fetch Pokémon data for a given generation
async function fetchPokemonsInGeneration(generationId) {
  const response = await fetch(`${url}generation/${generationId}/`);
  const data = await response.json();
  const pokemonUrls = data.pokemon_species.map(pokemon => pokemon.url);
  const pokemonData = await Promise.all(pokemonUrls.map(url => fetch(url).then(response => response.json())));
  return pokemonData;
}

// Function to fetch all Pokémon in each generation
async function fetchAllPokemons() {
  try {
    // Fetch information about all generations
    const generationsResponse = await fetch(`${url}generation/`);
    const generationsData = await generationsResponse.json();
    
    // Iterate over each generation and fetch Pokémon data
    for (const generation of generationsData.results) {
      const generationId = generation.url.split("/").filter(Boolean).pop();
      const pokemonData = await fetchPokemonsInGeneration(generationId);

      // Output the Pokémon data for the current generation
      console.log(`Generation ${generationId}:`, pokemonData.map(pokemon => pokemon.name));
    }
  } catch (error) {
    console.error("Error fetching Pokémon data:", error);
  }
}


function DisplayByGeneration(selectedGen)
{
    let displayData = document.querySelector('#content');

  // Clear the content div before displaying new results
  displayData.innerHTML = '';

  // Filter Pokemon array based on the selected type
  const filteredPokemon = pokemonArray.filter(pokemon => pokemon.types.includes(selectedType));

  // Display the filtered Pokemon
  if (filteredPokemon.length > 0) {
    filteredPokemon.forEach(pokemon => {

      //build the div for each result
      let line = `<div class='result'> <p>Name: ${pokemon.name}</p>  <br> <img src='${pokemon.imageURL}' title='${pokemon.name}'/>`;
      line += `<br> </p>Types: ${pokemon.types}</p> <br> <p>Weight: ${pokemon.weight}</p> <br> <p>Abilities: ${pokemon.abilities}</p> </div> <br> </p>`;

      //update the content div
      displayData.innerHTML += line;
    });
  } 

}
