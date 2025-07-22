const LEVEL_AND_SIZE = {
    1:25,
    2:20,
    3:15,
    4:12,
    5:10,
    6:8
}
const SIDEBAR_ELEMENT = document.getElementById("index");

for (let element of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    const level = element.tagName[1];
    element.setAttribute("id", element.innerText);
    const index_element = document.createElement("p");
    index_element.setAttribute("style", `font-size: ${LEVEL_AND_SIZE[level]/13}rem;`);
    const link_element = document.createElement("a");
    link_element.appendChild(document.createTextNode(element.innerText));
    link_element.setAttribute("class", "index");
    link_element.setAttribute("href", `#${element.innerText}`);
    index_element.appendChild(link_element);
    SIDEBAR_ELEMENT.appendChild(index_element);
}
