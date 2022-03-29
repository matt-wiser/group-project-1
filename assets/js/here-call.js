var hereUrl = "https://router.hereapi.com/v8routes?apiKey=";
var hereKey = "aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok";
var homeLat = ""
var homeLon = ""


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
    getLatLonAddress(addData)
    .then(function(latLon){
      console.log('latLon: ', latLon);
      homeLat = latLon.homeLat;
      homeLon = latLon.homeLon;
      var parkArray = localStorage.getItem("npsData");
      parkArray = JSON.parse(parkArray);
      console.log('parkArray: ', parkArray);
      for (let i = 0; i < parkArray.length; i++) {
        getSummaryInfo(parkArray[i].latitude, parkArray[i].longitude);
        
      }
      
    })
}

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

function getSummaryInfo(lat, lon) {
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

  })

}


   
   $('#submitaddress').click(getAddData);

   
 