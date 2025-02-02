const main = document.querySelector("main");

const date_re = new RegExp("(?<=/articles/)\\d{8}(?=/)");
const date = parseInt(location.pathname.match(date_re)[0]);

const entry_index = articles.findIndex((e) => { return e.date === date; });

{
  const back_button = document.createElement("button");
  back_button.setAttribute("class", "button back-next");
  back_button.setAttribute("id", "back");
  back_button.appendChild(document.createTextNode("前の記事"));
  let index = entry_index - 1;
  if (index === -1) { index = articles.length - 1; }
  back_button.onclick = () => {
    location.href = `../${articles[index].date}/`;
  };
  main.appendChild(back_button);
}

{
  const next_button = document.createElement("button");
  next_button.setAttribute("class", "button back-next");
  next_button.setAttribute("id", "next");
  next_button.appendChild(document.createTextNode("次の記事"));
  let index = (entry_index + 1) % articles.length;
  next_button.onclick = () => {
    location.href = `../${articles[index].date}/`;
  };
  main.appendChild(next_button);
}
