/**
 * Slider
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class Slider {
  // data属性によるパラメータ管理:
  // data-is-header: headerに設置 = ドラグ、ホイール操作に対応しない
  // data-aspect-ratio: アスペクト比 (SCSSも修正が必要)
  // data-gap: アイテム間隔(px) SCSSで指定不可
  // data-interval: スライドアニメーション時間間隔
  // data-duration: スライドアニメーション所要時間
  constructor(elem) {
    // Sliderの各要素
    this._elem = elem || document.querySelector('.slider');
    if (!this._elem) return;
    this._inner = this._elem.querySelector('.slider__inner');
    if (!this._inner) return;
    this._items = this._inner.children;
    if (!this._items.length) return;

    // 各オプション (data属性から取得)
    this.isHeader = this._elem.dataset.isHeader || false; // headerに設置する場合はドラグ、ホイール操作に対応しない
    this.aspectRatio = this._elem.dataset.aspectRatio || 8 / 5;
    this.gap = this._elem.dataset.gap - 0 || 0; // アイテム間隔(px)
    this.interval = this._elem.dataset.interval || 3000; // 1000未満を指定すると自動再生しない
    this.duration = this._elem.dataset.duration || 500;

    // innerにスタイル適用
    this._inner.style.flexWrap = 'nowrap'; // .wp-block-galleryのリセット
    this._inner.style.gap = `${this.gap}px`;

    // 各状態管理
    this.currentIndex = 0;
    this.itemsCount = this._items.length;
    this.distance = 0; // インラインでtranslateXに適用する値
    this.dragDistance = []; // ドラグ操作の軌跡を保持
    this.isAnimated = false;

    // 各セットアップ
    this._setupNavs();
    this._setupItems();
    this._readyMove(-3, true); // 左に3つアイテムを足しておく
    this._setActiveTarget();
    this._handleEvents();

    // リサイズ
    this._windowResizeHandler();

    // 自動再生
    if (this.interval >= 1000) this.startInterval();
  }

  // 再生
  startInterval() {
    this._isPlay = true;
    this._timeStart = null;
    this._loop(performance.now());
  }

  // 停止
  stopInterval() {
    this._isPlay = false;
  }

  _loop(timeCurrent) {
    if (!this._timeStart) {
      this._timeStart = timeCurrent;
    }
    const timeElapsed = timeCurrent - this._timeStart;

    timeElapsed < this.interval
      ? window.requestAnimationFrame(this._loop.bind(this))
      : this._done();
  }

  _done() {
    if (this._isPlay) {
      this.startInterval();
      this.move(1);
    }
  }

  // sizeを指定して、スライダーを動かす
  move(size, duration = this.duration) {
    // 予め引っ張られてくるアイテムを移動しておく
    this._readyMove(size);

    // 状態の更新
    const len = this._items.length;
    this.currentIndex += size;
    if (this.currentIndex < 0) this.currentIndex += len;
    if (this.currentIndex >= len) this.currentIndex -= len;

    // アニメーション開始
    this.isAnimated = true;
    this._start = this.distance;

    if (size < 0) {
      for (let i = 0; i > size; i--) {
        this._start -= this._items[(this.currentIndex - i - 3 + len) % len].clientWidth;
        this._start -= this.gap;
      }
    } else {
      for (let i = 0; i < size; i++) {
        this._start += this._items[(this.currentIndex - i - 4 + len) % len].clientWidth;
        this._start += this.gap;
      }
    }

    this._stop = this._getAdjustedDistance(this.currentIndex);
    this._flickDistance = this._stop - this._start;
    this._currentDuration = duration;
    this._timeStart = false;
    this._moving(performance.now());
  }

  _readyMove(size, init = false) {
    const len = this._items.length;

    if (size < 0) {
      for (let i = 0; i > size; i--) {
        let j = (this.currentIndex + i - 4 + len) % len;
        if (init) j += 3;
        const order = window.getComputedStyle(this._items[j]).order;
        this._items[j].style.order = parseInt(order) - 1;
      }
    } else {
      for (let i = 0; i < size; i++) {
        let j = (this.currentIndex + i - 3 + len) % len;
        if (init) j += 3;
        const order = window.getComputedStyle(this._items[j]).order;
        this._items[j].style.order = parseInt(order) + 1;
      }
    }
  }

  // ナビゲーション(.slider__prev, .slider__next, .slider__nav)を設置
  _setupNavs() {
    // .slider__prev
    this._prev = document.createElement('a');
    this._prev.classList.add('slider__prev');
    this._prev.setAttribute('href', '#');
    let icon = document.createElement('div');
    icon.classList.add('icon', 'icon--chevron-left', 'icon--md');
    icon.innerHTML = '<span class="icon__span"></span>';
    this._prev.appendChild(icon);

    // .slider__next
    this._next = document.createElement('a');
    this._next.classList.add('slider__next');
    this._next.setAttribute('href', '#');
    icon = document.createElement('div');
    icon.classList.add('icon', 'icon--chevron-right', 'icon--md');
    icon.innerHTML = '<span class="icon__span"></span>';
    this._next.appendChild(icon);

    // .slider__nav
    this._nav = document.createElement('ul');
    this._nav.classList.add('slider__nav');

    // .slider__navItem
    for (let i = 0; i < this.itemsCount; i++) {
      const li = document.createElement('li');
      li.classList.add('slider__navItem');
      li.dataset.targetIndex = i; // data-target-indexを挿入
      this._nav.appendChild(li);
    }

    this._elem.appendChild(this._prev);
    this._elem.appendChild(this._next);
    this._elem.after(this._nav);
  }

  // アイテムが7個未満の場合に予備を連ねておく
  _setupItems() {
    while (this._items.length < 7) {
      for (let i = 0; i < this.itemsCount; i++) {
        const clone = this._items[i].cloneNode(true);
        this._inner.appendChild(clone);
      }
    }
  }

  // アイテムのアクティブ状態を管理
  _setActiveTarget() {
    // スライダー内アイテム
    if (this._inner.querySelector('.slider__item--current')) {
      this._inner.querySelector('.slider__item--current').classList.remove('slider__item--current');
    }
    this._items[this.currentIndex].classList.add('slider__item--current');
    // ナビゲーション
    if (this._nav.querySelector('.slider__navItem--current')) {
      this._nav.querySelector('.slider__navItem--current').classList.remove('slider__navItem--current');
    }
    this._navItems = this._nav.children;
    this._navItems[this.currentIndex % this.itemsCount].classList.add('slider__navItem--current');
  }

  _handleEvents() {
    // タッチデバイスの判定
    const touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
    const myTouch = touchSupported ? 'touchend' : 'click';

    // 状態
    this._x = 0;
    this._y = 0;
    this._isDragging = false;
    this._delta = 0;

    // ドラグおよびホイール操作
    if (!this.isHeader) {
      if (touchSupported) {
        this._inner.addEventListener('touchstart', (event) => {
          this._x = event.touches[0].clientX;
          this._y = event.touches[0].clientY;
          this._isDragging = true;
          this._myStartHandler();
        });

        this._inner.addEventListener('touchmove', (event) => {
          this._x = event.touches[0].clientX;
          this._y = event.touches[0].clientY;
          this._myMoveHandler();
        });

        this._inner.addEventListener('touchend', () => {
          this._myEndHandler();
          this._isDragging = false;
        });

        // touchcancelは、myEnd扱い
        this._inner.addEventListener('touchcancel', () => {
          this._myEndHandler();
          this._isDragging = false;
        });
      }

      this._inner.addEventListener('mousedown', (event) => {
        this._x = event.clientX;
        this._y = event.clientY;
        this._isDragging = true;
        this._myStartHandler();
        event.preventDefault();
      });

      this._inner.addEventListener('mousemove', (event) => {
        this._x = event.clientX;
        this._y = event.clientY;
        this._myMoveHandler();
        event.preventDefault();
      });

      this._inner.addEventListener('mouseup', () => {
        this._myEndHandler();
        this._isDragging = false;
      });

      // ポインターが外れたときは、myEnd扱い
      this._inner.addEventListener('mouseleave', () => {
        this._myEndHandler();
        this._isDragging = false;
      });

      // ホイール操作
      this._inner.addEventListener('wheel', (event) => {
        this._delta = event.deltaY;
        this._myWheelHandler();
        event.preventDefault();
      });
    }

    // img > a リンク無効化
    this._inner.querySelectorAll('.post__image > a').forEach((elem) => {
      elem.addEventListener(myTouch, (event) => {
        event.preventDefault();
      });
    });

    // ナビゲーション操作
    this._nav.addEventListener(myTouch, (event) => {
      const target = event.target;
      if (target.dataset.targetIndex) {
        this.move(target.dataset.targetIndex - this.currentIndex % this.itemsCount);
        this.stopInterval();
      }
    });

    // 前ボタン
    this._prev.addEventListener(myTouch, (event) => {
      if (!this.isAnimated) this.move(-1);
      this.stopInterval();
      event.preventDefault();
    });

    // 次ボタン
    this._next.addEventListener(myTouch, (event) => {
      if (!this.isAnimated) this.move(1);
      this.stopInterval();
      event.preventDefault();
    });

    // リサイズ
    window.addEventListener('resize', () => {
      this._windowResizeHandler();
    });
  }

  _myStartHandler() {
    // 配列をリセット
    this.dragDistance = [this._x];
    // 自動再生を止める
    this.stopInterval();
  }

  _myMoveHandler() {
    if (this._isDragging && !this.isAnimated) {
      // 配列にx座標をpushする
      this.dragDistance.push(this._x);
      const len = this.dragDistance.length;
      let distance = 0;
      // インラインスタイルを書き換える
      for (let i = 0; i < len; i++) {
        if (i > 0) {
          distance = this.dragDistance[i] - this.dragDistance[i - 1];
          this._inner.style.transform = `translateX(${this.distance + distance}px)`;
        }
      }
      this.distance += distance;
    }
  }

  _myEndHandler() {
    // フリック操作
    if (this._isDragging) {
      // 移動距離
      const distance = this.dragDistance[0] - this.dragDistance[this.dragDistance.length - 1];
      if (Math.abs(distance) > 10) { // 僅かな移動距離で、move()を頻発させない
        const len = this._items.length;
        let size = 0;
        // 移動距離とアイテムの幅から、どれだけmove()させるか計測
        if (distance < 0) {
          const w1 = this._items[(this.currentIndex - 3 + len) % len].clientWidth;
          const w2 = this._items[(this.currentIndex - 2 + len) % len].clientWidth;
          if (w1 / 3 < Math.abs(distance)) size--;
          if ((w1 * 2 + w2) / 3 < Math.abs(distance)) size--;
        } else {
          const w1 = this._items[(this.currentIndex - 4 + len) % len].clientWidth;
          const w2 = this._items[(this.currentIndex - 5 + len) % len].clientWidth;
          if (w1 / 3 < Math.abs(distance)) size++;
          if ((w1 * 2 + w2) / 3 < Math.abs(distance)) size++;
        }
        this.move(size, this.duration / 2); // 既に引っ張ってきているので、半分の時間
      }
    }
  }

  _myWheelHandler() {
    const delta = this._delta;
    if (delta < 0 && !this.isAnimated) this.move(-1);
    if (delta > 0 && !this.isAnimated) this.move(1);
    this.stopInterval();
  }

  _windowResizeHandler() {
    // 再計算
    this._inner.style.width = `${this._getInnerWidth()}px`;
    this.distance = this._getAdjustedDistance(this.currentIndex);
    this._inner.style.transform = `translateX(${this.distance}px)`;
  }

  _getInnerWidth() {
    const len = this._items.length;
    return this._elem.clientHeight * this.aspectRatio * len + this.gap * (len - 1);
  }

  _getAdjustedDistance(index) {
    const len = this._items.length;
    let result = window.innerWidth / 2;
    result -= this._items[index % len].clientWidth / 2;
    for (let i = 0; i > -3; i--) {
      let j = (index + i - 1 + len) % len;
      result -= this._items[j].clientWidth;
      result -= this.gap;
    }
    return result;
  }

  _moving(timeCurrent) {
    if (!this._timeStart) {
      this._timeStart = timeCurrent;
    }

    const timeElapsed = timeCurrent - this._timeStart;
    const next = this._easing(timeElapsed, this._start, this._flickDistance, this._currentDuration);
    this._inner.style.transform = `translateX(${next}px)`;

    timeElapsed < this._currentDuration
      ? window.requestAnimationFrame(this._moving.bind(this))
      : this._moved();
  }


  _moved() {
    this._inner.style.transform = `translateX(${this._start + this._flickDistance}px)`;
    this.timeStart = false;
    this.isAnimated = false;
    this._setActiveTarget();
    this._windowResizeHandler();
  }


  _easing(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  }
}
