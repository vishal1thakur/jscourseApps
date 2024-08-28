import chroma from "chroma-js";
import { colorizeSliders, checkTextContrast } from "./colorUtils";

export const hslControls = (e, initialColors) => {
    const index =
        e.target.getAttribute("data-bright") ||
        e.target.getAttribute("data-sat") ||
        e.target.getAttribute("data-hue");

    const sliders = e.target.parentElement.querySelectorAll(
        'input[type="range"]'
    );
    const [hue, brightness, saturation] = sliders;

    const bgColor = initialColors[index];

    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);

    return { color, index };
};

export const updateTextUI = (index, elements, color) => {
    const { colorDivs } = elements;
    const activeDiv = colorDivs[index];
    const textHex = activeDiv.querySelector("h2");
    const icons = activeDiv.querySelectorAll(".controls button");

    textHex.innerText = color.hex();
    checkTextContrast(color, textHex);
    icons.forEach((icon) => checkTextContrast(color, icon));
};

export const resetInputs = (sliders, initialColors) => {
    sliders.forEach((slider) => {
        if (slider.name === "hue") {
            const hueColor = initialColors[slider.getAttribute("data-hue")];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if (slider.name === "brightness") {
            const brightColor =
                initialColors[slider.getAttribute("data-bright")];
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue * 100) / 100;
        }
        if (slider.name === "saturation") {
            const satColor = initialColors[slider.getAttribute("data-sat")];
            const satValue = chroma(satColor).hsl()[1];
            slider.value = Math.floor(satValue * 100) / 100;
        }
    });
};
