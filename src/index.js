import {
    createReviewNode
} from './helpers';

let myMap = null; // карта
let myClusterer = null; // кластер для меток
let currentPlaceMark = null; // текущая открытая метка
let coords = null; // временное хранение координат
let points = []; // временное хранение координат
let reviews = {};
let currentReviews = [];

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

ymaps.ready(() => {
    myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 5,
        controls: ['zoomControl'],
        behaviors: ['drag']
    });

    // создаем кластер
    myClusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: true,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonPanelMaxMapArea: 0,
        clusterBalloonContentLayoutWidth: 200,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5
    });
    myClusterer.add(points);
    myMap.geoObjects.add(myClusterer);

    // клик по карте
    myMap.events.add('click', function (e) {
        // получаем координаты
        coords = e.get('coords');

        console.log('coords', coords);
        console.log('currentPlaceMark', currentPlaceMark);

        // отображаем блок с добавлением
        showAddReview();

        // если метка есть, сравни ее с координатами
        if (currentPlaceMark) {
            console.log('click 1');
            if (currentPlaceMark.geometry.getCoordinates().toString() !== coords.toString()) {
                console.log('click 3');
                // очищаем текущий маркер
                currentPlaceMark = null;

                // очищаем отзывы
                reviews = [];

                // очищаем блок отзывы
                DOM.list.innerHTML = 'Отзывов пока нет...';
            }
        } else {
            // иначе очищаем блок отзывы
            console.log('click 2');
            DOM.list.innerHTML = 'Отзывов пока нет...';
        }

        // если метка открыта, то закрыть
        if (myMap.balloon.isOpen()) {
            myMap.balloon.close();
        }

        // получаем данные по координатам
        changeAddress(coords, DOM.address);
    });
});

// событие добавления отзыва
DOM.addBtn.addEventListener('click', event => {
    let {formName, formPlaceName, formText} = DOM;

    let newReview = {
        // id: currentPlaceMark.geometry.getCoordinates().toString(),
        name: formName.value,
        placeValue: formPlaceName.value,
        comment: formText.value,
        date: Date.now().toLocaleString()
    };

    console.log('currentPlaceMark---', currentPlaceMark);

    // Если метка уже создана.
    if (!currentPlaceMark) {
        createPlaceMark(coords);
        addReview(newReview);
        console.log('currentPlaceMark 1', reviews);
        renderReviews(reviews);
    } else {
        // add review
        addReview(newReview);
        console.log('currentPlaceMark 2', reviews);
        renderReviews(reviews);
    }
});

DOM.close.addEventListener('click', () => {
    // скрываем блок с отзывами и формой
    hideAddReview();

    // очищаем текущий маркер
    currentPlaceMark = null;

    // очищаем отзывы
    reviews = [];
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
function createPlaceMark(coords) {
    //Создаём метку.
    let newPlaceMark = new ymaps.Placemark(
        coords,
        {
            balloonContentHeader: 'Value',
            balloonContentBody: '<a>address</a><br><br>' + 'Value' + '<br><br>',
            balloonContentFooter:Date.now()
        },
        {
            preset: 'islands#violetDotIconWithCaption',
            draggable: false,
            openBalloonOnClick: false
        });

    currentPlaceMark = newPlaceMark;

    // создаем поле с отзывами в метке
    newPlaceMark.properties.set('reviews', []);

    reviews = newPlaceMark.properties.get('reviews');

    // добавляем флажок на карту
    myMap.geoObjects.add(newPlaceMark);
    // clustered add
    myClusterer.add(newPlaceMark);
    // добавляем в points
    points.push(newPlaceMark);

    newPlaceMark.events.add('click', event => {
        // показываем блок
        showAddReview();

        // меняем адрес
        changeAddress(newPlaceMark.geometry.getCoordinates(), DOM.address);

        // рендерим отзывы
        console.log('reviews1', reviews);
        reviews = newPlaceMark.properties.get('reviews');
        console.log('reviews2', reviews);
        renderReviews(reviews);
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
function addReview(object) {
    if (Object.keys(object).length > 0) {
        reviews.push(object);
    } else {
        alert('Заполните все поля для добавления отзыва!');
    }
}

function changeAddress(coords, element) {
    // получаем данные по координатам
    ymaps.geocode(coords)
        .then((response) => {
            // меняем адрес на блоке добавления
            let firstGeoObject = response.geoObjects.get(0);
            // меняем адрес на блоке добавления
            element.textContent = firstGeoObject.getAddressLine();
        });
}
