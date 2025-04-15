/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

// G Nav Shrink
window.addEventListener('scroll', () => {
  const gNav = document.getElementById('gNav');
  if (0 < window.scrollY) {
    gNav.classList.add('gNav--shrink');
  } else {
    gNav.classList.remove('gNav--shrink');
  }
});

// Back To Top
import BackToTop from './js/backToTop.js';
new BackToTop({darkMode: true});

// Drawer Menu
import DrawerMenu from './js/drawerMenu.js';
new DrawerMenu({darkMode: true, responsiveColor: true});

// Embed
//import Embed from './js/embed.js';
//new Embed();

// Fader
//import Fader from './js/fader.js';
//new Fader();

// Evil Icons
import EvilIcons from './js/evilIcons.js';
new EvilIcons();

// Preloader
//import Preloader from './js/preloader.js';
//new Preloader();

// Responsive Color
//import ResponsiveColor from './js/responsiveColor.js';
//new ResponsiveColor();

// Slider
//import Slider from './js/slider.js';
//new Slider();
