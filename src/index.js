import {
    createReviewNode
} from './helpers';

let myMap = null; // карта
let myClusterer = null; // кластер для меток
let currentPlaceMark = null; // текущая открытая метка
let coords = null; // временное хранение координат
let points = []; // временное хранение координат
let reviews = {};

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

        // console.log('coords', coords);
        // console.log('currentPlaceMark', currentPlaceMark);

        // отображаем блок с добавлением
        showAddReview();

        // если метка есть, сравни ее с координатами
        if (currentPlaceMark) {
            // если координаты не совпадают
            if (currentPlaceMark.geometry.getCoordinates().toString() !== coords.toString()) {
                // очищаем текущий маркер
                currentPlaceMark = null;

                // очищаем отзывы
                reviews = [];

                // очищаем блок отзывы
                DOM.list.innerHTML = 'Отзывов пока нет...';
            }
        } else {
            // иначе очищаем блок отзывы
            DOM.list.innerHTML = 'Отзывов пока нет...';
        }

        // если метка открыта, то закрыть
        if (myMap.balloon.isOpen()) {
            myMap.balloon.close();
        }

        // меняем адрес в строке адреса
        changeAddress(coords, DOM.address);
    });
});

// событие добавления отзыва
DOM.addBtn.addEventListener('click', event => {
    let {formName, formPlaceName, formText} = DOM;

    let date = new Date();

    let newReview = {
        // id: currentPlaceMark.geometry.getCoordinates().toString(),
        name: formName.value,
        placeValue: formPlaceName.value,
        comment: formText.value,
        date: date.toLocaleString()
    };

    console.log('currentPlaceMark---', currentPlaceMark);

    // Если метка уже создана.
    if (!currentPlaceMark) {
        createPlaceMark(coords, newReview);
        addReview(newReview);
        renderReviews(reviews);
    } else {
        // add review
        addReview(newReview);
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
    // console.log('event', window.event);
    // let x = window.event.clientX;
    // let y = window.event.clientY;
    // let offsetX = window.event.offsetX;
    // let offsetY = window.event.offsetY;
    // let height = DOM.addReview.getComputedStyle('height');
    // let width = DOM.addReview.getComputedStyle('width');

    // if (x + width > window.outerWidth) {}

    // console.log('x', x);
    // console.log('y', y);
    // console.log('offsetX', offsetX);
    // console.log('offsetY', offsetY);
    // console.log('DOM.addReview', DOM.addReview.outerHeight);

    // DOM.addReview.style.top = y + 'px';
    // DOM.addReview.style.left = x + 'px';
    DOM.addReview.style.display = 'block';
}

let openClusterLink = function(event) {
    showAddReview();

    let balloonLink = document.querySelector('.balloonLink');

    let localCoords = balloonLink.getAttribute('data-coords');
    let localReviews = [];

    console.log('balloonLink', balloonLink);
    console.log('localCoords', localCoords);
    console.log('points', points);

    for(let item of points) {
        if (item.geometry._coordinates.toString() === localCoords.toString()) {
            localReviews.push(item.properties.get('reviews'));
            console.log('localReviews', localReviews);
        }
    }
    renderReviews(localReviews[0]);
};
// костыль
window.openClusterLink = openClusterLink;

// создание метки
function createPlaceMark(coords, review) {
    //Создаём метку.
    let newPlaceMark = new ymaps.Placemark(
        coords,
        {
            balloonContentHeader: `<p>${review.placeValue}</p>`,
            balloonContentBody: `<div>
<h3 class="clusterTitle"><a href="#" data-coords="${coords}" class="balloonLink" onclick="(function() {
    console.log('this', this);
    window.openClusterLink();
})()">${DOM.address.textContent}</a></h3>
<p class="clusterText">${review.placeValue}</p>
</div>`,
            balloonContentFooter: `<p>${review.date}</p>`
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

    console.log('renderReviews data', data);

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
