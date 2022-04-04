var npsUrl = 'https://developer.nps.gov/api/v1/parks?api_key=Zn4OQSperFdVsW4h6jkMEi8SKODcfpVLsQ43wFqA'
$(document).foundation();

// This function pulls all the data from the input forms on the page, and checks to see if there is data in localstorage. 
// If there is no data in local storage it adds the search information to it, if there is data currently in localstorage it clears it and adds the newest search data.
function getFormData(){
    //This pulls the selected state value and adds it to a variable
    var selectedState = document.getElementById('state-select');
    var selectedStateValue = selectedState.value;

    //This pulls the street address value and adds it to a variable
    var streetAddress = document.getElementById('address');
    var streetAddressValue = streetAddress.value.trim().replace(/ /g, "_");

    //This pulls the city value and adds it to a variable
    var city = document.getElementById('city');
    var cityValue = city.value.trim().replace(/ /g, "_");

    //This pulls the zip code value and adds it to a variable
    var zipCode = document.getElementById('zip');
    var zipCodeValue = zipCode.value.trim().replace(/ /g, "_");

    //This creates an object that contains all user furnished search information using the previously created variables
    var searchData = {
        selectedStateValue,
        streetAddressValue,
        cityValue,
        zipCodeValue,
    }
    
    // This calls the submit request function to get park data for the selected state
    
    // submitRequest(searchData);
    return searchData;
}

async function main() {
    var formData = getFormData();

    const response = await fetch(`${npsUrl}&stateCode=${formData.selectedStateValue}`)
    const {data: npsData} = await response.json();

    updateView(npsData);
        
    var homeLatLng = await getLatLonAddress(formData);
    var summaryPromiseArray = [];

    npsData.forEach(park => {
        const summary = getSummaryInfo(homeLatLng.lat, homeLatLng.lng, park.latitude, park.longitude, park.id)
        summaryPromiseArray.push(summary);
    });
    const summaryDataArray = await Promise.all(summaryPromiseArray);
    
    for (const summary of summaryDataArray) {
        localStorage.setItem(`${summary.id}`, JSON.stringify(summary));
    }

    addTravelInfo(npsData);
}

// This function listens for a click event on the submitaddress button and starts the data retreival and API call process when it occurs
$('#submitaddress').click(main);