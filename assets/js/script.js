//var npsKey = config.npsKey;
//var queryUrl = config.queryUrl;
var npsURL = 'developer.nps.gov/api/v1'
var gMapsURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDqnsrJI6glSMm-yvEVcj5bOFO5zK-RsYo&callback=initMap&v=weekly"

// fetch(queryUrl)
// .then(function(response){
//     response = response.json();
//     return response;
// })
// .then(function(response){
//     console.log(response.data);
// })

fetch (gMapsURL)
.then(function(response) {
    response = response.json();
    return response;
})
.then(function(response) {
    console.log(response.data);
})
