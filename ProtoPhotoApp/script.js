// A) Selecting Elements

const auth = '563492ad6f917000010000016fd33cde09064f70af9a07c7f0f4b1d5';
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
let searchValue;
const more = document.querySelector('.more');
let page = 1;
let fetchLink;
let currentSearch;

// B) Event Listeners
// B1) Get input
searchInput.addEventListener('input', updateInput);

// B2) Submit input
form.addEventListener('submit', (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

// B3) More Images
more.addEventListener('click', loadMore);

// C) Functions
// C1) Fetch image api
async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    // add parameters
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: auth,
    },
  });
  // parse it into data
  const data = await dataFetch.json();
  return data;
}

// C2) Display fetched images
function generatePictures(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement('div');
    galleryImg.classList.add('gallery-img');
    galleryImg.innerHTML = `
    <div class='gallery-info'>
    <p>${photo.photographer}<p>
    <a href=${photo.src.original} target=_blank>Download</a>
    </div>
    <img src=${photo.src.large}></img>
    `;
    gallery.appendChild(galleryImg);
  });
}

// C3) Get the input from search
function updateInput(e) {
  // get the typed value
  searchValue = e.target.value;
}

// C4) Curated images - on loading
async function curatedPhotos() {
  fetchLink = 'https://api.pexels.com/v1/curated?per_page=15&page=1';
  const data = await fetchApi(fetchLink);

  // loop over data and display the images
  generatePictures(data);
}

// C5) Searched images
async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);
  // loop over data and display the images
  generatePictures(data);
}

// C6) Clear screen and display searched images
function clear() {
  gallery.innerHTML = '';
  searchInput.value = '';
}

// C7) Load more
async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

// D) Call the functions
curatedPhotos();
