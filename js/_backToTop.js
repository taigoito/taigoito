/**
 * Back To Top
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class BackToTop {

  constructor() {
    // ボタン生成
    this._btn = document.createElement('button');
    this._btn.classList.add('backToTop');
    this._icon = document.createElement('span');
    this._icon.dataset.icon = 'ei-chevron-up';
    this._icon.dataset.size = 'm';
    this._btn.appendChild(this._icon);

    // ボタン設置
    const body = document.body;
    body.appendChild(this._btn);

    // イベント登録
    this._handleEvents();

  }


  backToTop() {
    window.scroll({ top: 0, behavior: 'smooth' });

  }


  _handleEvents() {
    const myTouch = 'ontouchend' in document && window.innerWidth < 1024 ? 'touchend' : 'click';

    this._btn.addEventListener(myTouch, (event) => {
      event.preventDefault();
      this.backToTop();
    });
    
  }

}
