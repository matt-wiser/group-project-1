var hereUrl = "https://router.hereapi.com/v8routes?apiKey=";
var hereKey = "aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok";
// set global variables for use in sharing information later
var homeLat = "";
var homeLon = "";

function getLatLonAddress(searchData) {
    //find latitude and logitude from address information
    var hereLatLonUrl = `https://geocode.search.hereapi.com/v1/geocode?apiKey=${hereKey}&q=${searchData.streetAddress}+${searchData.city}+${searchData.zipCode}`;

    return fetch(hereLatLonUrl)
        .then(function (response) {
            if (response.ok) {  
              return response.json()
            } else {
                console.log("Error: Latitude/Longitude not found");
            }
        })
        .then(function (data) {
            homeLat = data.items[0].position.lat;
            homeLon = data.items[0].position.lng;
            var parkArray = localStorage.getItem("npsData");
            parkArray = JSON.parse(parkArray);
            
            // loop through park information given the home latlon to get route information
            for (let i = 0; i < parkArray.length; i++) {
              getSummaryInfo(parkArray[i].latitude, parkArray[i].longitude, parkArray[i].id);
            }
        })
}

// here we get summary information for the trip duration and length
function getSummaryInfo(lat, lon, id) {
  var hereCallSummary = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${homeLat},${homeLon}&destination=${lat},${lon}&return=summary&apikey=aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok`
  fetch(hereCallSummary)
  .then(function (response) {
    if (response.ok) {
      return response.json()
    } else {
      console.log("error: route not found");
    }
  })
  .then(function (data) {
    if (data.routes[0]) {
      let duration = data.routes[0].sections[0].summary.baseDuration/3600;
      duration = duration.toFixed(2);
      let distance = data.routes[0].sections[0].summary.length/1609.34;
      distance = distance.toFixed(2);
      console.log("Distance: " + distance + " miles", "Duration: " + duration + " hours");            

      let details = {
        id: id,
        distance : distance,
        duration : duration
      }

      if (localStorage.getItem(id) === null) {
        localStorage.setItem(id, JSON.stringify(details));
      } else {
       localStorage.removeItem(id); 
       localStorage.setItem(id, JSON.stringify(details));
      }    

    } else {
      let distance = "No Route Found";
      let duration = "No Route Found"
      
      let details = {
        id: id,
        distance : distance,
        duration : duration
      }

      console.log("Distance: " + distance, "Duration: " + duration);
      
      if (localStorage.getItem(id) === null) {
        localStorage.setItem(id, JSON.stringify(details));
      } else {
       localStorage.removeItem(id); 
       localStorage.setItem(id, JSON.stringify(details));
      }
    }
  })
}