var npsKey = config.npsKey;
var queryUrl = config.queryUrl;
var npsURL = 'developer.nps.gov/api/v1'

fetch(queryUrl)
.then(function(response){
    response = response.json();
    return response;
})
.then(function(response){
    console.log(response.data);
})