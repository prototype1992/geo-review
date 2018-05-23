import {
    isMatching
} from './helpers';

let myMap = null;
let coords = null;

const ELEMENTS = {
    addReview: document.querySelector('#addReview'),
    address: document.querySelector('#address'),
    close: document.querySelector('#close'),
    addBtn: document.querySelector('#add-btn'),
    formName: document.querySelector('#form-name'),
    formPlaceName: document.querySelector('#form-place-name'),
    formText: document.querySelector('#form-text'),
};

// events
ELEMENTS.addBtn.addEventListener('click', event => {
    let {formName, formPlaceName, formText} = ELEMENTS;

    // создаем маркер на карте с нашими данными
    createPlaceMark(coords);
});

ELEMENTS.close.addEventListener('click', hideAddReview);

ymaps.ready(init);

function init() {
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 13
    });

    myMap.events.add('click', function (e) {
        // получаем координаты
        coords = e.get('coords');

        // отображаем блок с добавлением
        showAddReview();

        ymaps.geocode(coords)
            .then( (response) => {
                // меняем адрес на блоке добавления
                changeAddress(response);
            });
    });
}

function hideAddReview() {
    ELEMENTS.addReview.style.display = 'none';
}

function showAddReview() {
    ELEMENTS.addReview.style.display = 'block';
}

function changeAddress(response) {
    let firstGeoObject = response.geoObjects.get(0);
    // меняем адрес на блоке добавления
    ELEMENTS.address.textContent = firstGeoObject.getAddressLine();
}

function createPlaceMark(coords) {
    // создаем флажок
    let newPlaceMark = new ymaps.Placemark(coords, {
        hintContent: 'hintContent',
        balloonContent: `<div>
    <h1>Заголовок</h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam, sapiente.</p>
</div>`
    });

    // добавляем флажок на карту
    myMap.geoObjects.add(newPlaceMark);
}


