/**
 * Init
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

const observer = new IntersectionObserver(([entry]) => {
  const header = document.getElementById('gNav');
  header.classList.toggle('gNav--shrink', !entry.isIntersecting);
});

observer.observe(document.getElementById('sentinel'));


// Back To Top
import BackToTop from './js/_backToTop.js';
new BackToTop();

// Drawer Menu
import DrawerMenu from './js/_drawerMenu.js';
new DrawerMenu();

// Embed
import Embed from './js/_embed.js';
new Embed();

// Fader
import Fader from './js/_fader.js';
new Fader();

// Evil Icons
new EvilIcons();
import EvilIcons from './js/_evilIcons.js';

// Preloader
new Preloader();
import Preloader from './js/_preloader.js';

// Responsive Color
new ResponsiveColor();
import ResponsiveColor from './js/_responsiveColor.js';

// Slider
new Slider();
import Slider from './js/_slider.js';
