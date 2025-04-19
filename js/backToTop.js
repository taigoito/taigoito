/**
 * Back To Top
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class BackToTop {
  // options
  // size: ボタンが出現する位置 (window.innerHeightの何倍か) を設定可能
  constructor(options = {}) {
    // ボタン生成
    this._btn = document.createElement('div');
    this._btn.classList.add('backToTop');
    const icon = document.createElement('div');
    icon.classList.add('icon', 'icon--chevron-up', 'icon--lg');
    icon.innerHTML = '<span class="icon__span"></span>';
    this._btn.appendChild(icon);

    // ボタン設置
    const body = document.body;
    body.appendChild(this._btn);

    // 状態管理
    this.isShown = false;
    this.size = options.size || 0;

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
