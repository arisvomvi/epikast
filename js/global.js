document.addEventListener('DOMContentLoaded', () => {
  // Global
  const burger = document.querySelector('.js-burger');
  const menu = document.querySelector('.js-menu');
  let screenWidth = window.innerWidth;
  let verticalTeasers = {
    el: document.querySelector('.js-vertical-teasers'),
    slider: null,
  };
  let valueTeasers = {
    el: document.querySelector('.js-values'),
    slider: null,
  };
  let personas = {
    el: document.querySelector('.js-personas'),
    slider: null,
  };
  let accordion = document.querySelector('.js-accordion');
  let accordionItems = document.querySelectorAll('.js-accordion-item');

  // let x = document.querySelectorAll('.js-position-list');
  // let y = document.querySelectorAll('.js-position-item');

  // x.forEach(el => {
  //   el.addEventListener('click', z => {
  //     console.log(z.scrollHeight);
  //   });
  //   // console.log(el.offsetHeight);
  //   // x.style.maxHeight = x.scrollHeight + "px";
  // });

  // y.forEach(el => {
  //   el.addEventListener('click', e => {
  //     e.stopPropagation();
  //     console.log('asd');
  //   });
  // });

  // let o = document.querySelector('.position__wrap');
  // console.log(o.scrollHeight);

  let x = document.querySelector('.js-position-list');
  console.log(x.scrollHeight);
  console.log(x);

  accordionItems.forEach(item => {
    item.addEventListener('click', e => {
      accordionItems.forEach(item => {
        // console.log(item.scrollHeight);
        if (e.target.closest('.js-accordion-item').isSameNode(item)) {
          item.classList.toggle('active');
        } else {
          item.classList.remove('active');
        }
      });
    });
  });

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
  });

  if (verticalTeasers.el) check_vertical_teasers();
  if (valueTeasers.el) check_value_teasers();
  if (personas.el) check_personas();

  window.addEventListener('resize', () => {
    screenWidth = window.innerWidth;
    if (verticalTeasers.el) check_vertical_teasers();
    if (valueTeasers.el) check_value_teasers();
    if (personas.el) check_personas();
  });

  function check_personas() {
    if (screenWidth <= 528) {
      if (!!!personas.slider || personas.slider?.destroyed) carousel_personas();
    } else {
      if (personas.slider?.enabled) personas.slider.destroy(true, true);
    }
  }
  function carousel_personas() {
    console.log('carousel_personas');
    personas.slider = new Swiper('.js-personas', {
      slidesPerView: 'auto',
      // spaceBetween: 24,
      centeredSlides: true,
      // centeredSlidesBounds: true,
      // loopAdditionalSlides: 2,
      // loop: true,
      // rewind: true,
      // pagination: {
      //   el: ".swiper-pagination",
      //   clickable: true,
      // },

      // init: true,
      // autoHeight: true,
      wrapperClass: 'split',
      slideClass: 'split__part',
      slideActiveClass: 'active',
      pagination: {
        el: '.pagination',
        type: 'bullets',
        bulletClass: 'pagination__bullet',
        bulletActiveClass: 'active',
        clickable: true,
      },
    });
  }

  function check_vertical_teasers() {
    if (screenWidth <= 360) {
      if (!!!verticalTeasers.slider || verticalTeasers.slider?.destroyed) carousel_vertical_teasers();
    } else {
      if (verticalTeasers.slider?.enabled) verticalTeasers.slider.destroy(true, true);
    }
  }

  function carousel_vertical_teasers() {
    console.log('carousel_vertical_teasers');
    verticalTeasers.slider = new Swiper('.js-vertical-teasers', {
      init: true,
      wrapperClass: 'split',
      slideClass: 'vertical-teaser',
      slideActiveClass: 'active',
      pagination: {
        el: '.pagination',
        type: 'bullets',
        bulletClass: 'pagination__bullet',
        bulletActiveClass: 'active',
        clickable: true,
      },
    });
  }

  function carousel_values() {
    console.log('carousel_values');
    valueTeasers.slider = new Swiper('.js-values', {
      // init: true,
      // autoHeight: true,
      wrapperClass: 'split',
      slideClass: 'split__part',
      slideActiveClass: 'active',
      pagination: {
        el: '.pagination',
        type: 'bullets',
        bulletClass: 'pagination__bullet',
        bulletActiveClass: 'active',
        clickable: true,
      },
    });
  }

  function check_value_teasers() {
    if (screenWidth <= 360) {
      if (!!!valueTeasers.slider || valueTeasers.slider?.destroyed) carousel_values();
    } else {
      if (valueTeasers.slider?.enabled) valueTeasers.slider.destroy(true, true);
    }
  }
});
