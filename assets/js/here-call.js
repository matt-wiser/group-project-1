var hereUrl = "https://router.hereapi.com/v8routes?apiKey=";
var hereKey = "aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok";

async function getLatLonAddress(searchData) {
  //find latitude and logitude from address information
  var hereLatLonUrl = `https://geocode.search.hereapi.com/v1/geocode?apiKey=${hereKey}&q=${searchData.streetAddressValue}+${searchData.cityValue}+${searchData.zipCodeValue}`;

  const response = await fetch(hereLatLonUrl);
  const data = await response.json();
  return data.items[0].position;
}

async function getSummaryInfo(homeLat, homeLon, lat, lon, id) {
  try {
    var hereCallSummaryUrl = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${homeLat},${homeLon}&destination=${lat},${lon}&return=summary&apikey=aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok`
    const response = await fetch(hereCallSummaryUrl);
    const data = await response.json();
    
    if (data.routes[0]) {
      let duration = (data.routes[0].sections[0].summary.baseDuration/3600).toFixed(2);
      let distance = (data.routes[0].sections[0].summary.length/1609.34).toFixed(2); 
  
      return {
        id: id,
        distance : distance,
        duration : duration
      }
    } else {
      let distance = "No Route Found";
      let duration = "No Route Found"
      
      return {
        id: id,
        distance : distance,
        duration : duration
      }
    }
  } catch (error) {
    console.log("An error has occured during getSummaryInfo!");
  }

}