// Global selection and variables
const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll('.color h2');
let initialColors;

// 1) Event Listeners
// 1.1) HSB Sliders
sliders.forEach((slider) => {
  slider.addEventListener('input', hslControls);
});

// 1.2) Change text with slider values
colorDivs.forEach((div, index) => {
  div.addEventListener('change', () => {
    updateTextUI(index);
  });
});

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

// 2.5) Change bg with hsb - 1.1
function hslControls(e) {
  //Get the specify color on which the hsb is being clicked
  const index =
    e.target.getAttribute('data-bright') ||
    e.target.getAttribute('data-sat') ||
    e.target.getAttribute('data-hue');

  // Get all three values when clicked on any one
  const sliders = e.target.parentElement.querySelectorAll('input[type="range"');
  // Get individual one
  const hue = sliders[0];
  const brightness = sliders[1];
  const saturation = sliders[2];

  // Get hex text of the bg
  const bgColor = colorDivs[index].querySelector('h2').innerText;

  // Change color
  let color = chroma(bgColor)
    .set('hsl.s', saturation.value)
    .set('hsl.l', brightness.value)
    .set('hsl.h', hue.value);

  // Assign it to bg
  colorDivs[index].style.backgroundColor = color;
}

// 2.6) Update text of the color div - 1.2
function updateTextUI(index) {
  // Get the active div
  const activeDiv = colorDivs[index];
  // Set it in chroma
  const color = chroma(activeDiv.style.backgroundColor);
  // Get the h2
  const textHex = activeDiv.querySelector('h2');
  // Get the icons
  const icons = activeDiv.querySelectorAll('.controls button');
  // set the innertext
  textHex.innerText = color.hex();
  // check contrast for text
  checkTextContrast(color, textHex);
  // check contrast for icon
  for (icon of icons) {
    checkTextContrast(color, icon);
  }
}

// 3) Call the functions

randomColors();
