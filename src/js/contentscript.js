'use strict';

function buildApiUrl(imdbId) {
  return `http://www.omdbapi.com/?i=${imdbId}&plot=short&r=json&tomatoes=true`;
}

function getImdbId() {
  const footer = document.getElementsByClassName('text-footer')[0];
  const imdbLink = footer.firstElementChild.href;
  const idRe = /.*\/title\/(.*)\/.*/;
  return idRe.exec(imdbLink)[1];
}

function injectSection(imdbrating) {
  const sidebar = document.getElementsByClassName('sidebar')[0];
  sidebar.style.paddingBottom = '20px';

  const newSection = document.createElement('section');
  newSection.className = 'section';
  newSection.style.marginTop = '10px';

  const sectionHeading = document.createElement('h2');
  sectionHeading.className = 'section-heading';
  sectionHeading.textContent = 'MORE RATINGS';

  const div = document.createElement('div');
  div.className = 'text';
  const p = document.createElement('p');
  p.textContent = `IMDb Rating: ${imdbrating}/10`;
  div.appendChild(p);

  newSection.appendChild(sectionHeading);
  newSection.appendChild(div);
  sidebar.appendChild(newSection);
}

const imdbId = getImdbId();
const url = buildApiUrl(imdbId);

let imdbRating;

const request = new XMLHttpRequest();
request.open('GET', url, true);
request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    imdbRating = JSON.parse(request.responseText).imdbRating;
    if (imdbRating) injectSection(imdbRating);
  } else {
    console.log('error making api request');
  }
};
request.onerror = function() {
  console.log('error during api request');
};
request.send();
