document.addEventListener('DOMContentLoaded', () => {
  let screenWidth = window.innerWidth;

  let homeCards = document.querySelector('.js-service-cards');

  homeCards = new Swiper('.cards', {
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
