/**
 * Embed
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Embed {

  constructor() {
    // 要素を取得
    const embed = document.querySelector('.embed__cover');
    if (!embed) return;

    embed.classList.add('embed__cover--active');
    // 監視
    const myTouch = 'ontouchend' in document && window.innerWidth < 1024 ? 'touchend' : 'click';
    embed.addEventListener(myTouch, () => {
      const promise = this.transitionEnd(embed, () => {
        embed.classList.remove('embed__cover--active');
      }).then(() => {
        embed.remove();
      });
    });

  }


  transitionEnd(elem, func) {
    let callback;
    const promise = new Promise((resolve, reject) => {
      callback = () => resolve(elem);
      elem.addEventListener('transitionend', callback);
    });
    func();
    promise.then((elem) => {
      elem.removeEventListener('transitionend', callback);
    });
    return promise;

  }

}
