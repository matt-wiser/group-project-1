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
    // console.log(searchData);
    submitRequest(searchData);
    if (localStorage.getItem("searchData") === null) {
        localStorage.setItem('searchData', JSON.stringify(searchData));
    } else {
       localStorage.removeItem("searchData"); 
       localStorage.setItem('searchData', JSON.stringify(searchData));
    }    
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
        
        if (localStorage.getItem("npsData") === null) {
            localStorage.setItem('npsData', JSON.stringify(response.data));
        } else {
           localStorage.removeItem("npsData"); 
           localStorage.setItem('npsData', JSON.stringify(response.data));
        }
    })
}

function latLongcalc(parkData) {
    var sunsetDate = "&date=today";
    
    for (let i = 0; i < parkData.length; i++) {
        var lat = parkData[i].latitude;
        var long = parkData[i].longitude;
        fetch("https://api.sunrise-sunset.org/json?lat=" + lat + "&lng=" + long + sunsetDate)
        .then(function(response){
            response = response.json();
            return response;
        }).then(function(response){
            // console.log(response);
        })                
    }
}







$('#submitaddress').click(getFormData);