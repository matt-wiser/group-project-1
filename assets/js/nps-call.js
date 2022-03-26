var npsUrl = 'https://developer.nps.gov/api/v1/parks?api_key=Zn4OQSperFdVsW4h6jkMEi8SKODcfpVLsQ43wFqA'
$(document).foundation();

function getFormData(){
    var selectedState = document.getElementById('state-select');
    selectedState = selectedState.value;

    var streetAddress = document.getElementById('address');
    streetAddress = streetAddress.value;

    var city = document.getElementById('city');
    city = city.value;

    var zipCode = document.getElementById('zip');
    zipCode = zipCode.value;

    var searchData = {
        selectedState: selectedState,
        streetAddress: streetAddress,
        city: city,
        zipCode: zipCode,
    }
    console.log(searchData);
    submitRequest(searchData);
}

function constructQueryUrl(searchData){
    var queryUrl = npsUrl + '&stateCode=' + searchData.selectedState;
    return queryUrl;
}

function submitRequest(searchData){
    var queryUrl = constructQueryUrl(searchData);
    
    fetch(queryUrl)
    .then(function(response){
        response = response.json();
        return response;
    })
    .then(function(response){
        updateView(response.data);
        latLongcalc(response.data);
        console.log(response.data);
    })
}


function updateView(npsData){
    var heroEl = document.getElementById('hero-section');
    heroEl.style.height = '15vh';

    var subheads = document.getElementsByClassName('subhead');
    while (subheads[0]) {
        subheads[0].parentNode.removeChild(subheads[0])
    }
    
    var mainContentEl = document.getElementById('content-container');
    removeAllChildNodes(mainContentEl);
    
    var filtersEl = document.getElementById('filters-results');
    filtersEl.classList.remove('hide');

    constructParkCards(npsData);
}

function constructParkCards(parkData){
    var resultsEl = document.getElementById('results-container');
    
    for (let i = 0; i < parkData.length; i++) {
        var cardContainerEl = document.createElement('div');
        cardContainerEl.setAttribute("class", "cell small-12 large-4");
        

        var cardEl = document.createElement('div');
        cardEl.setAttribute("class", "card");
        cardContainerEl.append(cardEl);

        var parkImageEl = document.createElement('img');
        parkImageEl.setAttribute('src', parkData[i].images[0].url);
        parkImageEl.setAttribute('alt', parkData[i].images[0].altText);
        
        cardEl.append(parkImageEl);

        resultsEl.append(cardEl);
    }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function latLongcalc(parkData) {
    var lat = parkData[0].latitude;
    var long = parkData[0].longitude;
    fetch("https://api.sunrise-sunset.org/json?lat=" + lat + "&lng=" + long)
    .then(function(response){
        response = response.json();
        return response;
    }).then(function(response){
        console.log(response);
    })
}

$('#submitaddress').click(getFormData);