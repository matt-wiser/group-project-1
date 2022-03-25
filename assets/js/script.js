var npsKey = config.npsKey;
var queryUrl = config.queryUrl;
var npsURL = 'developer.nps.gov/api/v1';
var hereUrl = "https://router.hereapi.com/v8routes?apiKey=";
var hereKey = "aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok";
var homeStAdd = document.getElementById(address).ATTRIBUTE_NODE;
var homeCity = document.getElementById(city);
var homeZip = document.getElementById(zip)


fetch(queryUrl)
.then(function(response){
    response = response.json();
    return response;
})
.then(function(response){
    console.log(response.data);
})


function getLatLonAddress() {
    //find latitude and logitude from address information
    var hereLatLonUrl = "https://geocode.search.hereapi.com/v1/geocode?apiKey=" + hereKey + "=" + homeStAdd.trim + "+" + city + "+" + zip";
    fetch (hereLatLonUrl)
    .then(function (response) {
        if (response.ok) {
            return response.json()
        }else {
            alert("Error: Latitude/Longitude not found");
        }
    })
    .then(function(data){
        console.log('data: ', data);
        return {
            homeLat: items.position.lat,
            homeLon: items.position.lng
        }

    })
}
//plug into HERE's back-end data
var platform = new H.service.Platform({
    'apiKey': "aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok"
});

//choose div to place map
var targetElement = document.getElementById("mapContainer");

//create default map type
var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(
    document.getElementById("mapContainer"),
    defaultLayers.vector.normal.map,
    {
        zoom: 10,
        center: { lat: 36, lng: -86}
    });
    var routingParameters = {
        'routingMode': 'fast',
        'transportMode': 'car',
        //set start point of route
        'origin': "35.89063,-86.39635",
        // The end point of the route
        'destination': "36.31837,-86.63381",
        'return': 'polyline'
    };

    //define a callback fundtion to process the routing response:
    var onResult = function(result) {
        //ensure that at least one route was found
        if(result.routes.length) {
            result.routes[0].sections.forEach((section) => {
                //create a linestring to use as a point source for the route line
                let lineString = H.geo.LineString.fromFlexiblePolyline(section.polyline);

                //create a polyline to display the route:
                let routeLine = new H.map.Polyline(lineString, {
                    style: { strokeColo: 'blue', lineWidth: 3 }
                });
                //create a marker for the start pint:
                let startMarker = new H.map.Marker(section.departure.place.location);

                //create an end marker for the end point:
                let endMarker = new H.map.Marker(section.arrival.place.location);

                //add the route polyline and the two markers to the map:
                map.addObjects([routeLine, startMarker, endMarker]);

                //set the map's viewport to make the whole route visible:
                map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
            });
        }
    };

    //get instance of routing service 8
    var router = platform.getRoutingService(null, 8);

    //call calculateRoute() plus error call if communication error occurs
    router.calculateRoute(routingParameters, onResult,
        function(error) {
            alert(error.message)
        }); 
// var npsUrl = 'https://developer.nps.gov/api/v1/parks?api_key=Zn4OQSperFdVsW4h6jkMEi8SKODcfpVLsQ43wFqA'

// function getFormData(){
//     var selectedState = document.getElementById('state-select');
//     selectedState = selectedState.value;

//     var streetAddress = document.getElementById('address');
//     streetAddress = streetAddress.value;

//     var city = document.getElementById('city');
//     city = city.value;

//     var zipCode = document.getElementById('zip');
//     zipCode = zipCode.value;

//     var searchData = {
//         selectedState: selectedState,
//         streetAddress: streetAddress,
//         city: city,
//         zipCode: zipCode,
//     }
//     console.log(searchData);
//     submitRequest(searchData);
// }

// function constructQueryUrl(searchData){
//     var queryUrl = npsUrl + '&stateCode=' + searchData.selectedState;
//     return queryUrl;
// }

// function submitRequest(searchData){
//     var queryUrl = constructQueryUrl(searchData);
    
//     fetch(queryUrl)
//     .then(function(response){
//         response = response.json();
//         return response;
//     })
//     .then(function(response){
//         updateView(response.data);
//         latLongcalc(response.data);
//         console.log(response.data);
//     })
// }
// function latLongcalc(parkData) {
//     var lat = parkData[0].latitude;
//     var long = parkData[0].longitude;
//     fetch("https://api.sunrise-sunset.org/json?lat=" + lat + "&lng=" + long)
//     .then(function(response){
//         response = response.json();
//         return response;
//     }).then(function(response){
//         console.log(response);
//     })
// }

// function updateView(npsData){

// }

// $('#submitaddress').click(getFormData);
