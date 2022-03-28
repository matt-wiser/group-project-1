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
// Instantiate a map and platform object:
var platform = new H.service.Platform({
    'apikey': 'aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok'
  });
  // Retrieve the target element for the map:
  var targetElement = document.getElementById('mapContainer');
  
  // Get the default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();
  
  // Instantiate the map:
  var map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
      zoom: 10,
      center: { lat: 52.51, lng: 13.4 }
    });
  
  // Create the parameters for the routing request:
  var routingParameters = {
    'routingMode': 'fast',
    'transportMode': 'car',
    // The start point of the route:
    'origin': '50.1120423728813,8.68340740740811',
    // The end point of the route:
    'destination': '52.5309916298853,13.3846220493377',
    // Include the route shape in the response
    'return': 'polyline'
  };
  
  // Define a callback function to process the routing response:
  var onResult = function(result) {
    // ensure that at least one route was found
    if (result.routes.length) {
      result.routes[0].sections.forEach((section) => {
           // Create a linestring to use as a point source for the route line
          let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
  
          // Create a polyline to display the route:
          let routeLine = new H.map.Polyline(linestring, {
            style: { strokeColor: 'blue', lineWidth: 3 }
          });
  
          // Create a marker for the start point:
          let startMarker = new H.map.Marker(section.departure.place.location);
  
          // Create a marker for the end point:
          let endMarker = new H.map.Marker(section.arrival.place.location);
  
          // Add the route polyline and the two markers to the map:
          map.addObjects([routeLine, startMarker, endMarker]);
  
          // Set the map's viewport to make the whole route visible:
          map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
      });
    }
  };
  
  // Get an instance of the routing service version 8:
  var router = platform.getRoutingService(null, 8);
  
  // Call calculateRoute() with the routing parameters,
  // the callback and an error callback function (called if a
  // communication error occurs):
  router.calculateRoute(routingParameters, onResult,
    function(error) {
      alert(error.message);
    });