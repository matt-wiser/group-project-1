var npsKey = 'Zn4OQSperFdVsW4h6jkMEi8SKODcfpVLsQ43wFqA';
var queryUrl = 'https://developer.nps.gov/api/v1/parks?stateCode=TN&api_key=Zn4OQSperFdVsW4h6jkMEi8SKODcfpVLsQ43wFqA';
var npsURL = 'developer.nps.gov/api/v1'



fetch(queryUrl)
.then(function(response){
    response = response.json();
    return response;
})
.then(function(response){
    console.log(response.data);
})