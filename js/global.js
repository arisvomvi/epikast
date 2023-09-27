import { personas } from './personas.js';
import { careers } from './careers.js';

document.addEventListener('DOMContentLoaded', () => {
  const isIos = navigator.appVersion.indexOf('Mac') != -1;
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
  if (document.getElementById('subjects') != null) new Select('subjects');

  const alert = document.getElementById('alert');
  if (alert) {
    let closeBtn = alert.querySelector('.alert__close');
    closeBtn.addEventListener('click', () => {
      alert.classList.remove('visible');
    });
  }

  let formControls = document.querySelectorAll('.form-control');
  if (formControls.length) {
    formControls.forEach(group => {
      let targets = group.querySelectorAll('input, textarea');
      targets.forEach(target => {
        target.addEventListener('focus', () => {
          group.classList.add('focused');
        });
        target.addEventListener('blur', () => {
          if (!target.value.trim().length) group.classList.remove('focused');
        });
      });
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    let agreement = document.getElementById('agreement');
    let submitBtn = contactForm.querySelector('button[type="submit"]');

    agreement.addEventListener('click', () => {
      if (agreement.checked) {
        submitBtn.removeAttribute('disabled');
      } else {
        submitBtn.setAttribute('disabled', 'disabled');
      }
    });

    document.getElementById('contact-form').addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const formObject = {};
      let alertContentDom = alert ? alert.querySelector('.alert__content') : null;

      formData.forEach((value, key) => {
        formObject[key] = value;
      });
      delete formObject.agreement;

      try {
        const response = await fetch('', {
          method: 'POST',
          body: JSON.stringify(formObject),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          if (alertContentDom) {
            alertContentDom.innerHTML = 'Message sent successfully!';
            alert.classList.remove('error');
            alert.classList.add('visible');
          } else {
            alert('Message sent successfully!');
          }
        } else {
          if (alertContentDom) {
            alertContentDom.innerHTML = 'Message failed to send. Please try again later.';
            alert.classList.add('error');
            alert.classList.add('visible');
          } else {
            alert('Message failed to send. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('An error occurred. Please try again later.');
      }
    });
  }
});
class Locations {
  constructor(selector) {
    this.triggers = document.querySelectorAll(selector);
    this.popups = document.querySelectorAll('.locations__dot' + selector);
    this.init();
  }
  init() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('mouseover', () => {
        if (window.innerWidth <= 800) return;
        let location = trigger.getAttribute('data-location');
        [...this.popups].forEach(el => el.classList.remove('active'));
        [...this.popups].find(el => el.classList.contains(`locations__dot--${location}`)).classList.add('active');
      });
      trigger.addEventListener('mouseout', () => {
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
class Select {
  constructor(selector) {
    this.select = document.getElementById(selector);
    this.trigger = this.select.querySelector('.select__head');
    this.body = this.select.querySelector('.select__body');
    this.optionsDom = this.select.querySelector('.select__options');
    this.options = this.select.querySelectorAll('.select__options li');
    this.selection = this.select.querySelector('.select__selected');
    this.value = null;
    this.isOpen = false;
    this.nativeSelect = this.select.querySelector(`#${selector} select`);
    this.init(selector);
  }
  init(selector) {
    this.value = this.options[0].getAttribute('data-value');
    this.options[0].classList.add('active');

    window.addEventListener('click', e => {
      if (!e.target.closest(`#${selector}`) && this.isOpen) this.close();
    });

    this.optionsDom.addEventListener('click', () => {
      this.close();
    });

    this.trigger.addEventListener('click', () => {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    });

    this.options.forEach(option => {
      const newOption = document.createElement('option');
      newOption.value = option.getAttribute('data-value');
      newOption.textContent = option.innerHTML;
      this.nativeSelect.appendChild(newOption);

      option.addEventListener('click', e => {
        this.selection.innerHTML = e.target.innerHTML;
        this.value = e.target.getAttribute('data-value');
        this.options.forEach(el => el.classList.remove('active'));
        option.classList.add('active');

        let nativeOption = [...this.nativeSelect.options].find(option => option.value === this.value);
        nativeOption.selected = true;
      });
    });
  }
  open() {
    this.select.classList.add('open');
    this.isOpen = true;
  }
  close() {
    this.select.classList.remove('open');
    this.isOpen = false;
  }
}

function handle_personas(selector) {
  new Vue({
    el: `#${selector}`,
    data: () => ({
      personasLimit: 9,
      personas,
      filters: [
        { id: 'board', label: 'Board' },
        { id: 'executive', label: 'Executive team' },
        { id: 'advisors', label: 'Advisors' },
        { id: 'all', label: 'All' },
      ],
      activeFilter: 'board',
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
        this.personasLimit = 9;
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
