var hereUrl = "https://router.hereapi.com/v8routes?apiKey=";
var hereKey = "aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok";


function getAddData() {
    var homeStAdd = document.querySelector("#address").value.trim().replace(/ /g, "_");
    console.log('homeStAdd: ', homeStAdd);
    var homeCity = document.querySelector("#city").value.trim().replace(/ /g, "_");
    console.log('homeCity: ', homeCity);
    var homeZip = document.querySelector("#zip").value.trim().replace(/ /g, "_");
    console.log('homeZip: ', homeZip);

    var addData = {
        homeStAdd: homeStAdd,
        homeCity: homeCity,
        homeZip: homeZip,
    }
    console.log(addData);
    getLatLonAddress(addData);
}

function getLatLonAddress(addData) {

    console.log(addData);
    //find latitude and logitude from address information
    var hereLatLonUrl = `https://geocode.search.hereapi.com/v1/geocode?apiKey=${hereKey}&q=${addData.homeStAdd}+${addData.homeCity}+${addData.homeZip}`;
    console.log(hereLatLonUrl);
    fetch(hereLatLonUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                alert("Error: Latitude/Longitude not found");
            }
        })
        .then(function (data) {
            console.log('data: ', data);
            console.log({
                homeLat: data.items[0].position.lat,
                homeLon: data.items[0].position.lng
            })
            return {
                homeLat: data.items[0].position.lat,
                homeLon: data.items[0].position.lng,
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
        center: { lat: 36, lng: -86 }
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
   

//define a callback function to process the routing response:
var onResult = function (result) {
    //ensure that at least one route was found
    if (result.routes.length) {
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
            map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
        });
    }
};

//get instance of routing service 8
var router = platform.getRoutingService(null, 8);

//call calculateRoute() plus error call if communication error occurs
router.calculateRoute(routingParameters, onResult,
    function (error) {
        alert(error.message)
    });
 // Enable the event system on the map instance:
 var mapEvents = new H.mapevents.MapEvents(map);

 // Add event listeners:
 map.addEventListener('tap', function(evt) {
     // Log 'tap' and 'mouse' events:
     console.log(evt.type, evt.currentPointer.type);
 });
 // Instantiate the default behavior, providing the mapEvents object:
var behavior = new H.mapevents.Behavior(mapEvents);




$('#submitaddress').click(getAddData);
