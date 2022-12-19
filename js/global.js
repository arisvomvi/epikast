document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.js-burger');
  const menu = document.querySelector('.js-menu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
  });

  if (document.querySelector('.js-personas')) new Personas('.js-personas');
  if (document.querySelector('.js-vertical-teasers')) new VerticalTeasers('.js-vertical-teasers');
  if (document.querySelector('.js-values')) new Values('.js-values');
  if (document.querySelector('.js-accordion')) new Accordion('.js-accordion');
  if (document.querySelectorAll('[data-clock]').length) new Clocks('[data-clock]');
});

class Personas {
  constructor(selector) {
    this.selector = selector;
    this.el = document.querySelector(selector);
    this.personas = this.el.querySelectorAll('.persona');
    this.carousel = null;
    this.parent = this.el.closest('.personas__wrap');
    this.breakPoint = 528;
    this.init();
  }
  init() {
    this.watch_carousel();

    window.addEventListener('resize', () => this.watch_carousel());

    this.personas.forEach((persona, index) => {
      persona.addEventListener('click', e => {
        persona.classList.toggle('open');
        if (window.innerWidth <= this.breakPoint) {
          this.carousel.slideTo(index);
        }
        persona.querySelector('.persona__bio').addEventListener('click', e => e.stopPropagation());
      });
    });
  }
  watch_carousel() {
    if (window.innerWidth <= this.breakPoint) {
      if (!!!this.carousel || this.carousel?.destroyed) this.create_carousel();
    } else {
      if (this.carousel?.enabled) this.carousel.destroy(true, true);
    }
  }
  create_carousel() {
    this.carousel = new Swiper(this.selector, {
      slidesPerView: 'auto',
      centeredSlides: true,
      wrapperClass: 'split',
      slideClass: 'split__part',
      slideActiveClass: 'active',
    });
  }
}
class VerticalTeasers {
  constructor(selector) {
    this.selector = selector;
    this.el = document.querySelector(selector);
    this.carousel = null;
    this.init();
  }
  init() {
    this.watch_carousel();

    window.addEventListener('resize', () => this.watch_carousel());
  }
  watch_carousel() {
    if (window.innerWidth <= 360) {
      if (!!!this.carousel || this.carousel?.destroyed) this.create_carousel();
    } else {
      if (this.carousel?.enabled) this.carousel.destroy(true, true);
    }
  }
  create_carousel() {
    this.carousel = new Swiper(this.selector, {
      init: true,
      autoHeight: true,
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
}
class Values {
  constructor(selector) {
    this.selector = selector;
    this.el = document.querySelector(selector);
    this.carousel = null;
    this.init();
  }
  init() {
    this.watch_carousel();

    window.addEventListener('resize', () => this.watch_carousel());
  }
  watch_carousel() {
    if (window.innerWidth <= 360) {
      if (!!!this.carousel || this.carousel?.destroyed) this.create_carousel();
    } else {
      if (this.carousel?.enabled) this.carousel.destroy(true, true);
    }
  }
  create_carousel() {
    this.carousel = new Swiper(this.selector, {
      autoHeight: true,
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
}
class Clocks {
  constructor(selector) {
    this.selector = selector;
    this.clocks = document.querySelectorAll(selector);
    this.init();
  }
  init() {
    this.clocks.forEach(clock => {
      switch (clock.getAttribute('data-clock')) {
        case 'NY':
          this.get_time('America/New_York', clock);
          break;
        case 'GR':
          this.get_time('Europe/Athens', clock);
          break;
        default:
      }
    });
  }
  get_time(path, clock) {
    axios
      .get('http://worldtimeapi.org/api/timezone/' + path)
      .then(res => {
        // let time = new Date(res.data.unixtime * 1000);
        let time = new Date(res.data.datetime);
        console.log(time);
        console.log(time.getTimezoneOffset());

        clock.innerHTML = this.format_time(time);
        setInterval(() => {
          time.setSeconds(time.getSeconds() + 60);
          clock.innerHTML = this.format_time(time);
          console.log(this.format_time(time));
        }, 1000 * 60);
      })
      .catch(err => console.error(err));
  }
  format_time(time) {
    let hours = time.getHours();
    let minutes = '0' + time.getMinutes();
    return `${hours}:${minutes.substr(-2)}`;
  }
}
class Accordion {
  constructor(selector) {
    this.selector = selector;
    this.accordion = document.querySelector(this.selector);
    this.items = this.accordion.querySelectorAll('.accordion__item');
    this.activePosition = null;
    this.init();
  }
  init() {
    this.items.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (index == this.activePosition) {
          this.close_item(item);
          this.activePosition = null;
        } else {
          if (this.activePosition == null) {
            this.activePosition = index;
            this.open_item(item);
          } else {
            this.close_item(this.items[this.activePosition]);
            this.activePosition = index;
            this.open_item(item);
          }
        }
      });

      item.querySelectorAll('[data-trigger]').forEach(trigger => {
        trigger.addEventListener('click', e => {
          e.stopPropagation();
          let triggerPosition = trigger.getAttribute('data-trigger');
          item.querySelector(`[data-position="${triggerPosition}"]`).classList.add('open');
        });
      });

      item.querySelectorAll('[data-position]').forEach(position => {
        position.addEventListener('click', e => {
          e.stopPropagation();
          if (e.target.isSameNode(position)) position.classList.remove('open');
        });
        position.querySelector('.position__close').addEventListener('click', () => position.classList.remove('open'));
      });
    });

    window.addEventListener('resize', () => {
      if (this.activePosition != null) {
        this.activePosition = null;
        this.items.forEach(item => {
          item.classList.remove('active');
          item.querySelector('.accordion__body').style.removeProperty('height');
          item.querySelectorAll('[data-position]').forEach(position => position.classList.remove('open'));
        });
      }
    });
  }
  open_item(item) {
    item.classList.add('active');
    let itemBody = item.querySelector('.accordion__body');
    let height = itemBody.querySelector('.accordion__content').scrollHeight;
    itemBody.style.setProperty('height', `${height}px`);
  }
  close_item(item) {
    item.classList.remove('active');
    item.querySelector('.accordion__body').style.removeProperty('height');
  }
}
