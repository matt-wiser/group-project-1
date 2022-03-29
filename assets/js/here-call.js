var hereUrl = "https://router.hereapi.com/v8routes?apiKey=";
var hereKey = "aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok";
// set global variables for use in sharing information later
var homeLat = ""
var homeLon = ""

//get address information from the user input
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
    //call the function to use latitude and longitude from addresses
    getLatLonAddress(addData)
    .then(function(latLon){
      console.log('latLon: ', latLon);
      homeLat = latLon.homeLat;
      homeLon = latLon.homeLon;
      var parkArray = localStorage.getItem("npsData");
      parkArray = JSON.parse(parkArray);
      console.log('parkArray: ', parkArray);
      // loop through park information given the home latlon to get route information
      for (let i = 0; i < parkArray.length; i++) {
        getSummaryInfo(parkArray[i].latitude, parkArray[i].longitude, parkArray[i].id);
        
      }
      
    })
}

// create a function to take user input of address to get latitude and linitude from address
function getLatLonAddress(addData) {

    console.log(addData);
    //find latitude and logitude from address information
    var hereLatLonUrl = `https://geocode.search.hereapi.com/v1/geocode?apiKey=${hereKey}&q=${addData.homeStAdd}+${addData.homeCity}+${addData.homeZip}`;
    console.log(hereLatLonUrl);
    return fetch(hereLatLonUrl)
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

// here we get summary information for the trip duration and length

function getSummaryInfo(lat, lon, id) {
  var hereCallSummary = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${homeLat},${homeLon}&destination=${lat},${lon}&return=summary&apikey=aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok`
  fetch(hereCallSummary)
  .then(function (response) {
    if (response.ok) {
      return response.json()
    } else {
      alert("error: route not found");
    }
  })
  .then(function (data) {
    console.log('data: ', data);
    let length = data[0].sections[0].baseDuration/360;
    length = length.toFixed(2);
    let time = data[0].sections[0].summary.length/1609.34;
    time = time.toFixed(2);
    //Option:1 using id for card in the update-viewer script, append length and duration of trip
     $(`#${id}`).append(`<h6>Duration: ${length} miles</h6><p>Time: ${duration} hours</p>`)
     //Option:2-- if choose, set the same summary information into local storage for use in cards describing parks
    //  let distanceTimeA= JSON.parse(localStorage.getItem("distanceTime"))|| []
  
    //  let details = {
    //    id: id,
    //    time : time,
    //    duration : duration
    //  }
    //  distanceTimeA.push(details)
    //  localStorage.setItem("distanceTime",JSON.stringify(distanceTimeA))
  })
 
}

   
   $('#submitaddress').click(getAddData);

   
 