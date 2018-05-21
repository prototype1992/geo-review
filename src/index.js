import {
    isMatching
} from './helpers';

let myMap;
let myPlacemark;

function init() {
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 13
    });

    myPlacemark = new ymaps.Placemark(
        [55.76, 37.64],
        {
            hintContent: 'Москва!',
            balloonContent: 'Столица России'
        }
    );

    myMap.geoObjects.add(myPlacemark);

    myMap.events.add('click', function (e) {
        let coords = e.get('coords');

        let newPlaceMark = new ymaps.Placemark(coords, {
            hintContent: 'hintContent',
            balloonContent: 'balloonContent'
        });

        myMap.geoObjects.add(newPlaceMark);
    });
}

ymaps.ready(init);
