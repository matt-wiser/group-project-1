var queryUrl = 'https://geocoder.ls.hereapi.com/search/6.2/geocode.json?languages=en-US&maxresults=4&searchtext=Sunnyvale&apiKey={YOUR_API_KEY}';

fetch(queryUrl)
.then(function(response){
    response = response.json();
    return response;
})
.then(function(response){
    updateView(response.data);
    console.log(response.data);
})