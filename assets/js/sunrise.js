fetch('https://api.sunrise-sunset.org/json.', {
    mode: 'no-cors'
    }).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
    }).catch(function() {
        console.log("Booo")
    });