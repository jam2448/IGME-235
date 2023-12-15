//get the links to the generations and the pokemon
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0';
const pokemonArray = [];
console.log(apiUrl);

//delcaring some constants
const prefix = "jam2448-";
const nameKey = prefix + "name";
const typeKey = prefix + "type";
const colorKey = prefix + "color";

//grabbing some stored data
const storedName = localStorage.getItem(nameKey);
const storedColor = localStorage.getItem(colorKey);
const storedType = localStorage.getItem(typeKey);




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

    // Check if 'species' exists before accessing 'url'
    const speciesUrl = data.species && data.species.url;

    if (speciesUrl) {
      // Fetch species data
      const speciesData = await fetchPokemonDetails(speciesUrl);

      return {
        ...data,
        species: {
          ...speciesData,
          color: speciesData.color.name,
        },
      };
    } else {
      return data; // Return the original data if 'species' is undefined
    }
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

      //if details exist  then add search for data 
      // and add to the array
      if (pokemonDetails) {
        pokemonArray.push({
          name: pokemonDetails.name,
          types: pokemonDetails.types.map(type => type.type.name),
          abilities: pokemonDetails.abilities.map(ability => ability.ability.name),
          weight: pokemonDetails.weight,
          imageURL: pokemonDetails.sprites.front_default,
          color: pokemonDetails.species.color, // Include color information
        });
      }
    }

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
          //build div to hold each result
          let line = `<div class='result'>Name: ${pokemonArray[i].name} <br> <img src = '${pokemonArray[i].imageURL}' title= '${pokemonArray[i].name}'/>`;
          line += `<br> <p>Types: ${pokemonArray[i].types}</p><br> Weight: ${pokemonArray[i].weight}<br> Abilities: ${pokemonArray[i].abilities} <br> <p>Color: ${pokemonArray[i].color}</p> </div> `;
          
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
      line += `<br> <p>Types: ${pokemon.types}</p> <br> <p>Weight: ${pokemon.weight}</p> <br> <p>Abilities: ${pokemon.abilities}</p> <br> <p>Color: ${pokemon.color}</p></div> <br> </p>`;

      //update the content div
      displayData.innerHTML += line;
    });
  } 
}

// Function to filter Pokemon by color

function displayPokemonByColor(selectedColor) {
  let displayData = document.querySelector('#content');

  // Clear the content div before displaying new results
  displayData.innerHTML = '';

  // Filter Pokemon array based on the selected color
  const filteredPokemon = pokemonArray.filter(pokemon => pokemon.color === selectedColor);

  // Display the filtered Pokemon
  if (filteredPokemon.length > 0) {
    filteredPokemon.forEach(pokemon => {
      // Build the div for each result
      let line = `<div class='result'> <p>Name: ${pokemon.name}</p>  <br> <img src='${pokemon.imageURL}' title='${pokemon.name}'/>`;
      line += `<br> <p>Types: ${pokemon.types}</p> <br> <p>Weight: ${pokemon.weight}</p> <br> <p>Abilities: ${pokemon.abilities}</p> <br> <p>Color: ${pokemon.color}</p> </div> <br> </p>`;

      // Update the content div
      displayData.innerHTML += line;
    });
  } else {
    displayData.innerHTML = 'No Pokemon found with the selected color.';
  }
}


// Function to filter Pokemon by type and color
function displayColorAndType(selectedType, selectedColor) {
  let displayData = document.querySelector('#content');

  // Clear the content div before displaying new results
  displayData.innerHTML = '';

  // Filter Pokemon array based on the selected type and color
  const filteredPokemon = pokemonArray.filter(
    pokemon => pokemon.types.includes(selectedType) && pokemon.color === selectedColor
  );

  // Display the filtered Pokemon
  if (filteredPokemon.length > 0) {
    filteredPokemon.forEach(pokemon => {
      // Build the div for each result
      let line = `<div class='result'> <p>Name: ${pokemon.name}</p>  <br> <img src='${pokemon.imageURL}' title='${pokemon.name}'/>`;
      line += `<br> <p>Types: ${pokemon.types}</p> <br> <p>Weight: ${pokemon.weight}</p> <br> <p>Abilities: ${pokemon.abilities}</p> <br> <p>Color: ${pokemon.color}</p> </div> <br> </p>`;

      // Update the content div
      displayData.innerHTML += line;
    });
  } else {
    displayData.innerHTML = 'No Pokemon found with the selected type and color.';
  }
}

//ensuring that the whole DOM loads before doing anything
window.addEventListener("load", () => {


  //call the main function
  getPokemonData(); 

  // Get the selected type from the dropdown
  const selectedType = document.querySelector('#typeBar');

  // Focus on the search input field
  const searchedName = document.querySelector("#searchterm");

  //Get the selected color from the dropdown
  const selectedColor = document.querySelector("#colors");

  //call the function that finds the search pokemon when the button is clicked
  let button = document.querySelector("#searchButton");

  //if theres a stored name, put it in the search box
  if(storedName)
  {
    searchedName.value = storedName;
  }
 
  //if theres a stored type that was selected, select it
  if(storedType)
  {
    selectedType.querySelector(`option[value='${storedType}']`).selected = true;
  }
 
  //if theres a stored color that was selected, then select it on load
  if(storedColor)
  {
    selectedColor.querySelector(`option[value='${storedColor}']`).selected = true;
  }
  
  //things to do when a button is clicked
  button.addEventListener('click', function () {

    if(searchedName.value != "")
    {
      //if a name is entered into the searchbar, find name
      findName();
    }

    if(selectedType.value != "none")
    {
      //if the name of the bar is not none, find the type
      //and call the function
      displayPokemonByType(selectedType.value.toLowerCase());
      

    }

    if(selectedColor.value != "none")
    {
      //if there is something in the selection bar
      //call the fucntion
      displayPokemonByColor(selectedColor.value.toLowerCase());
    }

    if(selectedColor.value != "none" && selectedType.value != "none")
    {
      //if there is something in both color and type, filter both!
      displayColorAndType(selectedType.value.toLowerCase(), selectedColor.value.toLowerCase()); 
    }

    //anytime the button is clicked, update local Storage so that whatever
    //was used in the previous search is stored.
    localStorage.setItem(nameKey, searchedName.value);
    localStorage.setItem(typeKey, selectedType.value);
    localStorage.setItem(colorKey, selectedColor.value);
    
  });

});
