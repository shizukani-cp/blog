function show_date(date_number) {
  const date_string = date_number.toString();
  const year = date_string.substring(0, 4);
  const month = date_string.substring(4, 6);
  const day = date_string.substring(6, 8);
  const formatted_date = `${year}年${month}月${day}日`;
  const date_element = document.createElement("span");
  date_element.appendChild(document.createTextNode(formatted_date));
  date_element.setAttribute("class", "date-right");
  document.querySelector("main").prepend(date_element);
}
