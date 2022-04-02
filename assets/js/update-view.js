// These are globally defined arrays that will be needed later for populating the filter criteria and sorting
// activitiesArray is filled in the populateActivities functions which are called in the constructParkCards function after all data has been gathered and written to the page
// cardCellArray is filled
var activitiesArray = [];
var cardCellArray = [];


// This is a utility function that removes all child nodes/elements from a chosen element
//It is called during update view on the content-container element to clear out the main content and make room for the cards
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// This is the function that initiates page reconstruction, it modifies some styles on the page, and initiates the card construction process
// It is initially called within the nps-call.js file once all park data has been received, and the user search parameters and park information have been written local storage
function updateView(npsData){

    // This modifies the hero section style, making it shorter and adding margin to its bottom
    var heroEl = document.getElementById('hero-section');
    heroEl.style.height = '15vh';
    heroEl.style.marginBottom = "20px";

    // This removes all secondary content from the hero section, leaving only the main link
    var subheads = document.getElementsByClassName('subhead');
    while (subheads[0]) {
        subheads[0].parentNode.removeChild(subheads[0])
    }
    
    // This selects the main content area and removes the user input fields and other content, making room for the cards
    var mainContentEl = document.getElementById('content-container');
    removeAllChildNodes(mainContentEl);
    
    // This selects the filers panel and removes the hidden class from it, making the filters dropdown visible to the user
    var filtersEl = document.getElementById('filters-results');
    filtersEl.classList.remove('hide');

    // This calls the constructParkCards function and passes it the NPS API data, this data is used to add information to the cards which are then appended to the page
    constructParkCards(npsData);
}



function addTravelInfo(parkData){
    console.log(parkData);
    for (let i = 0; i < parkData.length; i++) {        
            
        var travelInfo = localStorage.getItem(parkData[i].id);
        travelInfo = JSON.parse(travelInfo);

        if (travelInfo === null) {
            // setTimeout(function(){
                var travelInfo = localStorage.getItem(parkData[i].id);
                travelInfo = JSON.parse(travelInfo);
                var travelTimeEl = document.createElement("p");
                travelTimeEl.setAttribute("class", "distance-time-info");
                travelTimeEl.textContent = "Estimated Travel Time: " + travelInfo.duration + " Hours";
        
                var travelDistanceEl = document.createElement("p");
                travelDistanceEl.setAttribute("class", "distance-time-info");
                travelDistanceEl.textContent = "Distance from Home: " + travelInfo.distance + " Miles";
        
                $(`#${travelInfo.id}`).append(travelTimeEl);
                $(`#${travelInfo.id}`).append(travelDistanceEl);
            // }, 3200)
        } else {
            var travelTimeEl = document.createElement("p");
            travelTimeEl.setAttribute("class", "distance-time-info");
            travelTimeEl.textContent = "Estimated Travel Time: " + travelInfo.duration + " Hours";

            var travelDistanceEl = document.createElement("p");
            travelDistanceEl.setAttribute("class", "distance-time-info");
            travelDistanceEl.textContent = "Distance from Home: " + travelInfo.distance + " Miles";

            $(`#${travelInfo.id}`).append(travelTimeEl);
            $(`#${travelInfo.id}`).append(travelDistanceEl);
        }
    }
}

// This function populates the activities area within the filters panel, it is called in constructParkCards once all data has been collected
function populateActivities(array){
    // This filters out all duplicated activities that occur within the activites array
    array = [...new Set(array)];
    
    // This selects the activities container so that individual entries can be appended
    var activityContainerEl = document.getElementById("activities-field");

    // This loops through the filtered activities array, constructing checkboxes, labels and a break element before appending them to the page
    for (let i = 0; i < array.length; i++) {
        var checkboxLabelEl = document.createElement("label");
        checkboxLabelEl.setAttribute("for", "checkbox-activity-" + i);
        checkboxLabelEl.textContent = array[i];

        var checkboxEl = document.createElement("input");
        checkboxEl.setAttribute("type", "checkbox");
        checkboxEl.setAttribute("class", "checkbox");
        checkboxEl.setAttribute("id", "checkbox-activity-" + i);
        checkboxEl.setAttribute("value", array[i]);
        
        var breakEl = document.createElement("br");

        activityContainerEl.append(checkboxEl);
        activityContainerEl.append(checkboxLabelEl);
        activityContainerEl.append(breakEl);
    }
}

// This function creates the image for an indivudal park card, it is called in constructParkCard for each park within the array. It returns a fully constructed image element
function createParkImage(parkData) {
    var parkImageEl = document.createElement('div');
    var backgroundImageUrl = "background-image: url('" + parkData.images[0].url + "')";
    parkImageEl.setAttribute("style", backgroundImageUrl);
    parkImageEl.setAttribute("class", "center-cropped");
    return parkImageEl;
}

// This function creates the title for an indivudal park card, it is called in constructParkCard for each park within the array. It returns a fully constructed title element
function createCardTitle(parkData){
    var parkNameEl = document.createElement('h5');
    parkNameEl.textContent = parkData.fullName;
    var cardTitleEl = document.createElement('div');
    cardTitleEl.setAttribute("class", "card-divider");
    cardTitleEl.append(parkNameEl);
    return cardTitleEl;
}

// This function creates the description for an indivudal park card, it is called in constructParkCard for each park within the array. It returns a fully constructed description element
function createParkDescription(parkData){
    var parkDescriptionEl = document.createElement('p');
    parkDescriptionEl.textContent = parkData.description;
    return parkDescriptionEl;
}

// This function creates the operating hours for an indivudal park card, it is called in constructParkCard for each park within the array. It returns a fully constructed operating element
function createOperatingHours(parkData) {
    
    if (parkData.operatingHours[0]) {
        var operatingHours = document.createElement("ul");
        operatingHours.setAttribute("class", "operating-hours");
        operatingHours.textContent = "Operating Hours ";
        var breakEl = document.createElement("br");
        operatingHours.append(breakEl);
        
        var mondayEl = document.createElement("li");
        var mondaySpan = document.createElement("span");
        mondaySpan.setAttribute("class", "day-span");
        mondaySpan.textContent = "Monday: "
        mondayEl.append(mondaySpan);
        mondayEl.append(parkData.operatingHours[0].standardHours.monday);
        operatingHours.append(mondayEl);

        var tuesdayEl = document.createElement("li");
        var tuesdaySpan = document.createElement("span");
        tuesdaySpan.setAttribute("class", "day-span");
        tuesdaySpan.textContent = "Tuesday: "
        tuesdayEl.append(tuesdaySpan);
        tuesdayEl.append(parkData.operatingHours[0].standardHours.tuesday);
        operatingHours.append(tuesdayEl);

        var wednesdayEl = document.createElement("li");
        var wednesdaySpan = document.createElement("span");
        wednesdaySpan.setAttribute("class", "day-span");
        wednesdaySpan.textContent = "Wednesday: "
        wednesdayEl.append(wednesdaySpan);
        wednesdayEl.append(parkData.operatingHours[0].standardHours.wednesday);
        operatingHours.append(wednesdayEl);

        var thursdayEl = document.createElement("li");
        var thursdaySpan = document.createElement("span");
        thursdaySpan.setAttribute("class", "day-span");
        thursdaySpan.textContent = "Thursday: "
        thursdayEl.append(thursdaySpan);
        thursdayEl.append(parkData.operatingHours[0].standardHours.thursday);
        operatingHours.append(thursdayEl);

        var fridayEl = document.createElement("li");
        var fridaySpan = document.createElement("span");
        fridaySpan.setAttribute("class", "day-span");
        fridaySpan.textContent = "Friday: "
        fridayEl.append(fridaySpan);
        fridayEl.append(parkData.operatingHours[0].standardHours.friday);
        operatingHours.append(fridayEl);

        var saturdayEl = document.createElement("li");
        var saturdaySpan = document.createElement("span");
        saturdaySpan.setAttribute("class", "day-span");
        saturdaySpan.textContent = "Saturday: "
        saturdayEl.append(saturdaySpan);
        saturdayEl.append(parkData.operatingHours[0].standardHours.saturday);
        operatingHours.append(saturdayEl);

        var sundayEl = document.createElement("li");
        var sundaySpan = document.createElement("span");
        sundaySpan.setAttribute("class", "day-span");
        sundaySpan.textContent = "Sunday: "
        sundayEl.append(sundaySpan);
        sundayEl.append(parkData.operatingHours[0].standardHours.sunday);
        operatingHours.append(sundayEl);
    
        return operatingHours;
    } else {
        var operatingHours = document.createElement("p")
        operatingHours.textContent = "No operating hours available";

        return operatingHours;
    }
    

}

// This function creates the entry cost for an indivudal park card, it is called in constructParkCard for each park within the array. It returns a fully constructed entry cost element
function createEntryCost(parkData){
    var entryCostEl = document.createElement("p");
    entryCostEl.setAttribute("class", "entry-cost");
    
    if (parkData.entranceFees[0]) {
        entryCostEl.textContent = "Entrance Cost: $" + parkData.entranceFees[0].cost;
    } else {
        entryCostEl.textContent = "Entrance Cost: $0.00"
    }
    

    return entryCostEl;
}

// This function creates the link for an indivudal park card, it is called in constructParkCard for each park within the array. It returns a fully constructed link element
function createParkUrl(parkData){
    var parkUrl = document.createElement("a");
    parkUrl.setAttribute("href", parkData.url);
    parkUrl.setAttribute("class", "park-link");
    parkUrl.textContent = "Official Website";

    return parkUrl;
}

// This function constructs all the park cards. It creates a card cell element needed for the Foundation framework, a card element whose style is defined by Foundation, and a card-container element which is a neccessary part of a card element in Foundation
// It then loops through the array of provided parks, calling each individual element constructor defined early and assigns its returned value to a variable. These elements are then appended to the appropriate area in the card. The card itself is then appended to the page
// It loops through all of the activitiesfor a given park, adding them to the global actvitiesArray variable
// Once all cards have been constructed, it then calls the populateActivities function
// This function is called at the end of the updateView function after page styles have been updated and the other elements on the page have been removed
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
        cardContainerEl.setAttribute('id', parkData[i].id);

        var parkImageEl = createParkImage(parkData[i]);
        cardEl.append(parkImageEl);
        
        var cardTitleEl = createCardTitle(parkData[i]);
        cardContainerEl.append(cardTitleEl);

        var parkDescriptionEl = createParkDescription(parkData[i]);
        cardContainerEl.append(parkDescriptionEl);

        var operatingHoursEl = createOperatingHours(parkData[i]);
        cardContainerEl.append(operatingHoursEl);

        var entryCostEl = createEntryCost(parkData[i]);
        if (parkData[i].entranceFees[0]) {
            cardContainerEl.setAttribute("data-entry-cost", parkData[i].entranceFees[0].cost);
        } else {
            cardContainerEl.setAttribute("data-entry-cost", "0.00");
        }
        cardContainerEl.append(entryCostEl);

        var parkUrlEl = createParkUrl(parkData[i]);
        cardContainerEl.append(parkUrlEl);

        for (let y = 0; y < parkData[i].activities.length; y++) {            
            cardCellEl.setAttribute("data-activity" + "-" + [y], parkData[i].activities[y].name);
            activitiesArray.push(parkData[i].activities[y].name);
        }
        cardEl.append(cardContainerEl);
        resultsEl.append(cardCellEl);
        cardCellArray.push(cardCellEl);
    }
    populateActivities(activitiesArray);
}

function sortCards(event){
    var checkedBoxes = $(":checked");
    var matchingCells = [];

    for (let i = 0; i < checkedBoxes.length; i++) {
        for (let x = 0; x < cardCellArray.length; x++) {
            var attributeArray = $.makeArray(cardCellArray[x].attributes);
            
            for (let y = 0; y < attributeArray.length; y++) {
                if (checkedBoxes[i].value === attributeArray[y].value) {
                    console.log("A match has occured it is for the value " + checkedBoxes[i].value);
                    // console.log(cardCellArray[x]);
                    matchingCells.push(cardCellArray[x]);
                }    
            }
        }
    } populateFilterCells(matchingCells);
}

function populateFilterCells(array) {
    var resultsContainerEl = document.getElementById("results-container");
    removeAllChildNodes(resultsContainerEl);
    if ($("input:checkbox:checked").length > 0) {
        for (let i = 0; i < array.length; i++) {
            resultsContainerEl.append(array[i]);
        }
    } else {
        for (let i = 0; i < cardCellArray.length; i++) {
            resultsContainerEl.append(cardCellArray[i]);
        }
    }
}

$(document).on('change', '.checkbox', function(event){
    sortCards(event);
});

$(document).on('click', '.checkbox', function(event){
    $('input:checkbox').not(this).prop('checked', false);
});