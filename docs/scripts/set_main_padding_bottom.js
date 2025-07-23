document.addEventListener('DOMContentLoaded', function() {
  adjustMainPadding();
});

window.addEventListener('resize', function() {
  adjustMainPadding();
});

function adjustMainPadding() {
  const footer = document.querySelector('footer');
  const main = document.querySelector('main');

  if (footer && main) {
    const footerHeight = footer.offsetHeight;
    main.style.paddingBottom = footerHeight + 'px';
  }
}
