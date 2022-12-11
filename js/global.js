document.addEventListener('DOMContentLoaded', () => {
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
  let clocks = document.querySelectorAll('[data-clock]');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
  });

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

  if (verticalTeasers.el) watch_carousel(verticalTeasers, 360, carousel_vertical_teasers);
  if (valueTeasers.el) watch_carousel(valueTeasers, 360, carousel_values);
  if (personas.el) watch_carousel(personas, 528, carousel_personas);

  window.addEventListener('resize', () => {
    screenWidth = window.innerWidth;
    if (verticalTeasers.el) watch_carousel(verticalTeasers, 360, carousel_vertical_teasers);
    if (valueTeasers.el) watch_carousel(valueTeasers, 360, carousel_values);
    if (personas.el) watch_carousel(personas, 528, carousel_personas);
  });

  function watch_carousel(el, screenPoint, callback) {
    if (screenWidth <= screenPoint) {
      if (!!!el.slider || el.slider?.destroyed) callback();
    } else {
      if (el.slider?.enabled) el.slider.destroy(true, true);
    }
  }

  function carousel_personas() {
    personas.slider = new Swiper('.js-personas', {
      slidesPerView: 'auto',
      centeredSlides: true,
      wrapperClass: 'split',
      slideClass: 'split__part',
      slideActiveClass: 'active',
    });
  }

  function toggle_accordion(target, items) {
    items.forEach(item => {
      if (item.isSameNode(target)) {
        if (item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.accordion__body').style.removeProperty('height');
          toggle_position(item.querySelectorAll('.position'));
        } else {
          item.classList.add('active');
          item.querySelector('.accordion__body').style.setProperty('height', `${target.querySelector('.accordion__content').scrollHeight}px`);
        }
      } else {
        item.classList.remove('active');
        item.querySelector('.accordion__body').style.removeProperty('height');
        toggle_position(item.querySelectorAll('.position'));
      }
    });
  }

  function toggle_position(articles, pos = null) {
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

  function carousel_vertical_teasers() {
    verticalTeasers.slider = new Swiper('.js-vertical-teasers', {
      init: true,
      wrapperClass: 'split',
      slideClass: 'vertical-teaser',
      slideActiveClass: 'active',
      pagination: {
        el: '.pagination--vertical-teasers',
        type: 'bullets',
        bulletClass: 'pagination__bullet',
        bulletActiveClass: 'active',
        clickable: true,
      },
    });
  }

  function carousel_values() {
    valueTeasers.slider = new Swiper('.js-values', {
      // autoHeight: true,
      // setWrapperSize: true,
      wrapperClass: 'values__list',
      slideClass: 'values__item',
      slideActiveClass: 'active',
      pagination: {
        el: '.pagination--values',
        type: 'bullets',
        bulletClass: 'pagination__bullet',
        bulletActiveClass: 'active',
        clickable: true,
      },
    });
  }
});
