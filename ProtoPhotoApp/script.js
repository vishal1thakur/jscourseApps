// A) Selecting Elements

const auth = '563492ad6f917000010000016fd33cde09064f70af9a07c7f0f4b1d5';
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
let searchValue;

// B) Event Listeners
// B1) Get input
searchInput.addEventListener('input', updateInput);

// B2) Submit input
form.addEventListener('submit', (e) => {
  e.preventDefault();
  searchPhotos(searchValue);
});

// C) Functions
// C1) Fetch curated images

// async fetching
async function curatedPhotos() {
  const dataFetch = await fetch(
    'https://api.pexels.com/v1/curated?per_page=15',
    // add parameters
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: auth,
      },
    }
  );
  // parse it into data
  const data = await dataFetch.json();
  // loop over data and display the images
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement('div');
    galleryImg.classList.add('gallery-img');
    galleryImg.innerHTML = `<img src=${photo.src.large}></img>
    <p>${photo.photographer}<p>
    `;
    gallery.appendChild(galleryImg);
  });
}

// C2) Search images
async function searchPhotos(query) {
  const dataFetch = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=15`,
    // add parameters
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: auth,
      },
    }
  );
  // parse it into data
  const data = await dataFetch.json();
  // loop over data and display the images
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement('div');
    galleryImg.classList.add('gallery-img');
    galleryImg.innerHTML = `<img src=${photo.src.large}></img>
    <p>${photo.photographer}<p>
    `;
    gallery.appendChild(galleryImg);
  });
}

// C3) Update input
function updateInput(e) {
  // get the typed value
  searchValue = e.target.value;
}

// D) Call the functions
curatedPhotos();
