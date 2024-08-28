export const copyToClipboard = (hex, popup) => {
    const el = document.createElement("textarea");
    el.value = hex.innerText;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);

    const popupBox = popup.children[0];
    popup.classList.add("active");
    popupBox.classList.add("active");
};
