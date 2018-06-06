import {
    createReviewNode
} from './helpers';

let myMap = null; // карта
let myClusterer = null; // кластер для меток
let currentPlaceMark = null; // текущая открытая метка
let coords = null; // временное хранение координат
let points = []; // временное хранение координат
let reviews = [];

// элементы ДОМ
const DOM = {
    addReview: document.querySelector('#addReview'),
    address: document.querySelector('#address'),
    close: document.querySelector('#close'),
    addBtn: document.querySelector('#add-btn'),
    formName: document.querySelector('#form-name'),
    formPlaceName: document.querySelector('#form-place-name'),
    formText: document.querySelector('#form-text'),
    list: document.querySelector('#list'),
};

// events
DOM.addBtn.addEventListener('click', event => {
    let {formName, formPlaceName, formText} = DOM;

    let nameValue = formName.value;
    let placeValue = formPlaceName.value;
    let comment = formText.value;

    addReview(nameValue, placeValue, comment);

    renderReviews(reviews);

    // Если метка уже создана.
    if (currentPlaceMark) {
        console.log('coords', coords);
        console.log('currentPlaceMark', currentPlaceMark);
        if (coords.join() !== currentPlaceMark.join()) {
            // тогда создаем метку
            createPlaceMark(coords, nameValue, placeValue, comment, date);
        }
        // add review
        console.log('add review');
    } else {
        // тогда создаем метку
        createPlaceMark(coords, nameValue, placeValue, comment, date);
    }
});

DOM.close.addEventListener('click', () => {
    // скрываем блок с отзывами и формой
    hideAddReview();

    // очищаем текущий маркер
    currentPlaceMark = null;
});

ymaps.ready(() => {
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 5,
        controls: ['zoomControl'],
        behaviors: ['drag']
    });

    // создаем кластер
    myClusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons'
    });
    myMap.geoObjects.add(myClusterer);

    // клик по карте
    myMap.events.add('click', function (e) {
        // получаем координаты
        coords = e.get('coords');

        console.log('coords', coords);
        console.log('currentPlaceMark', currentPlaceMark);

        // отображаем блок с добавлением
        showAddReview();

        if (currentPlaceMark) {
            if (coords.join() !== currentPlaceMark.join()) {
                console.log('111');
            } else {
                // если выбранная метка есть, рендерим отзывы
                console.log('Рендерим отзывы');
                // рендерим отзывы
                renderReviews(reviews);
            }
        } else {
            // иначе очищаем блок отзывы
            DOM.list.innerHTML = 'Отзывов пока нет...';
        }

        // если метка открыта, то закрыть
        if (myMap.balloon.isOpen()) {
            myMap.balloon.close();
        }

        // получаем данные по координатам
        ymaps.geocode(coords)
            .then((response) => {
                // меняем адрес на блоке добавления
                let firstGeoObject = response.geoObjects.get(0);
                // меняем адрес на блоке добавления
                DOM.address.textContent = firstGeoObject.getAddressLine();
            });
    });
});

// скрытие блока ДОБАВЛЕНИЯ
function hideAddReview() {
    DOM.addReview.style.display = 'none';
}

// отображение блока ДОБАВЛЕНИЯ
function showAddReview() {
    // DOM.addReview.style.top = event.clientY + 'px';
    // DOM.addReview.style.left = event.clientX + 'px';
    DOM.addReview.style.display = 'block';
}

// создание метки
function createPlaceMark(coords, name, place, comment, date) {
    //Создаём метку.
    let newPlaceMark = new ymaps.Placemark(coords, {
        balloonContentHeader: `<h3>${place}</h3>`,
        balloonContentBody: `<div>
            <a href="" onclick="showAddReview()" class="balloonLink">${DOM.address.textContent}</a>
            <p>${comment}</p>
        </div>`,
        balloonContentFooter: `<p>${date}</p>`
    }, {
        preset: 'islands#violetDotIconWithCaption',
        draggable: false,
        openBalloonOnClick: false
    });

    let newReview = {
        id: Date.now(),
        name,
        place,
        comment,
        date
    };

    newPlaceMark.properties.set('reviews', []);
    console.log(newPlaceMark.properties.get('reviews').push(newReview));
    console.log(newPlaceMark.properties.get('reviews'));

    // добавляем координаты нового маркера к текущей открытой метке
    currentPlaceMark = newPlaceMark.geometry.getCoordinates();

    console.log('currentPlaceMark', currentPlaceMark);

    reviews = newPlaceMark.properties.get('reviews');

    console.log('reviews', reviews);

    // добавляем флажок на карту
    myMap.geoObjects.add(newPlaceMark);

    console.log('commentContent', newPlaceMark);

    newPlaceMark.events.add('click', event => {
        showAddReview();
    });
}

// рендер отзывов
function renderReviews(data) {
    DOM.list.innerHTML = '';

    let fragment = document.createDocumentFragment();

    for (let item of data) {
        let review = createReviewNode(item);

        fragment.appendChild(review);
    }

    DOM.list.appendChild(fragment);
}

// добавление отзыва
function addReview(name, place, comment) {
    if (name && place && comment) {
        let newReview = {
            id: Date.now(),
            userName: name,
            placeName: place,
            comment: comment,
            date: new Date().toLocaleTimeString()
        };

        reviews.push(newReview);
    } else {
        alert('Заполните все поля для добавления отзыва!');
    }
}
