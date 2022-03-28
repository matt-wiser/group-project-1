var hereUrl = "https://router.hereapi.com/v8routes?apiKey=";
var hereKey = "aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok";


function getAddData() {
    var homeStAdd = document.querySelector("#address").value.trim().replace(/ /g, "_");
    console.log('homeStAdd: ', homeStAdd);
    var homeCity = document.querySelector("#city").value.trim().replace(/ /g, "_");
    console.log('homeCity: ', homeCity);
    var homeZip = document.querySelector("#zip").value.trim().replace(/ /g, "_");
    console.log('homeZip: ', homeZip);

    var addData = {
        homeStAdd: homeStAdd,
        homeCity: homeCity,
        homeZip: homeZip,
    }
    console.log(addData);
    getLatLonAddress(addData);
}

function getLatLonAddress(addData) {

    console.log(addData);
    //find latitude and logitude from address information
    var hereLatLonUrl = `https://geocode.search.hereapi.com/v1/geocode?apiKey=${hereKey}&q=${addData.homeStAdd}+${addData.homeCity}+${addData.homeZip}`;
    console.log(hereLatLonUrl);
    return fetch(hereLatLonUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                alert("Error: Latitude/Longitude not found");
            }
        })
        .then(function (data) {
            console.log('data: ', data);
            console.log({
                homeLat: data.items[0].position.lat,
                homeLon: data.items[0].position.lng
            })
            return {
                homeLat: data.items[0].position.lat,
                homeLon: data.items[0].position.lng,
            }
        })
}



function calculateRouteFromAtoB(platform) {
  var homeLat = platform.homeLat;
  console.log('homeLat: ', homeLat);
  var homeLon = platform.homeLon;
    var router = platform.getRoutingService(null, 8),
        routeRequestParams = {
          routingMode: 'fast',
          transportMode: 'car',
          metricSystem: "imperial",
          language: "en-us",
          origin: "35.890300,-86.395500", // My House
          destination: "36.31837,-86.63381", // My Old House
          
          return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
        };
  
    router.calculateRoute(
      routeRequestParams,
      onSuccess,
      onError
    );
  }
  
  /**
   * This function will be called once the Routing REST API provides a response
   * @param {Object} result A JSONP object representing the calculated route
   *
   * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
   */
  function onSuccess(result) {
    var route = result.routes[0];
  
    /*
     * The styling of the route response on the map is entirely under the developer's control.
     * A representative styling can be found the full JS + HTML code of this example
     * in the functions below:
     */
    addRouteShapeToMap(route);
   // addManueversToMap(route);
    addWaypointsToPanel(route);
    addManueversToPanel(route);
    addSummaryToPanel(route);
    // ... etc.
  }
  
  /**
   * This function will be called if a communication error occurs during the JSON-P request
   * @param {Object} error The error message received.
   */
  function onError(error) {
    alert('Can\'t reach the remote server');
  }
  
  
   //* map initialization code starts below:
   
  
  // set up containers for the map + panel
  var mapContainer = document.getElementById('mapContainer'),
  routeInstructionsContainer = document.getElementById('panel');
  
  // initialize communication with the platform
  // In your own code, replace variable window.apikey with your own apikey
  var platform = new H.service.Platform({
      'apiKey': "aFbhWRKzG5oEgwGqW5qoKpwXmPJFS3pmFAlVLFL0cok"
  });
  
  //This keeps initial map from being created!!!!!
  var defaultLayers = platform.createDefaultLayers();
  
  // initialize a map - this map is centered over Tennessee
  //this creates the initial map!!!!!
  var map = new H.Map(mapContainer,
    defaultLayers.vector.normal.map, {
    center: {lat: 35.89, lng: -86.39},
    zoom: 8,
    pixelRatio: window.devicePixelRatio || 1
  });

  
  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener('resize', () => map.getViewPort().resize());
  
  // make the map interactive
  // MapEvents enables the event system
  // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  
  
  // Create the default UI components
  var ui = H.ui.UI.createDefault(map, defaultLayers);

 
  // // Hold a reference to any infobubble opened
  // var bubble;
  
  // /**
  //  * Opens/Closes a infobubble
  //  * @param {H.geo.Point} position The location on the map.
  //  * @param {String} text          The contents of the infobubble.
  //  */
  // function openBubble(position, text) {
  //   if (!bubble) {
  //     bubble = new H.ui.InfoBubble(
  //       position,
  //       // The FO property holds the province name.
  //       {content: text});
  //     ui.addBubble(bubble);
  //   } else {
  //     bubble.setPosition(position);
  //     bubble.setContent(text);
  //     bubble.open();
  //   }
  // }
  
  /**
   * Creates a H.map.Polyline from the shape of the route and adds it to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addRouteShapeToMap(route) {
    route.sections.forEach((section) => {
      // decode LineString from the flexible polyline
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
  
      // Create a polyline to display the route:
      let polyline = new H.map.Polyline(linestring, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
      });
  
      // Add the polyline to the map
      map.addObject(polyline);
      // And zoom to its bounding rectangle
      map.getViewModel().setLookAtData({
        bounds: polyline.getBoundingBox()
      });
    });
  }
  
  // // /**
  // //  * Creates a series of H.map.Marker points from the route and adds them to the map.
  // //  * @param {Object} route A route as received from the H.service.RoutingService
  // //  */
  // // function addManueversToMap(route) {
  // //   var svgMarkup = '<svg width="18" height="18" ' +
  // //     'xmlns="http://www.w3.org/2000/svg">' +
  // //     '<circle cx="8" cy="8" r="8" ' +
  // //       'fill="#1b468d" stroke="white" stroke-width="1" />' +
  // //     '</svg>',
  // //     dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
  // //     group = new H.map.Group(),
  // //     i,
  // //     j;
  
  //   route.sections.forEach((section) => {
  //     let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();
  
  //     let actions = section.actions;
  //     // Add a marker for each maneuver
  //     for (i = 0; i < actions.length; i += 1) {
  //       let action = actions[i];
  //       var marker = new H.map.Marker({
  //         lat: poly[action.offset * 3],
  //         lng: poly[action.offset * 3 + 1]},
  //         {icon: dotIcon});
  //       marker.instruction = action.instruction;
  //       group.addObject(marker);
  //     }
  
  //     group.addEventListener('tap', function (evt) {
  //       map.setCenter(evt.target.getGeometry());
  //       openBubble(evt.target.getGeometry(), evt.target.instruction);
  //     }, false);
  
  //     // Add the maneuvers group to the map
  //     map.addObject(group);
  //   });
  // }
  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addWaypointsToPanel(route) {
    var nodeH3 = document.createElement('h3'),
      labels = [];
  
    route.sections.forEach((section) => {
      labels.push(
        section.turnByTurnActions[0].nextRoad.name[0].value)
      labels.push(
        section.turnByTurnActions[section.turnByTurnActions.length - 1].currentRoad.name[0].value)
    });
  
    nodeH3.textContent = labels.join(' - ');
    routeInstructionsContainer.innerHTML = '';
    routeInstructionsContainer.appendChild(nodeH3);
  }
  
  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addSummaryToPanel(route) {
    let duration = 0,
      distance = 0;

    
    route.sections.forEach((section) => {
      distance += section.travelSummary.length/1609.34;
      duration += section.travelSummary.duration;
    });
  
    var summaryDiv = document.createElement('div'),
      content = '<b>Total distance</b>: ' + distance + ' miles. <br />' +
        '<b>Travel Time</b>: ' + toMMSS(duration) + ' (in current traffic)';
  
    summaryDiv.style.fontSize = 'small';
    summaryDiv.style.marginLeft = '5%';
    summaryDiv.style.marginRight = '5%';
    summaryDiv.innerHTML = content;
    routeInstructionsContainer.appendChild(summaryDiv);
  }
  
  /**
  //  * Creates a series of H.map.Marker points from the route and adds them to the map.
  //  * @param {Object} route A route as received from the H.service.RoutingService
   */
  function addManueversToPanel(route) {
    var nodeOL = document.createElement('ol');
  
    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft ='5%';
    nodeOL.style.marginRight ='5%';
    nodeOL.className = 'directions';
  
    route.sections.forEach((section) => {
      section.actions.forEach((action, idx) => {
        var li = document.createElement('li'),
          spanArrow = document.createElement('span'),
          spanInstruction = document.createElement('span');
  
        spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
        spanInstruction.innerHTML = section.actions[idx].instruction;
        li.appendChild(spanArrow);
        li.appendChild(spanInstruction);
  
        nodeOL.appendChild(li);
      });
    });
  
    routeInstructionsContainer.appendChild(nodeOL);
  }
  
  function toMMSS(duration) {
    return Math.floor(duration / 60) + ' minutes ' + (duration % 60) + ' seconds.';
  }
  
  // Now use the map as required...
  calculateRouteFromAtoB(platform) 
   
   $('#submitaddress').click(getAddData);


 