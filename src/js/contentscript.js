'use strict';

function getImdbId() {
  const idRegExp = /.*\/title\/(.*)\/.*/;
  const footerArr = document.getElementsByClassName('text-footer');
  if (footerArr && footerArr.length > 0) {
    const footer = footerArr[0];
    if (footer && footer.firstElementChild && footer.firstElementChild.href) {
      const imdbLink = footer.firstElementChild.href;
      const idArr = idRegExp.exec(imdbLink);
      if (idArr && idArr.length > 1) {
        return idArr[1];
      }
    }
  }
  return null;
}

function buildApiUrl(imdbId) {
  return `http://www.omdbapi.com/?i=${imdbId}&plot=short&r=json&tomatoes=true`;
}

function injectSection(imdbRating, tomatoRating) {
  const sidebar = document.getElementsByClassName('sidebar')[0];

  const newSection = document.createElement('section');
  newSection.className = 'section';
  newSection.style.marginTop = '10px';

  const newSectionInnerHTML =
   `<h2 class="section-heading">EXTERNAL RATINGS</h2>
    <div class="text">
      <p class="rating-green">
        IMDb - ${imdbRating} out of 10
        <span style="vertical-align: middle;" class="rating rated-${Math.round(imdbRating)}"></span>
        <br />
        Rotten Tomatoes - ${tomatoRating}
        <span style="vertical-align: middle;" class="rating rated-${Math.round(tomatoRating)}"></span>
      </p>
    </div>`;

  newSection.innerHTML = newSectionInnerHTML;
  sidebar.appendChild(newSection);
  sidebar.style.paddingBottom = '20px';
}

function makeRequest(method, url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 400) {
        resolve(xhr.responseText);
      } else {
        reject(xhr.responseText);
      }
    };
    xhr.onerror = () => reject(xhr.responseText);
    xhr.send();
  });
}

const imdbId = getImdbId();
const url = buildApiUrl(imdbId);

makeRequest('GET', url)
  .then(rText => {
    const parsed = JSON.parse(rText);
    injectSection(parsed.imdbRating, parsed.tomatoRating);
  })
  .catch(rText => console.error('letterboxd-extra-ratings: error during api request ' + rText));
