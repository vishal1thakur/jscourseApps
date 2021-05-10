// A) Selecting Elements

const auth = '563492ad6f917000010000016fd33cde09064f70af9a07c7f0f4b1d5';
const gallery = document.querySelector('.gallery');
const searchInput1 = document.querySelector('.search-input1');
const searchInput2 = document.querySelector('.search-input2');
const form1 = document.querySelector('.search-form1');
const form2 = document.querySelector('.search-form2');
let searchValue;
const more = document.querySelector('.more');
let page = 1;
let fetchLink;
let currentSearch1;
let currentSearch2;

// B) Event Listeners
// B1) Get input
searchInput1.addEventListener('input', updateInput);
searchInput2.addEventListener('input', updateInput);

// B2) Submit input
form1.addEventListener('submit', (e) => {
  e.preventDefault();
  currentSearch1 = searchValue;
  searchPhotos(searchValue);
});
form2.addEventListener('submit', (e) => {
  e.preventDefault();
  currentSearch2 = searchValue;
  searchVideos(searchValue);
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
  console.log(data);
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement('div');
    galleryImg.classList.add('gallery-img');
    galleryImg.innerHTML = `
    <a href=${photo.url} target=_blank>
      <img src=${photo.src.large}></img>
    </a>
    <div class='gallery-info'>
    <a href=${photo.photographer_url} target=_blank>
      <p class='link'>@${photo.photographer}<p>
    </a>
    <a href=${photo.src.original} target=_blank>Download</a>
    </div>
    `;
    gallery.appendChild(galleryImg);
  });
}

function generateVideos(data) {
  data.videos.forEach((video) => {
    const galleryImg = document.createElement('div');
    galleryImg.classList.add('gallery-img');
    galleryImg.innerHTML = `
    <video width="320" height="240" controls>
      <source src=${video.video_files[1].link} type="video/mp4">
    </video>
    <div class='gallery-info'>
    <a href=${video.user.url} target=_blank>
      <p class='link'>@${video.user.name}<p>
    </a>
     <a href=${video.url} target=_blank>Download</a>
      
    </div>
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

async function searchVideos(query) {
  clear();
  fetchLink = `https://api.pexels.com/videos/search?query=${query}&per_page=9&page=1`;

  const data = await fetchApi(fetchLink);
  console.log(data);
  // loop over data and display the images
  generateVideos(data);
}

// C6) Clear screen and display searched images
function clear() {
  gallery.innerHTML = '';
  searchInput1.value = '';
  searchInput2.value = '';
}

// C7) Load more
async function loadMore() {
  page++;
  if (currentSearch1 && !currentSearch2) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch1}&per_page=15&page=${page}`;
    const data = await fetchApi(fetchLink);
    generatePictures(data);
  }
  if (currentSearch2 && !currentSearch1) {
    fetchLink = `https://api.pexels.com/videos/search?query=${currentSearch2}&per_page=9&page=${page}`;
    const data = await fetchApi(fetchLink);
    generateVideos(data);
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    const data = await fetchApi(fetchLink);
    generatePictures(data);
  }
}

// D) Call the functions
curatedPhotos();
