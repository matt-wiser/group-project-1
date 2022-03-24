var npsUrl = 'https://developer.nps.gov/api/v1/parks?api_key=Zn4OQSperFdVsW4h6jkMEi8SKODcfpVLsQ43wFqA'

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
        console.log(response.data);
    })
}

function updateView(npsData){

}

$('#submitaddress').click(getFormData);