document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.js-burger');
  const menu = document.querySelector('.js-menu');
  const copyYear = document.querySelector('.js-copy-year');

  copyYear ? (copyYear.innerHTML = new Date().getFullYear()) : null;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
  });

  if (document.querySelector('.js-personas')) new Personas('.js-personas');
  if (document.querySelector('.js-vertical-teasers')) new VerticalTeasers('.js-vertical-teasers');
  if (document.querySelector('.js-values')) new Values('.js-values');
  if (document.querySelector('.js-accordion')) new Accordion('.js-accordion');
  if (document.querySelectorAll('[data-clock]').length) new Clocks('[data-clock]');
  if (document.querySelectorAll('[data-location]').length) new Locations('[data-location]');
});

class Locations {
  constructor(selector) {
    this.triggers = document.querySelectorAll(selector);
    this.popups = document.querySelectorAll('.locations__dot' + selector);
    this.init();
  }
  init() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 800) return;
        let location = trigger.getAttribute('data-location');
        [...this.popups].forEach(el => el.classList.remove('active'));
        [...this.popups].find(el => el.classList.contains(`locations__dot--${location}`)).classList.add('active');
      });
      trigger.addEventListener('mouseleave', () => {
        [...this.popups].forEach(el => el.classList.remove('active'));
      });
    });
  }
}

class Personas {
  constructor(selector) {
    this.selector = selector;
    this.el = document.querySelector(selector);
    this.personas = this.el.querySelectorAll('.persona');
    this.carousel = null;
    this.parent = this.el.closest('.personas__wrap');
    this.breakPoint = 528;
    this.body = document.querySelector('body');
    this.init();
  }
  init() {
    this.watch_carousel();

    window.addEventListener('resize', () => {
      this.watch_carousel();
      this.personas.forEach(persona => persona.classList.remove('open'));
      this.handle_global_scroll();
    });

    this.personas.forEach(persona => {
      persona.addEventListener('click', () => {
        this.personas.forEach(el => {
          if (el.isSameNode(persona)) {
            el.classList.toggle('open');
          } else {
            el.classList.remove('open');
          }
        });

        this.handle_global_scroll();
      });

      persona.querySelector('.persona__bio').addEventListener('click', e => e.stopPropagation());
      persona.querySelector('.persona__close').addEventListener('click', () => {
        persona.classList.remove('open');
        this.handle_global_scroll();
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
      mousewheel: {
        forceToAxis: true,
      },
    });
  }
  handle_global_scroll() {
    if (window.innerWidth >= this.breakPoint) {
      if ([...this.personas].filter(persona => persona.classList.contains('open')).length) {
        this.body.classList.add('no-scroll');
      } else {
        this.body.classList.remove('no-scroll');
      }
    }
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
  set_time(path, clock, initialized = true) {
    const date = new Date();
    let time = date.toLocaleTimeString('en-US', {
      timeZone: path,
      hour: '2-digit',
      minute: '2-digit',
    });
    clock.innerHTML = time;
    if (initialized) setInterval(() => this.set_time(path, clock, false), 1000 * 60);
  }
  init() {
    this.clocks.forEach(clock => {
      switch (clock.getAttribute('data-clock')) {
        case 'NY':
          this.set_time('America/New_York', clock);
          break;
        case 'GR':
          this.set_time('Europe/Athens', clock);
          break;
        default:
      }
    });
  }
}
class Accordion {
  constructor(selector) {
    this.selector = selector;
    this.accordion = document.querySelector(this.selector);
    this.items = this.accordion.querySelectorAll('.accordion__item');
    this.activePosition = null;
    this.body = document.querySelector('body');
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
          this.handle_global_scroll();
        });
      });

      item.querySelectorAll('[data-position]').forEach(position => {
        position.addEventListener('click', e => {
          e.stopPropagation();
          if (e.target.isSameNode(position)) position.classList.remove('open');
          this.handle_global_scroll();
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
        this.handle_global_scroll();
      }
    });
  }
  handle_global_scroll() {
    let openPopups = [...this.items].filter(item => {
      let popup = item.querySelectorAll('[data-position].open');
      if (popup.length) return popup;
    });
    openPopups.length ? this.body.classList.add('no-scroll') : this.body.classList.remove('no-scroll');
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
