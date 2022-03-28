function updateView(npsData){
    var heroEl = document.getElementById('hero-section');
    heroEl.style.height = '15vh';

    var subheads = document.getElementsByClassName('subhead');
    while (subheads[0]) {
        subheads[0].parentNode.removeChild(subheads[0])
    }
    
    var mainContentEl = document.getElementById('content-container');
    removeAllChildNodes(mainContentEl);
    
    var filtersEl = document.getElementById('filters-results');
    filtersEl.classList.remove('hide');

    constructParkCards(npsData);
}

function constructParkCards(parkData){
    var resultsEl = document.getElementById('results-container');
    
    for (let i = 0; i < parkData.length; i++) {
        var cardCellEl = document.createElement('div');
        cardCellEl.setAttribute("class", "cell");
        

        var cardEl = document.createElement('div');
        cardEl.setAttribute("class", "card");
        cardCellEl.append(cardEl);

        var parkImageEl = document.createElement('div');
        var backgroundImageUrl = "background-image: url('" + parkData[i].images[0].url + "')";
        parkImageEl.setAttribute("style", backgroundImageUrl);
        parkImageEl.setAttribute("class", "center-cropped");
        cardEl.append(parkImageEl);

        var cardContainerEl = document.createElement('div');
        cardContainerEl.setAttribute('class', 'card-container');
        
        var parkNameEl = document.createElement('h5');
        parkNameEl.textContent = parkData[i].fullName;
        cardContainerEl.append(parkNameEl);

        var parkDescriptionEl = document.createElement('p');
        parkDescriptionEl.textContent = parkData[i].description;
        cardContainerEl.append(parkDescriptionEl);

        cardEl.append(cardContainerEl);

        resultsEl.append(cardCellEl);
    }
}