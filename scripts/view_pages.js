
const contents = [
    {
        title:"自己紹介",
        date:"20240803"
    },
    {
        title:"githubにpushしようとしたらできなかった話",
        date:"20240807"
    },
    {
        title:"ブログのやり方で結構迷走してたからそれをまとめる",
        date:"20240816"
    },
    {
        title:"CLI環境に移ってきた",
        date:"20240925"
    },
    {
        title:"自然言語処理に役立ちたい",
        date:"20241113"
    }
];

function formatDate(date) {
    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(4, 6), 10);
    const day = parseInt(date.substring(6, 8), 10);
    const paddedMonth = month.toString().padStart(2, '0');
    const paddedDay = day.toString().padStart(2, '0');
    
    return `    ${year}年${paddedMonth}月${paddedDay}日`;
}

window.onload = () => {
    const pages_element = document.getElementById("pages");
    contents.reverse().forEach((content) => {
        const content_title_element = document.createElement("h3");
        const content_date_element = document.createElement("small");
        const content_link_element = document.createElement("a");
        content_link_element.setAttribute("href", `contents/${content.date}/entry.html`);
        content_title_element.appendChild(document.createTextNode(content.title));
        content_title_element.setAttribute("style", "font-size: 3rem;");
        content_link_element.appendChild(content_title_element);
        content_date_element.appendChild(document.createTextNode(formatDate(content.date)));
        content_date_element.setAttribute("style", "color: #e0e0e0;");
        content_title_element.appendChild(content_date_element);
        pages_element.appendChild(content_link_element);
    });
};
