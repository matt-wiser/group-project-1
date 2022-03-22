fetch('http://api.sunrise-sunset.org/json')
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
    }).catch(function() {
        console.log("Booo")
    });