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
    reviewName.textContent = item.userName;

    let reviewPlace = document.createElement('span');
    reviewPlace.classList.add('review-place');
    reviewPlace.textContent = item.placeName;

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
