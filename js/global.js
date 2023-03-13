import { personas } from './personas.js';
import { careers } from './careers.js';

document.addEventListener('DOMContentLoaded', () => {
  const isIos = is_ios();
  const burger = document.querySelector('.js-burger');
  const menu = document.querySelector('.js-menu');
  const copyYear = document.querySelector('.js-copy-year');

  if (!isIos) document.querySelector('body').classList.add('os-win');

  copyYear ? (copyYear.innerHTML = new Date().getFullYear()) : null;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
  });

  if (document.getElementById('personas')) handle_personas('personas');
  if (document.getElementById('careers')) handle_careers('careers');
  if (document.querySelector('.js-horizontal-teasers')) new HorizontalTeasers('.js-horizontal-teasers');
  if (document.querySelector('.js-values')) new Values('.js-values');
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
class HorizontalTeasers {
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
      wrapperClass: 'horizontal-teasers__container',
      slideClass: 'horizontal-teaser',
      slideActiveClass: 'active',
      mousewheel: {
        forceToAxis: true,
      },
      pagination: {
        el: '.pagination--horizontal-teasers',
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

function handle_personas(selector) {
  new Vue({
    el: `#${selector}`,
    data: () => ({
      personasLimit: 10,
      personas,
      filters: [
        { id: 'board', label: 'Board' },
        { id: 'executive', label: 'Executive team' },
        { id: 'advisors', label: 'Advisors' },
        { id: 'all', label: 'All' },
      ],
      activeFilter: 'all',
      activePersona: null,
      carousel: null,
      windowSize: window.innerWidth,
      modalData: null,
    }),
    mounted() {
      window.addEventListener('resize', () => {
        this.windowSize = window.innerWidth;
      });
    },
    methods: {
      create_carousel() {
        this.carousel = new Swiper('.js-personas', {
          slidesPerView: 'auto',
          centeredSlides: true,
          wrapperClass: 'split',
          slideClass: 'split__part',
          slideActiveClass: 'active',
          pagination: {
            el: '.personas__pagination',
            dynamicBullets: true,
            bulletClass: 'personas__pagination-bullet',
            bulletActiveClass: 'personas__pagination-bullet-active',
          },
          navigation: {
            prevEl: '.personas__nav--prev',
            nextEl: '.personas__nav--next',
          },
          mousewheel: {
            forceToAxis: true,
          },
        });
      },
      open_modal(persona) {
        this.activePersona = persona.id;
        this.modalData = persona;
        document.querySelector('body').classList.add('no-scroll');
      },
      close_modal() {
        this.modalData = null;
        document.querySelector('body').classList.remove('no-scroll');
      },
      view_more() {
        this.personasLimit += this.personasLimit;
      },
      view_less() {
        this.personasLimit = 10;
      },
    },
    computed: {
      filterIds() {
        return this.filterIds.map(filter => filter.id);
      },
      filteredPersonas() {
        let filteredPersonas = this.personas.filter(persona => {
          let positions = persona.filters.map(filter => filter.position);
          return positions.includes(this.activeFilter);
        });
        return filteredPersonas.sort((a, b) => a.filters.find(filter => filter.position == this.activeFilter).order - b.filters.find(filter => filter.position == this.activeFilter).order);
      },
      visiblePersonas() {
        return this.windowSize <= 545 ? this.filteredPersonas : this.filteredPersonas.slice(0, this.personasLimit);
      },
      modalIsOpen() {
        return !!this.modalData;
      },
      hasMore() {
        return this.filteredPersonas.length > this.visiblePersonas.length;
      },
      hasLess() {
        return this.filteredPersonas.length == this.visiblePersonas.length && this.visiblePersonas.length > 10;
      },
    },
    watch: {
      windowSize: {
        immediate: true,
        handler(newVal) {
          if (newVal <= 545) {
            if (!!!this.carousel || this.carousel?.destroyed) {
              this.$nextTick(this.create_carousel);
            }
          } else {
            if (this.carousel?.enabled) {
              this.carousel.destroy(true, true);
            }
          }
        },
      },
      activeFilter() {
        if (this.carousel?.enabled) {
          this.$nextTick(() => this.carousel.update());
        }
      },
    },
  });
}

function handle_careers(selector) {
  new Vue({
    el: `#${selector}`,
    data: () => ({
      careers,
      activeCategory: null,
      activePosition: null,

      modalData: null,
    }),
    mounted() {
      window.addEventListener('resize', () => {
        this.activeCategory = null;
        this.activePosition = null;
      });
    },
    methods: {
      toggle_category(index) {
        this.activeCategory = this.activeCategory == index ? null : index;
      },
      open_position(index) {
        this.activePosition = index;
      },
      close_position() {
        this.activePosition = null;
      },

      open_modal(career) {
        this.activePersona = career.id;
        this.modalData = career;
        document.querySelector('body').classList.add('no-scroll');
      },
      close_modal() {
        this.modalData = null;
        document.querySelector('body').classList.remove('no-scroll');
      },
    },
    computed: {
      modalIsOpen() {
        return !!this.modalData;
      },
    },
    watch: {
      activeCategory(newVal) {
        for (let item in this.$refs) {
          this.$refs[item][0].querySelector('.accordion__body').style.removeProperty('height');
        }
        if (newVal != null) {
          let itemBody = this.$refs[`category-${newVal}`][0].querySelector('.accordion__body');
          let height = itemBody.querySelector('.accordion__content').scrollHeight;
          itemBody.style.setProperty('height', `${height}px`);
        }
      },
    },
  });
}

function is_ios() {
  return navigator.appVersion.indexOf('Mac') != -1;
}
