let screenWidth = window.innerWidth;

let target = {};
let proxy = new Proxy(target, {}); // empty handler

console.log(proxy);
proxy.test = 5; // writing to proxy (1)
console.log(proxy); // 5, the property appeared in target!

console.log(proxy); // 5, we can read it from proxy too (2)

for (let key in proxy) console.log(key);

document.addEventListener('DOMContentLoaded', () => {
  // Global
  const burger = document.querySelector('.js-burger');
  const menu = document.querySelector('.js-menu');

  // Services
  let serviceCards = document.querySelector('.js-service-cards');

  burger.addEventListener('click', () => menu.classList.toggle('active'));

  if (serviceCards && screenWidth <= 360) {
    service_cards.create();
  }

  window.addEventListener('resize', () => {
    screenWidth = window.innerWidth;
  });

  const service_cards = {
    create: () => {},
    destroy: () => {},
  };
});

// let homeCards = document.querySelector('.js-service-cards');

// homeCards = new Swiper('.cards', {
//   init: false,
//   wrapperClass: 'cards__wrap',
//   slideClass: 'card',
//   slideActiveClass: 'active',
//   pagination: {
//     el: '.cards__pagination',
//     type: 'bullets',
//     bulletClass: 'card__bullet',
//     bulletActiveClass: 'active',
//     clickable: true,
//   },
// });

// if (serviceCards.classList.contains('cards--default')) {
//   // serviceCards.classList.remove('cards--default');
//   // serviceCardsSlider = new Swiper('.cards', {
//   //   init: true,
//   //   wrapperClass: 'cards__wrap',
//   //   slideClass: 'card',
//   //   slideActiveClass: 'active',
//   //   pagination: {
//   //     el: '.cards__pagination',
//   //     type: 'bullets',
//   //     bulletClass: 'card__bullet',
//   //     bulletActiveClass: 'active',
//   //     clickable: true,
//   //   },
//   // });

//   // console.log(serviceCards?.$el?.[0]);
// }
