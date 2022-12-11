document.addEventListener('DOMContentLoaded', () => {
  let clocks = document.querySelectorAll('[data-clock]');
  // console.log(clocks);

  clocks.forEach(clock => {
    switch (clock.getAttribute('data-clock')) {
      case 'NY':
        fetch_time('America/New_York', clock);
        break;
      case 'GR':
        fetch_time('Europe/Athens', clock);
        break;
      default:
    }
  });

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
  let accordionItems = accordion ? accordion.querySelectorAll('.accordion__item') : [];

  accordionItems.forEach(item => {
    item.addEventListener('click', e => {
      let target = e.target;
      if (target.closest('.accordion__content li')) {
        let trigger = target.closest('.accordion__content li');
        toggle_position(item.querySelectorAll('.position'), trigger.getAttribute('data-trigger'));
        return;
      }

      toggle_accordion(item, accordionItems);
    });
  });

  function toggle_accordion(target, items) {
    console.log('toggle_accordion');

    items.forEach(item => {
      if (item.isSameNode(target)) {
        console.log('---is same node');
        if (item.classList.contains('active')) {
          console.log('is active');
          item.classList.remove('active');
          item.querySelector('.accordion__body').style.removeProperty('height');
          toggle_position(item.querySelectorAll('.position'));
          // target.querySelector('.accordion__body').style.setProperty('height', `${target.querySelector('.accordion__content').scrollHeight}px`);
        } else {
          console.log('is not active', item);
          item.classList.add('active');
          // item.querySelector('.accordion__body').style.removeProperty('height');
          item.querySelector('.accordion__body').style.setProperty('height', `${target.querySelector('.accordion__content').scrollHeight}px`);
          //
        }
      } else {
        console.log('---is NOT same node');
        item.classList.remove('active');
        item.querySelector('.accordion__body').style.removeProperty('height');
        toggle_position(item.querySelectorAll('.position'));
      }
    });
  }

  function toggle_position(articles, pos = null) {
    console.log('toggle_position');
    if (pos) {
      articles.forEach(article => {
        if (article.getAttribute('data-position') === pos) {
          article.classList.toggle('open');
        } else {
          article.classList.remove('open');
        }
      });
    } else {
      articles.forEach(article => article.classList.remove('open'));
    }
  }

  function fetch_time(path, clock) {
    axios
      .get('http://worldtimeapi.org/api/timezone/' + path)
      .then(res => {
        // let time = new Date(res.data.unixtime * 1000);
        let time = new Date(res.data.datetime);
        console.log(time);
        console.log(time.getTimezoneOffset());

        clock.innerHTML = format_time(time);
        setInterval(() => {
          time.setSeconds(time.getSeconds() + 60);
          clock.innerHTML = format_time(time);
          console.log(format_time(time));
        }, 1000 * 60);
      })
      .catch(err => console.error(err));
  }

  function format_time(time) {
    let hours = time.getHours();
    let minutes = '0' + time.getMinutes();
    return `${hours}:${minutes.substr(-2)}`;
  }

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
