/**
 * Drawer Menu
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class DrawerMenu {
  // options
  // siteBrand, primaryMenu, socialMenu: クローンする対象
  constructor(options = {}) {
    // 設定
    this.darkMode = options.darkMode || false;

    // クローンする対象
    this._siteBrand = options.siteBrand ||
      document.querySelector('.gNav__siteBrand');
    this._primaryMenu = options.primaryMenu ||
      document.querySelector('.gNav__primaryMenu');
    this._socialMenu = options.socialMenu ||
      document.querySelector('.gNav__socialMenu');

    // 各要素生成
    // .drawer
    this._drawer = document.createElement('button');
    this._drawer.classList.add('drawer', 'drawer--ready');

    // .drawer__navicon
    this._navicon = document.createElement('div');
    this._navicon.classList.add('drawer__navicon');
    let icon = document.createElement('div');
    icon.classList.add('icon', 'icon--menu', 'icon--lg');
    icon.innerHTML = '<span class="icon__span"></span>';
    this._navicon.appendChild(icon);
    this._drawer.appendChild(this._navicon);

    // .drawer__close
    this._close = document.createElement('div');
    this._close.classList.add('drawer__close');
    icon = document.createElement('div');
    icon.classList.add('icon', 'icon--close', 'icon--lg');
    icon.innerHTML = '<span class="icon__span"></span>';
    this._close.appendChild(icon);
    this._drawer.appendChild(this._close);

    // .drawerMenu
    this._drawerMenu = document.createElement('div');
    this._drawerMenu.classList.add('drawerMenu');
    if (this.darkMode) this._drawerMenu.classList.add('drawerMenu--dark');

    // .drawerMenu__inner
    this._menu = document.createElement('div');
    this._menu.classList.add('drawerMenu__inner');
    this._drawerMenu.appendChild(this._menu);
    this._importMenu();

    // .drawerMenuOverlay
    this._overlay = document.createElement('div');
    this._overlay.classList.add('drawerMenuOverlay', 'drawerMenuOverlay--collapse');

    // body要素に挿入
    const body = document.body;
    body.appendChild(this._drawer);
    body.appendChild(this._drawerMenu);
    body.appendChild(this._overlay);

    // 状態
    this.isShown = false;

    // イベント登録
    this._handleEvents();

    // 出現アニメーション
    setTimeout(() => {
      this._drawer.classList.remove('drawer--ready');
    }, 1000);

  }


  toggle() {
    // 状態から判別して、表示/非表示を切り替え
    if (this.isShown) this.hide();
    else this.show();

  }


  show() {
    // 表示
    if (!this.isShown) {
      this._transitionEnd(this._drawerMenu, () => {
        this._drawerMenu.classList.add('drawerMenu--show');
        this._drawer.classList.add('drawer--active');
        this._menu.classList.remove('drawerMenu__inner--collapse');
        this._overlay.classList.remove('drawerMenuOverlay--collapse');
      }).then(() => {
        this._menu.classList.add('drawerMenu__inner--show');
      });
    }
    this.isShown = true;

  }


  hide() {
    // 非表示
    if (this.isShown) {
      this._transitionEnd(this._drawerMenu, () => {
        this._drawerMenu.classList.remove('drawerMenu--show');
        this._drawer.classList.remove('drawer--active');
        this._menu.classList.remove('drawerMenu__inner--show');
      }).then(() => {
        this._menu.classList.add('drawerMenu__inner--collapse');
        this._overlay.classList.add('drawerMenuOverlay--collapse');
      });
    }
    this.isShown = false;

  }


  _importMenu() {
    // メニューアイテムをインポート
    if (this._siteBrand) {
      this._importSiteBrand(); // .drawerMenu__siteBrand
    }
    if (this._primaryMenu) {
      this._importPrimaryMenu(); // .drawerMenu__primaryMenu
    }
    if (this._socialMenu) {
      this._importSocialMenu(); // .drawerMenu__socialMenu
    }
  }


  _importSiteBrand() {
    // ブランドロゴ・タイトルをインポート
    const siteBrand = document.createElement('div');
    siteBrand.classList.add('drawerMenu__item', 'drawerMenu__item--siteBrand');
    siteBrand.innerHTML = this._siteBrand.innerHTML;
    this._menu.appendChild(siteBrand);

  }


  _importPrimaryMenu() {
    // プライマリメニューをインポート
    const primaryMenu = document.createElement('ul');
    primaryMenu.classList.add('drawerMenu__primaryMenu');

    // li要素を順次インポート
    const menuItems = this._primaryMenu.querySelectorAll('li');
    menuItems.forEach((menuItem) => {
      const primaryMenuItem = document.createElement('li');
      primaryMenuItem.classList.add('drawerMenu__item');
      primaryMenuItem.innerHTML = menuItem.innerHTML;
      primaryMenu.appendChild(primaryMenuItem);
    });
    this._menu.appendChild(primaryMenu);

  }


  _importSocialMenu() {
    // ソーシャルメニューをインポート
    const socialMenu = document.createElement('ul');
    socialMenu.classList.add('drawerMenu__socialMenu');

    // li要素を順次インポート
    const menuItems = this._socialMenu.querySelectorAll('li');
    menuItems.forEach((menuItem) => {
      const socialMenuItem = document.createElement('li');
      socialMenuItem.classList.add('drawerMenu__item', 'drawerMenu__item--social');
      socialMenuItem.innerHTML = menuItem.innerHTML;
      socialMenu.appendChild(socialMenuItem);
    });
    this._menu.appendChild(socialMenu);

  }


  _handleEvents() {
    const myTouch = 'ontouchend' in document && window.innerWidth < 1024 ? 'touchend' : 'click';

    // ドロワーのイベント登録
    this._drawer.addEventListener(myTouch, (event) => {
      event.preventDefault();
      this.toggle();
    });

    // オーバーレイのイベント登録
    this._overlay.addEventListener(myTouch, () => {
      this.hide();
    });

    // スクロール時のイベント登録
    window.addEventListener('scroll', () => {
      this._windowScrollHandler();
    });

  }


  _windowScrollHandler() {
    // スクロール時にメニューを非表示
    if (this.isShown) this.hide();

  }


  _transitionEnd(elem, func) {
    // CSS遷移の完了を監視
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
