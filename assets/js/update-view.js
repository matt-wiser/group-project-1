var activitiesArray = [];
var topicsArray = [];

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

function poplateTopics(array){
    array = [...new Set(array)];
    
    var topicContainerEl = document.getElementById("topics-field");

    for (let i = 0; i < array.length; i++) {
        var checkboxLabelEl = document.createElement("label");
        checkboxLabelEl.setAttribute("for", "checkbox-topic-" + i);
        checkboxLabelEl.textContent = array[i];

        var checkboxEl = document.createElement("input");
        checkboxEl.setAttribute("type", "checkbox");
        checkboxEl.setAttribute("id", "checkbox-topic-" + i);
        
        var breakEl = document.createElement("br");

        topicContainerEl.append(checkboxEl);
        topicContainerEl.append(checkboxLabelEl);
        topicContainerEl.append(breakEl);
        
    }
}

function populateActivities(array){
    array = [...new Set(array)];
    
    var activityContainerEl = document.getElementById("activities-field");

    for (let i = 0; i < array.length; i++) {
        var checkboxLabelEl = document.createElement("label");
        checkboxLabelEl.setAttribute("for", "checkbox-activity-" + i);
        checkboxLabelEl.textContent = array[i];

        var checkboxEl = document.createElement("input");
        checkboxEl.setAttribute("type", "checkbox");
        checkboxEl.setAttribute("id", "checkbox-activity-" + i);
        
        var breakEl = document.createElement("br");

        activityContainerEl.append(checkboxEl);
        activityContainerEl.append(checkboxLabelEl);
        activityContainerEl.append(breakEl);
    }
}

function createParkImage(parkData) {
    var parkImageEl = document.createElement('div');
    var backgroundImageUrl = "background-image: url('" + parkData.images[0].url + "')";
    parkImageEl.setAttribute("style", backgroundImageUrl);
    parkImageEl.setAttribute("class", "center-cropped");
    return parkImageEl;
}

function createCardTitle(parkData){
    var parkNameEl = document.createElement('h5');
    parkNameEl.textContent = parkData.fullName;
    var cardTitleEl = document.createElement('div');
    cardTitleEl.setAttribute("class", "card-divider");
    cardTitleEl.append(parkNameEl);
    return cardTitleEl;
}

function createParkDescription(parkData){
    var parkDescriptionEl = document.createElement('p');
    parkDescriptionEl.textContent = parkData.description;
    return parkDescriptionEl;
}

function creatOperatingHours(parkData) {
    var operatingHours = document.createElement("ul");
    operatingHours.setAttribute("class", "operating-hours");
    operatingHours.textContent = "Operating Hours ";
    var breakEl = document.createElement("br");
    operatingHours.append(breakEl);
    
    var mondayEl = document.createElement("li");
    mondayEl.textContent = "Monday: " + parkData.operatingHours[0].standardHours.monday;
    operatingHours.append(mondayEl);
    var tuesdayEl = document.createElement("li");
    tuesdayEl.textContent = "Tuesday: " + parkData.operatingHours[0].standardHours.tuesday;
    operatingHours.append(tuesdayEl);
    var wednesdayEl = document.createElement("li");
    wednesdayEl.textContent = "Wednesday: " + parkData.operatingHours[0].standardHours.wednesday;
    operatingHours.append(wednesdayEl);
    var thursdayEl = document.createElement("li");
    thursdayEl.textContent = "Thursday: " + parkData.operatingHours[0].standardHours.thursday;
    operatingHours.append(thursdayEl);
    var fridayEl = document.createElement("li");
    fridayEl.textContent = "Friday: " + parkData.operatingHours[0].standardHours.friday;
    operatingHours.append(fridayEl);
    var saturdayEl = document.createElement("li");
    saturdayEl.textContent = "Saturday: " + parkData.operatingHours[0].standardHours.saturday;
    operatingHours.append(saturdayEl);
    var sundayEl = document.createElement("li");
    sundayEl.textContent = "Sunday: " + parkData.operatingHours[0].standardHours.sunday;
    operatingHours.append(sundayEl);

    return operatingHours;
}

function createEntryCost(parkData){
    var entryCostEl = document.createElement("p");
    entryCostEl.setAttribute("class", "entry-cost");
    entryCostEl.textContent = "Entrance Cost: $" + parkData.entranceFees[0].cost;

    return entryCostEl;
}

function createParkUrl(parkData){
    var parkUrl = document.createElement("a");
    parkUrl.setAttribute("href", parkData.url);
    parkUrl.setAttribute("class", "park-link");
    parkUrl.textContent = "Official Website";

    return parkUrl;
}

function constructParkCards(parkData){
    var resultsEl = document.getElementById('results-container');
    
    for (let i = 0; i < parkData.length; i++) {
        var cardCellEl = document.createElement('div');
        cardCellEl.setAttribute("class", "cell");
        

        var cardEl = document.createElement('div');
        cardEl.setAttribute("class", "card");
        cardCellEl.append(cardEl);

        var cardContainerEl = document.createElement('div');
        cardContainerEl.setAttribute('class', 'card-container');

        var parkImageEl = createParkImage(parkData[i]);
        cardEl.append(parkImageEl);
        
        var cardTitleEl = createCardTitle(parkData[i]);
        cardContainerEl.append(cardTitleEl);

        var parkDescriptionEl = createParkDescription(parkData[i]);
        cardContainerEl.append(parkDescriptionEl);

        var operatingHoursEl = creatOperatingHours(parkData[i]);
        cardContainerEl.append(operatingHoursEl);

        var entryCostEl = createEntryCost(parkData[i]);
        cardContainerEl.setAttribute("data-entry-cost", parkData[i].entranceFees[0].cost);
        cardContainerEl.append(entryCostEl);

        var parkUrlEl = createParkUrl(parkData[i]);
        cardContainerEl.append(parkUrlEl);

        for (let x = 0; x < parkData[i].topics.length; x++) {            
            cardContainerEl.setAttribute("data-topic" + "-" + [x], parkData[i].topics[x].name);
            topicsArray.push(parkData[i].topics[x].name);
        }

        for (let y = 0; y < parkData[i].activities.length; y++) {            
            cardContainerEl.setAttribute("data-activity" + "-" + [y], parkData[i].activities[y].name);
            activitiesArray.push(parkData[i].activities[y].name);
        }
        cardEl.append(cardContainerEl);
        resultsEl.append(cardCellEl);
    }
    populateActivities(activitiesArray);
    poplateTopics(topicsArray);
}