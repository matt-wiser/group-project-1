function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function updateView(npsData){
    var heroEl = document.getElementById('hero-section');
    heroEl.style.height = '15vh';
    heroEl.style.marginBottom = "20px";

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
        var cardTitleEl = document.createElement('div');
        cardTitleEl.setAttribute("class", "card-divider");
        cardTitleEl.append(parkNameEl);
        cardContainerEl.append(cardTitleEl);

        var parkDescriptionEl = document.createElement('p');
        parkDescriptionEl.textContent = parkData[i].description;
        cardContainerEl.append(parkDescriptionEl);

        var operatingHours = document.createElement("ul");
        operatingHours.setAttribute("class", "operating-hours");
        operatingHours.textContent = "Operating Hours ";
        var breakEl = document.createElement("br");
        operatingHours.append(breakEl);
        
        var mondayEl = document.createElement("li");
        mondayEl.textContent = "Monday: " + parkData[i].operatingHours[0].standardHours.monday;
        operatingHours.append(mondayEl);
        var tuesdayEl = document.createElement("li");
        tuesdayEl.textContent = "Tuesday: " + parkData[i].operatingHours[0].standardHours.tuesday;
        operatingHours.append(tuesdayEl);
        var wednesdayEl = document.createElement("li");
        wednesdayEl.textContent = "Wednesday: " + parkData[i].operatingHours[0].standardHours.wednesday;
        operatingHours.append(wednesdayEl);
        var thursdayEl = document.createElement("li");
        thursdayEl.textContent = "Thursday: " + parkData[i].operatingHours[0].standardHours.thursday;
        operatingHours.append(thursdayEl);
        var fridayEl = document.createElement("li");
        fridayEl.textContent = "Friday: " + parkData[i].operatingHours[0].standardHours.friday;
        operatingHours.append(fridayEl);
        var saturdayEl = document.createElement("li");
        saturdayEl.textContent = "Saturday: " + parkData[i].operatingHours[0].standardHours.saturday;
        operatingHours.append(saturdayEl);
        var sundayEl = document.createElement("li");
        sundayEl.textContent = "Sunday: " + parkData[i].operatingHours[0].standardHours.sunday;
        operatingHours.append(sundayEl);
        cardContainerEl.append(operatingHours);

        var entryCostEl = document.createElement("p");
        entryCostEl.setAttribute("class", "entry-cost");
        cardContainerEl.setAttribute("data-entry-cost", parkData[i].entranceFees[0].cost);
        entryCostEl.textContent = "Entrance Cost: $" + parkData[i].entranceFees[0].cost;
        cardContainerEl.append(entryCostEl);

        var parkUrl = document.createElement("a");
        parkUrl.setAttribute("href", parkData[i].url);
        parkUrl.setAttribute("class", "park-link");
        parkUrl.textContent = "Official Website";
        cardContainerEl.append(parkUrl);

        for (let x = 0; x < parkData[i].topics.length; x++) {            
            cardContainerEl.setAttribute("data-topic" + "-" + [x], parkData[i].topics[x].name);
        }

        for (let y = 0; y < parkData[i].activities.length; y++) {            
            cardContainerEl.setAttribute("data-activity" + "-" + [y], parkData[i].activities[y].name);
        }

        cardEl.append(cardContainerEl);
        resultsEl.append(cardCellEl);
    }
}