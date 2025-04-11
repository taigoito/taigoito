/**
 * Back To Top
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

class BackToTop {
  // 引数sizeによって、ボタンが出現する位置 (window.innerHeightの何倍か) を設定可能
  constructor(size = 0) {
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

    // 状態管理
    this.isShown = false;
    this.size = size;

    // イベント登録
    this._handleEvents();
  }

  backToTop() {
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  _handleEvents() {
    const myTouch = 'ontouchend' in document && window.innerWidth < 1024 ? 'touchend' : 'click';

    window.addEventListener('scroll', () => {
      if (!this.isShown && window.innerHeight * this.size < window.scrollY) {
        this.isShown = true;
        this._btn.classList.add('backToTop--active');
      } else if (this.isShown && window.innerHeight * this.size >= window.scrollY) {
        this.isShown = false;
        this._btn.classList.remove('backToTop--active');
      }
    });

    this._btn.addEventListener(myTouch, (event) => {
      event.preventDefault();
      this.backToTop();
    });
  }
}
