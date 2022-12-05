document.addEventListener('DOMContentLoaded', () => {
  var swiper = new Swiper('.cards', {
    init: false,
    wrapperClass: 'cards__wrap',
    slideClass: 'card',
    slideActiveClass: 'active',
    pagination: {
      el: '.cards__pagination',
      type: 'bullets',
      bulletClass: 'card__bullet',
      bulletActiveClass: 'active',
      clickable: true,
    },
  });
});
