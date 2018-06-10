// функция поиска подстроки в строке
export function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    if (full.indexOf(chunk) + 1) {
        return true;
    } else {
        return false;
    }
}

export function createReviewNode(item) {
    // создаем обертку
    let li = document.createElement('li');
    li.classList.add('review-item');

    // верхняя часть
    let reviewTop = document.createElement('div');
    reviewTop.classList.add('review-top');

    let reviewName = document.createElement('h4');
    reviewName.classList.add('review-name');
    reviewName.textContent = item.name;

    let reviewPlace = document.createElement('span');
    reviewPlace.classList.add('review-place');
    reviewPlace.textContent = item.place;

    let reviewDate = document.createElement('span');
    reviewDate.classList.add('review-date');
    reviewDate.textContent = item.date;

    reviewTop.appendChild(reviewName);
    reviewTop.appendChild(reviewPlace);
    reviewTop.appendChild(reviewDate);

    let reviewComment = document.createElement('p');
    reviewComment.classList.add('review-text');
    reviewComment.textContent = item.comment;

    li.appendChild(reviewTop);
    li.appendChild(reviewComment);

    return li;
}

export function getCoordsForWindow(flag) {
    let x = window.event.pageX;
    let y = window.event.pageY;
    let width = null;
    let height = null;

    if (flag === 'modal') {
        width = 380;
        height = 525;
    } else {
        width = 380;
        height = 320;
    }

    if (x + width > document.documentElement.clientWidth) {
        let deltaX = document.documentElement.clientWidth - x - width - 25;
        x = x + deltaX;
    }

    if (y + height > document.documentElement.clientHeight) {
        let deltaY = document.documentElement.clientHeight - y - height - 25;
        y = y + deltaY;
    }

    return {
        x: x,
        y: y
    }
}
