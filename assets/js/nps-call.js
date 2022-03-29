var npsUrl = 'https://developer.nps.gov/api/v1/parks?api_key=Zn4OQSperFdVsW4h6jkMEi8SKODcfpVLsQ43wFqA'
$(document).foundation();

// This function pulls all the data from the input forms on the page, and checks to see if there is data in localstorage. 
// If there is no data in local storage it adds the search information to it, if there is data currently in localstorage it clears it and adds the newest search data.
function getFormData(){
    //This pulls the selected state value and adds it to a variable
    var selectedState = document.getElementById('state-select');
    selectedState = selectedState.value;

    //This pulls the street address value and adds it to a variable
    var streetAddress = document.getElementById('address');
    streetAddress = streetAddress.value;

    //This pulls the city value and adds it to a variable
    var city = document.getElementById('city');
    city = city.value;

    //This pulls the zip code value and adds it to a variable
    var zipCode = document.getElementById('zip');
    zipCode = zipCode.value;

    //This creates an object that contains all user furnished search information using the previously created variables
    var searchData = {
        selectedState: selectedState,
        streetAddress: streetAddress,
        city: city,
        zipCode: zipCode,
    }
    
    // This calls the submit request function to get park data for the selected state
    submitRequest(searchData);
    
    //This checks local storage and adds the search data, overwriting previous data if it exists
    if (localStorage.getItem("searchData") === null) {
        localStorage.setItem('searchData', JSON.stringify(searchData));
    } else {
       localStorage.removeItem("searchData"); 
       localStorage.setItem('searchData', JSON.stringify(searchData));
    }    
}


// This takes the search data object and creates a query string that the API can read.
// It is called in the submit request function
function constructQueryUrl(searchData){
    var queryUrl = npsUrl + '&stateCode=' + searchData.selectedState;
    return queryUrl;
}

// This submits the resuest for information from the NPS API using the user inputted search data
// It is called at the end of the getFormData function
function submitRequest(searchData){
    var queryUrl = constructQueryUrl(searchData);
    
    // This is the fetch request that uses the contructed URL from constructQueryUrl function to call the NPS API
    fetch(queryUrl)
    .then(function(response){
        // This receives the API response, turns it into a readable JSON format, and passes it to the next then() function
        response = response.json();
        return response;
    })
    .then(function(response){
        // This calls the updateView function, which is defined in update-view.js, and passes it the park data needed to construct the park cards on the results page
        updateView(response.data);
        console.log(response.data);
        
        //This checks local storage and adds the received park data, overwriting previous data if it exists
        if (localStorage.getItem("npsData") === null) {
            localStorage.setItem('npsData', JSON.stringify(response.data));
        } else {
           localStorage.removeItem("npsData"); 
           localStorage.setItem('npsData', JSON.stringify(response.data));
        }
    })
}

// This function listens for a click event on the submitaddress button and starts the data retreival and API call process when it occurs
$('#submitaddress').click(getFormData);