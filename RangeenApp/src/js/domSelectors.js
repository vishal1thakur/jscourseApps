export const getElements = () => ({
    colorDivs: document.querySelectorAll(".color"),
    generateBtn: document.querySelector(".generate"),
    sliders: document.querySelectorAll('input[type="range"]'),
    currentHexes: document.querySelectorAll(".color h2"),
    popup: document.querySelector(".copy-container"),
    adjustButton: document.querySelectorAll(".adjust"),
    lockButton: document.querySelectorAll(".lock"),
    closeAdjustments: document.querySelectorAll(".close-adjustment"),
    sliderContainers: document.querySelectorAll(".sliders"),
});
