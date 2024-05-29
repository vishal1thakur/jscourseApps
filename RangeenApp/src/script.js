// 0) Global selection and variables
// 0.1) General interactions
import "./style.css";
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const lockButton = document.querySelectorAll(".lock");
const adjustButton = document.querySelectorAll(".adjust");
const closeAdjustments = document.querySelectorAll(".close-adjustment");
const sliderContainers = document.querySelectorAll(".sliders");
let initialColors;

// 0.2) Local Storage
let savedPalettes = [];
const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const libraryContainer = document.querySelector(".library-container");
const libraryBtn = document.querySelector(".library");
const closeLibraryBtn = document.querySelector(".close-library");

// 1) Event Listeners
// 1.1) HSB Sliders
sliders.forEach((slider) => {
    slider.addEventListener("input", hslControls);
});

// 1.2) Change text with slider values
colorDivs.forEach((div, index) => {
    div.addEventListener("change", () => {
        updateTextUI(index);
    });
});

// 1.3) Copy to clipbaord on clicking text
currentHexes.forEach((hex) => {
    hex.addEventListener("click", () => {
        copyToClipboard(hex);
    });
});

// 1.4) Close popup animation ater finishing transition
popup.addEventListener("transitionend", () => {
    // select child
    const popupBox = popup.children[0];
    // remove the class
    popup.classList.remove("active");
    popupBox.classList.remove("active");
});

// 1.5) Adjust the HSB of the color
adjustButton.forEach((button, index) => {
    button.addEventListener("click", () => {
        openAdjustmentPanel(index);
    });
});

// 1.6) Close HSB panel
closeAdjustments.forEach((button, index) => {
    button.addEventListener("click", () => {
        closeAdjustmentPanel(index);
    });
});

// 1.7) Generate colors
generateBtn.addEventListener("click", randomColors);

// 1.8) Lock feature
lockButton.forEach((button, index) => {
    button.addEventListener("click", (e) => {
        lockLayer(e, index);
    });
});

// 1.9) Save palette
saveBtn.addEventListener("click", openPalette);

// 1.10) Close palette
closeSave.addEventListener("click", closePalette);

// 1.11) Submit save
submitSave.addEventListener("click", savePalette);

// 1.12) Open library
libraryBtn.addEventListener("click", openLibrary);

// 1.13) Close library
closeLibraryBtn.addEventListener("click", closeLibrary);

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
    initialColors = [];
    // Set the colors
    colorDivs.forEach((div, index) => {
        // Select the h2 of the div
        const hexText = div.children[0];
        // Generate a random hex
        const randomColor = generateHex();

        // Add the color to the array
        if (div.classList.contains("locked")) {
            // if the color is locked
            initialColors.push(hexText.innerText);
            return;
        } else {
            // if the color is not locked, create new
            initialColors.push(chroma(randomColor).hex());
        }

        // Add it to the text
        hexText.innerText = randomColor;
        // Add it to the bg
        div.style.backgroundColor = randomColor;

        // Check for contrast - 2.3)
        checkTextContrast(randomColor, hexText);
        // Initialize colorize sliders
        const color = chroma(randomColor);
        // Get all the sliders in a nodelist
        const sliders = div.querySelectorAll(".sliders input");
        // Seperate the sliders
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        // Get scale for sliders matching the bg - 2.4)
        colorizeSliders(color, hue, brightness, saturation);
    });
    // Reset Inputs
    resetInputs();
    // Check for button contrast
    adjustButton.forEach((button, index) => {
        checkTextContrast(initialColors[index], button);
        checkTextContrast(initialColors[index], lockButton[index]);
    });
}

// 2.3) Check contrast of bg and change color of h2

function checkTextContrast(color, text) {
    const luminance = chroma(color).luminance();
    if (luminance > 0.5) {
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}

// 2.4) Get scale for sliders matching the bg

function colorizeSliders(color, hue, brightness, saturation) {
    // Saturation
    // Getting the min and max saturation of the color
    //min
    const noSat = color.set("hsl.s", 0);
    //max
    const fullSat = color.set("hsl.s", 1);
    //create scale
    const scaleSat = chroma.scale([noSat, color, fullSat]);

    // Brightness
    // Getting the mid brightness
    //min
    const midBright = color.set("hsl.l", 0.5);
    //create scale
    const scaleBright = chroma.scale(["black", midBright, "white"]);

    //Sat
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
        0
    )}, ${scaleSat(1)})`;

    //Bright
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
        0
    )}, ${scaleBright(0.5)} , ${scaleBright(1)})`;

    //Hue
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

// 2.5) Change bg with hsb - 1.1
function hslControls(e) {
    //Get the specify color on which the hsb is being clicked
    const index =
        e.target.getAttribute("data-bright") ||
        e.target.getAttribute("data-sat") ||
        e.target.getAttribute("data-hue");

    // Get all three values when clicked on any one
    let sliders = e.target.parentElement.querySelectorAll('input[type="range"');
    // Get individual one
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    // Get hex text of the bg
    const bgColor = initialColors[index];

    // Change color
    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);

    // Assign it to bg
    colorDivs[index].style.backgroundColor = color;

    //Colorize inputs/sliders
    colorizeSliders(color, hue, brightness, saturation);
}

// 2.6) Update text of the color div - 1.2
function updateTextUI(index) {
    // Get the active div
    const activeDiv = colorDivs[index];
    // Set it in chroma
    const color = chroma(activeDiv.style.backgroundColor);
    // Get the h2
    const textHex = activeDiv.querySelector("h2");
    // Get the icons
    const icons = activeDiv.querySelectorAll(".controls button");
    // set the innertext
    textHex.innerText = color.hex();
    // check contrast for text
    checkTextContrast(color, textHex);
    // check contrast for icon
    for (icon of icons) {
        checkTextContrast(color, icon);
    }
}

// 2.7) Reset initial color
function resetInputs() {
    // get all the sliders
    const sliders = document.querySelectorAll(".sliders input");
    // loop through each
    sliders.forEach((slider) => {
        if (slider.name === "hue") {
            // get the specific hue
            const hueColor = initialColors[slider.getAttribute("data-hue")];
            // assign it to chroma
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if (slider.name === "brightness") {
            // get the specific hue
            const brightColor =
                initialColors[slider.getAttribute("data-bright")];
            // assign it to chroma
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100;
        }
        if (slider.name === "saturation") {
            // get the specific saturation
            const satColor = initialColors[slider.getAttribute("data-sat")];
            // assign it to chroma
            const satValue = chroma(satColor).hsl()[1];
            slider.value = satValue;
        }
    });
}

// 2.8) Copy hexcode to clipbaord
function copyToClipboard(hex) {
    // create a psuedo element to copy - a textarea on hex
    const el = document.createElement("textarea");
    // give it the value of hex
    el.value = hex.innerText;
    // append to body
    document.body.appendChild(el);
    // select it
    el.select();
    // copy it
    document.execCommand("copy");
    // remove it
    document.body.removeChild(el);

    // Pop up animation
    // select child
    const popupBox = popup.children[0];
    // add class
    popup.classList.add("active");
    popupBox.classList.add("active");
}

// 2.9) Open HSB panel
function openAdjustmentPanel(index) {
    sliderContainers[index].classList.toggle("active");
}

// 2.10) Close HSB panel
function closeAdjustmentPanel(index) {
    sliderContainers[index].classList.remove("active");
}

// 2.11) Lock Feature
function lockLayer(e, index) {
    // select element
    const lockSVG = e.target.children[0];
    const activeBg = colorDivs[index];
    // add locked class on the bg
    activeBg.classList.toggle("locked");
    // change the icon
    if (lockSVG.classList.contains("fa-lock-open")) {
        e.target.innerHTML = '<i class="fas fa-lock"></i>';
    } else {
        e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
    }
}

// 2.12) Save palette
function openPalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.add("active");
    popup.classList.add("active");
}

// 2.13) Close palette
function closePalette(e) {
    const popup = saveContainer.children[0];
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
}

// 2.14) Save to ls
function savetoLocal(paletteObj) {
    let localPalettes;
    if (localStorage.getItem("palettes") === null) {
        localPalettes = [];
    } else {
        localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

// 2.15) Save palette
function savePalette(e) {
    // hide the save popup
    saveContainer.classList.remove("active");
    popup.classList.remove("active");
    // get the name input
    const name = saveInput.value;
    // create an empty store
    const colors = [];
    // push the current color hexes to the empty store
    currentHexes.forEach((hex) => {
        colors.push(hex.innerText);
    });
    // Generate object
    let paletteNr;
    // Get the saved data from ls
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    // Make the new entry the latest number, so that the placement is not disturbed
    if (paletteObjects) {
        paletteNr = paletteObjects.length;
    } else {
        paletteNr = savedPalettes.length;
    }
    // create new entry
    const paletteObj = { name, colors, nr: paletteNr };
    // push new entry
    savedPalettes.push(paletteObj);
    // save to ls
    savetoLocal(paletteObj);
    // clear input field
    saveInput.value = "";
    // generate palette for library
    // html css for the library entry
    const palette = document.createElement("div");
    palette.classList.add("custom-palette");
    const title = document.createElement("h4");
    title.innerText = paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add("small-preview");
    paletteObj.colors.forEach((smallColor) => {
        const smallDiv = document.createElement("div");
        smallDiv.style.backgroundColor = smallColor;
        preview.appendChild(smallDiv);
    });
    const paletteBtn = document.createElement("button");
    paletteBtn.classList.add("pick-palette-btn");
    paletteBtn.classList.add(paletteObj.nr);
    paletteBtn.innerText = "select";

    // attach event to the btn
    paletteBtn.addEventListener("click", (e) => {
        // close library ui
        closeLibrary();
        // select the entry
        const paletteIndex = e.target.classList[1];
        // reset the colors
        initialColors = [];
        // loop through the colors and display
        savedPalettes[paletteIndex].colors.forEach((color, index) => {
            initialColors.push(color);
            colorDivs[index].style.backgroundColor = color;
            const text = colorDivs[index].children[0];
            checkTextContrast(color, text);
            updateTextUI(index);
        });
        resetInputs();
    });

    // append to the library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.children[0].appendChild(palette);
}

// 2.16) Open library
function openLibrary() {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.add("active");
    popup.classList.add("active");
}

// 2.17) Close library
function closeLibrary() {
    const popup = libraryContainer.children[0];
    libraryContainer.classList.remove("active");
    popup.classList.remove("active");
}

// 2.18) Get data from LS
function getLocal() {
    // get data from ls
    let localPalettes;
    if (localStorage.getItem("palettes") === null) {
        localPalettes = [];
    } else {
        const paletteObjects = JSON.parse(localStorage.getItem("palettes"));

        // copy saved palettes
        savedPalettes = [...paletteObjects];
        // loop through all entries
        paletteObjects.forEach((paletteObj) => {
            // generate palette for library
            const palette = document.createElement("div");
            palette.classList.add("custom-palette");
            const title = document.createElement("h4");
            title.innerText = paletteObj.name;
            const preview = document.createElement("div");
            preview.classList.add("small-preview");
            paletteObj.colors.forEach((smallColor) => {
                const smallDiv = document.createElement("div");
                smallDiv.style.backgroundColor = smallColor;
                preview.appendChild(smallDiv);
            });
            const paletteBtn = document.createElement("button");
            paletteBtn.classList.add("pick-palette-btn");
            paletteBtn.classList.add(paletteObj.nr);
            paletteBtn.innerText = "select";

            // attach event to the btn
            paletteBtn.addEventListener("click", (e) => {
                closeLibrary();
                const paletteIndex = e.target.classList[1];
                initialColors = [];
                paletteObjects[paletteIndex].colors.forEach((color, index) => {
                    initialColors.push(color);
                    colorDivs[index].style.backgroundColor = color;
                    const text = colorDivs[index].children[0];
                    checkTextContrast(color, text);
                    updateTextUI(index);
                });
                resetInputs();
            });

            // append to the library
            palette.appendChild(title);
            palette.appendChild(preview);
            palette.appendChild(paletteBtn);
            libraryContainer.children[0].appendChild(palette);
        });
    }
}

// 3) Call the functions

getLocal();
randomColors();

// 4) Webpack integration

const loadVanillaApp = () => {
    const app = document.getElementById("app");
    app.innerHTML = "<h1>Hello, Vanilla JS App!</h1>";
};

// Automatically load the app on DOMContentLoaded
document.addEventListener("DOMContentLoaded", loadVanillaApp);

// Export the function for Module Federation
export default loadVanillaApp;
