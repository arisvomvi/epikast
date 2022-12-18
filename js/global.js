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
    this.init();
  }
  close_popup(pos = null) {
    console.log('close_popup: ' + pos);
    if (pos) {
      let bioWrap = this.personas[pos].querySelector('.persona__bio-wrap');
      this.personas[pos].classList.remove('open');
      bioWrap.style.removeProperty('height');
      setTimeout(() => {
        bioWrap.removeAttribute('style');
      }, 400);
    } else {
      this.personas.forEach(persona => {
        let bioWrap = persona.querySelector('.persona__bio-wrap');
        persona.classList.remove('open');
        bioWrap.style.removeProperty('height');
        setTimeout(() => {
          bioWrap.removeAttribute('style');
        }, 400);
      });
    }
  }
  open_popup(pos) {
    console.log('open_popup: ' + pos);
    let bioWrap = this.personas[pos].querySelector('.persona__bio-wrap');
    let bio = bioWrap.querySelector('.persona__bio');
    console.log(bioWrap);
    this.personas[pos].classList.add('open');
    // calculate position
    if (bio.scrollHeight > this.parent.getBoundingClientRect().height) {
      bioWrap.style.setProperty('bottom', 0);
    } else {
      bioWrap.style.setProperty('top', 0);
    }

    bioWrap.style.setProperty('height', `${bio.scrollHeight}px`);
  }
  init() {
    this.watch_carousel();

    window.addEventListener('resize', () => {
      console.log('resize');
      this.watch_carousel();
      this.close_popup();
    });

    this.personas.forEach(persona => {
      // let bioWrap = persona.querySelector('.persona__bio-wrap');
      // let bio = bioWrap.querySelector('.persona__bio');
      // let isOpen = false;

      persona.addEventListener('click', e => {
        this.personas.forEach((el, index) => {
          let isClicked = e.target.closest('.persona').isSameNode(this.personas[index]);
          if (isClicked) {
            console.log('isclicked', index);
            console.log('----');
            if (el.classList.contains('open')) {
              this.close_popup(index);
            } else {
              this.open_popup(index);
            }
          } else {
            if (el.classList.contains('open')) {
              console.log('not clicked, will close ', index);
              this.close_popup(index);
            }
            // el.classList.remove('open');
            // el.querySelector('.persona__bio-wrap').style.removeProperty('height');
            // setTimeout(() => {
            //   el.querySelector('.persona__bio-wrap').removeAttribute('style');
            // }, 400);
          }
        });
      });

      // bioWrap.addEventListener('click', e => {
      //   console.log('bio clicked');
      //   e.stopPropagation();
      //   // isOpen = false;
      //   // bioWrap.closest('.persona').classList.remove('open');
      //   // bioWrap.style.removeProperty('height');
      //   // setTimeout(() => {
      //   //   bioWrap.removeAttribute('style');
      //   // }, 400);
      // });
    });
  }
  watch_carousel() {
    if (window.innerWidth <= 528) {
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
    this.init();
  }
  init() {
    this.items.forEach(item => {
      item.addEventListener('click', e => {
        let target = e.target;
        if (target.closest('.accordion__content li')) {
          let trigger = target.closest('.accordion__content li');
          this.toggle_position(item.querySelectorAll('.position'), trigger.getAttribute('data-trigger'));
          return;
        }

        this.toggle_accordion(item, this.items);
      });
    });
  }
  toggle_position(articles, pos = null) {
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
  toggle_accordion(target, items) {
    items.forEach(item => {
      if (item.isSameNode(target)) {
        if (item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.accordion__body').style.removeProperty('height');
          this.toggle_position(item.querySelectorAll('.position'));
        } else {
          item.classList.add('active');
          item.querySelector('.accordion__body').style.setProperty('height', `${target.querySelector('.accordion__content').scrollHeight}px`);
        }
      } else {
        item.classList.remove('active');
        item.querySelector('.accordion__body').style.removeProperty('height');
        this.toggle_position(item.querySelectorAll('.position'));
      }
    });
  }
}
