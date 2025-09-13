function formatDate(date) {
  date = date.toString();
  const year = parseInt(date.substring(0, 4), 10);
  const month = parseInt(date.substring(4, 6), 10);
  const day = parseInt(date.substring(6, 8), 10);
  const paddedMonth = month.toString().padStart(2, "0");
  const paddedDay = day.toString().padStart(2, "0");

  return `${year}年${paddedMonth}月${paddedDay}日`;
}

window.onload = () => {
  const pages_element = document.getElementById("pages");
  Array.from(articles).reverse().forEach((content) => {
    const content_link_element = document.createElement("a");
    content_link_element.setAttribute("href", `articles/${content.date}/`);
    content_link_element.setAttribute("class", "card");
    content_link_element.onmouseover = () =>
      (content_link_element.style.background = "#2a2a2a");
    content_link_element.onmouseout = () =>
      (content_link_element.style.background = "#1e1e1e");

    // タイトル
    const content_title_element = document.createElement("h3");
    content_title_element.textContent = content.title;
    content_title_element.setAttribute(
      "style",
      "font-size: 1.8rem; margin: 0 0 8px 0;"
    );

    // 説明文
    const content_desc_element = document.createElement("p");
    content_desc_element.textContent = content.description || "";
    content_desc_element.setAttribute(
      "style",
      "color: #c0c0c0; font-size: 1rem; margin: 0 0 12px 0;"
    );

    // 日付
    const content_date_element = document.createElement("small");
    content_date_element.textContent = formatDate(content.date);
    content_date_element.setAttribute("style", "color: #a0a0a0;");

    // カードに追加
    content_link_element.appendChild(content_title_element);
    content_link_element.appendChild(content_desc_element);
    content_link_element.appendChild(content_date_element);

    pages_element.appendChild(content_link_element);
  });
};

