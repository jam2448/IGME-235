// 1
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
// 2
let displayTerm = "";

// 3
function searchButtonClicked(){
    console.log("searchButtonClicked() called");

const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

//API key
let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

//building the URL string 
let url = GIPHY_URL;
url += "api_key=" + GIPHY_KEY;

//parse the user entered term we wish to search
let term = document.querySelector("#searchterm").value;
displayTerm = term;

//get rid of any leading and trailing spaces
term = term.trim();

//encode spaces and special characters 
term = encodeURIComponent(term);

//if there's no term to search then bail out of the function
if(term.length < 1) return;

//append the search term to the url - parameter name is q
url += "&q=" + term;

//grab the user chosen search "limit" from the select and append it to the url
let limit = document.querySelector("#limit").value;
url += "&limit=" + limit;

//update the UI
document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

//see what the URL looks like 
console.log(url);

// 12 Request data!
getData(url);

}

function getData(url){

    //create new XHR Request
    let xhr = new XMLHttpRequest();

    //set the on load handler 
    xhr.onload = dataLoaded;
    
    //set the on error handler 
    xhr.onerror = dataError;

    //open connection and send the request
    xhr.open("GET",url);
    xhr.send();

}

//Callback function 
function dataLoaded(e){

    //event.target is the xhr object
    let xhr = e.target;

    //xhr.responsetext is the JSON file
    console.log(xhr.responseText);

    //turn the text into a parseable JSON object
    let obj = JSON.parse(xhr.responseText);

    //if there are no objects, print a message and return 
    if(!obj.data || obj.data.length == 0){
        document.querySelector("#status").innerHTML = "<b> No reuslts found for '" + displayTerm + "'</b>";
        return;

    }

    //building an html string we will show to the user 
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "";

    //loop through the array of results 
    for(let i=0; i<results.length; i++){
        let result = results[i];

        //get the url to the gif 
        let smallURL = result.images.fixed_width.url;
        if(!smallURL) smallURL = "images/no-image-found.png";

        //get the URL to the gify page
        let url = result.url;

        //build a div to hold each result 
        let line = `<div class='result'>Rating: ${result.rating.toUpperCase()}<br><img src = '${smallURL}' title= '${result.id}'/>`;
        line += `<span><a target='_blank' href = '${url}'> View on Giphy</a></span></div>`;

        //add the div to bigstring and loop
        bigString += line;
    }

    //show html to user
    document.querySelector("#content").innerHTML = bigString;

    document.querySelector("#status").innerHTML = "<b>Success!</b> <p><i> Here are " + results.length + " results for  '" + displayTerm + "'</i></p>";



}

function dataError(e){
    console.log("An error has occured.");
}

