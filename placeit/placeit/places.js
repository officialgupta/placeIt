var map;
var infoWindow;
var service;
var randomPlace;
var placeLatLng;

function init() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 53.5, lng: -2.24 },
        zoom: 15,
    });

    var request = {
        location: new google.maps.LatLng(53.5, -2.24),
        radius: 5000,
        keyword: 'attraction'
    };

    service = new google.maps.places.PlacesService(map);
    service.radarSearch(request, callback);
}

function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
    }
    randomPlace = results[Math.floor(Math.random() * results.length)];
    getPlaceDetails(randomPlace);
}

function getPlaceDetails(place) {
    var lat = place.geometry.location.lat();
    var long = place.geometry.location.long();
    var placeLatLng = [lat, long];
    document.write("hello");
    document.write(lat);
    document.write(long);
}

init()