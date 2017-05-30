'use strict';

const WRAPAPI_KEY = 'Cc5yy2kAMiz91tQoSYZrI0WH2mqcViba';

function buildUrl(imdbId) {
  return `https://wrapapi.com/use/guillevc/movieratings/imdb/latest?imdbId=${imdbId}&wrapAPIKey=${WRAPAPI_KEY}`;
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

function injectSection(imdbRating, metascore) {
  const sidebar = document.getElementsByClassName('sidebar')[0];

  const newSection = document.createElement('section');
  newSection.className = 'section';
  newSection.style.marginTop = '10px';

  newSection.innerHTML =
    `<h2 class="section-heading">EXTERNAL RATINGS</h2>
    <div class="text">
      <p class="rating-green">
        IMDb — ${imdbRating}/10
        <span style="vertical-align: middle;" class="rating rated-${Math.round(imdbRating)}"></span>
        <br />
        Metascore — ${metascore}/100
        <span style="vertical-align: middle;" class="rating rated-${Math.round(metascore/10)}"></span>
      </p>
    </div>`;

  sidebar.appendChild(newSection);
  sidebar.style.paddingBottom = '20px';
}

(function main() {
  const imdbId = getImdbId();
  if (!imdbId) {
    console.error('letterboxd-extra-ratings: imdb id not found in page');
  } else {
    const url = buildUrl(imdbId);
    makeRequest('GET', url)
      .then(rText => {
        try {
          const response = JSON.parse(rText);
          if (response.success && response.data) {
            const imdbRating = Number.parseFloat(response.data.imdbRating);
            const metascore = Number.parseInt(response.data.metascore, 10);
            injectSection(imdbRating, metascore);
          } else {
            console.error('letterboxd-extra-ratings: ratings for this film were not found');
          }
        } catch(e) {
          console.error(`letterboxd-extra-ratings: ${e.message}`);
        }
      })
      .catch(rText =>
          console.error(`letterboxd-extra-ratings: error during api request: ${rText}`)
      );
  }
})();
