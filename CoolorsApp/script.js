// Global selection and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');

// 2) Functions

// 2.1) Generator random hex

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

// 2.2) Generate Random Colors and assign to bg & h2

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
    // Check for contrast - 2.3)
    checkTextContrast(randomColor, hexText);
  });
}

// 2.3) Check contrast of bg and change color of h2

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance();
  if (luminance > 0.5) {
    text.style.color = 'black';
  } else {
    text.style.color = 'white';
  }
}

// 3) Call the functions

randomColors();
