//get the links to the generations and the pokemon
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';
const pokemonArray = [];
console.log(apiUrl);

// Function to fetch Pokemon data
async function fetchPokemonData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
  }
}


// Function to fetch additional details for each Pokemon
async function fetchPokemonDetails(pokemonUrl) {
  try {
    const response = await fetch(pokemonUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon details:', error);
  }
}

// Main function to get Pokemon data, log details, and store in array
async function getPokemonData() {
  const pokemonData = await fetchPokemonData(apiUrl);

  //if the pokemon data exists then loop through each result 
  //and get some details
  if (pokemonData && pokemonData.results) {
    for (const pokemon of pokemonData.results) {
      const pokemonDetails = await fetchPokemonDetails(pokemon.url);

      //if details exist  then add ssearch for data 
      // and add to the array
      if (pokemonDetails) {
        //logPokemonDetails(pokemonDetails);
        //make an object literal of the name, types, moves and weight
        //and push it to an array 
        pokemonArray.push({
          name: pokemonDetails.name,
          types: pokemonDetails.types.map(type => type.type.name),
          abilities: pokemonDetails.abilities.map(ability => ability.ability.name),
          weight: pokemonDetails.weight,
          imageURL : pokemonDetails.sprites.front_default,
        });
      }
    }

    // Log the array of Pokemon data
    console.log('Pokemon Array:', pokemonArray);
  }
}


function findName()
{
    //access the query selector
    let displayData = document.querySelector('#content');
    
    //getting access to the term that is being typed in the search bar
    let searchedName = document.querySelector('#searchterm').value.trim().toLowerCase();

    //let typeFiler = document.querySelector("#typeBar").value.toLowerCase();

    //clear the content div
    displayData.innerHTML = " ";

    let foundPokemon = false;

    //if the searched term the name in the array, then grab the data and
    //put in the results
    for(let i=0; i<pokemonArray.length; i++)
    {
      //looping through the array and finding the pokemon by name when it is typed into the search bar
        if(pokemonArray[i].name == searchedName)
        {
          //printing the pokemon attributes in the console
          console.log(pokemonArray[i]);

          //build div to hold each result
          let line = `<div class='result'>Name: ${pokemonArray[i].name} <br> <img src = '${pokemonArray[i].imageURL}' title= '${pokemonArray[i].name}'/>`;
          line += `<br>Types: ${pokemonArray[i].types}<br> Weight: ${pokemonArray[i].weight}<br> Abilities: ${pokemonArray[i].abilities} </div>`;
          
          //make this div in the innerHTML of the content tag
          displayData.innerHTML = line;
          foundPokemon = true;

          //exit the loop
          break;
        }

  }
  //fall case in case someone has typed in the wrong name into the searchbar
  //prints an error
  if(!foundPokemon)
  {
    let error = `Cannot find the pokemon ${searchedName.value}. Please try searching again.`;
    displayData.innerHTML = error;
  }
}

//function that gets and displays all the types of the pokemon with that
//specific type selected from the dropdown menu
function displayPokemonByType(selectedType) {
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


//ensuring that the whole DOM loads before doing anything
window.addEventListener("load", () => {

  //call the main function
  getPokemonData(); 
  fetchAllPokemons();


  //call the function that finds the search pokemon when the button is clicked
  let button = document.querySelector("#searchButton");

  button.addEventListener('click', function () {
    // Get the selected type from the dropdown
    const selectedType = document.querySelector('#typeBar').value.toLowerCase();

    // Focus on the search input field
    const searchedName = document.querySelector("#searchterm").focus();

    if(searchedName != " ")
    {
      //if a name is entered into the searchbar, find name
      findName();
    }

    if(selectedType != "none")
    {
      //if the name of the bar is not none, find the type
      //and call the function
      displayPokemonByType(selectedType);
    }

    if(selectedType != "none")
    {
      //if the name of the selector is not none, find the generation
      //and call the function to display generations
      DisplayByGeneration();
    }

  });

});
