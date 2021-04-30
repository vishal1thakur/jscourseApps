// Global selection and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');

// 2) Functions

// 2.1) Color Generator

function generateHex() {
  // Without Chromajs
  // // All the letters that a hex can have
  // const letters = '0123456789ABCDEF';
  // // The hash before it
  // let hash = '#';
  // // Loop over letters, iterate 6 times (hex code length) and generate a random index from it.
  // for (let i = 0; i < 6; i++) {
  //   hash += letters[Math.floor(Math.random() * 16)];
  // }
  // return hash;

  // With chromajs
  const hexColor = chroma.random();
  return hexColor;
}

// 2.2) Random Colors

function randomColors() {
  colorDivs.forEach((div, index) => {
    // Select the h2 of the div
    const hexText = div.children[0];
    // Generate a random hex
    const randomColor = generateHex();
    // Add it to the text
    hexText.innerText = randomColor;
    // Add it to the bg
    div.style.backgroundColor = randomColor;
  });
}

randomColors();
