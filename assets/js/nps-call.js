var npsUrl = 'https://developer.nps.gov/api/v1/parks?api_key=Zn4OQSperFdVsW4h6jkMEi8SKODcfpVLsQ43wFqA'
 
function getFormData(){
    var selectedState = document.getElementById('stateSelect');
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
//     window.localStorage.setItem('recently viewed', JSON.stringify(searchData));
// 
    function createItem() {
        localStorage.setItem('recentlySearched', JSON.stringify(searchData.selectedState));
    
    }
    
    // createItem()

    // function getValue() {
    //     return localStorage.getItem('recentlySearched');
    // }
    // console.log(getValue());
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
// const stateSelect = document.getElementById("stateSelect");
// const lsDisplay = document.getElementById("lsDisplay");
// const submitAddress = document.getElementById("submitAddress");



function updateView(npsData){

}

$('#submitAddress').click(getFormData);
