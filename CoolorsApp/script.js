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
    // Initialize colorize sliders
    const color = chroma(randomColor);
    // Get all the sliders in a nodelist
    const sliders = div.querySelectorAll('.sliders input');
    // Seperate the sliders
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    // Get scale for sliders matching the bg - 2.4)
    colorizeSliders(color, hue, brightness, saturation);
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

// 2.4) Get scale for sliders matching the bg

function colorizeSliders(color, hue, brightness, saturation) {
  // Saturation
  // Getting the min and max saturation of the color
  //min
  const noSat = color.set('hsl.s', 0);
  //max
  const fullSat = color.set('hsl.s', 1);
  //create scale
  const scaleSat = chroma.scale([noSat, color, fullSat]);

  // Brightness
  // Getting the mid brightness
  //min
  const midBright = color.set('hsl.l', 0.5);
  //create scale
  const scaleBright = chroma.scale(['black', midBright, 'white']);

  //Sat
  // Add it to the sat bg
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)})`;

  //Bright
  // Add it to the sat bg
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)} , ${scaleBright(1)})`;

  //Hue
  // Add it to the sat bg
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204, 75, 75), rgb(204, 204, 75), rgb(75, 204, 75), rgb(75, 204, 204), rgb(75, 75, 204), rgb(204, 75, 204), rgb(204, 75, 75))`;
}

// 3) Call the functions

randomColors();
