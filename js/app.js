(() => {
  "use strict";
  class e {
    constructor(e) {
      let t = {
        logging: !0,
        init: !0,
        attributeOpenButton: "data-popup",
        attributeCloseButton: "data-close",
        fixElementSelector: "[data-lp]",
        youtubeAttribute: "data-youtube",
        youtubePlaceAttribute: "data-youtube-place",
        setAutoplayYoutube: !0,
        classes: {
          popup: "popup",
          popupContent: "popup__content",
          popupActive: "popup_show",
          bodyActive: "popup-show",
        },
        focusCatch: !0,
        closeEsc: !0,
        bodyLock: !0,
        bodyLockDelay: 500,
        hashSettings: { location: !0, goHash: !0 },
        on: {
          beforeOpen: function () {},
          afterOpen: function () {},
          beforeClose: function () {},
          afterClose: function () {},
        },
      };
      (this.isOpen = !1),
        (this.targetOpen = { selector: !1, element: !1 }),
        (this.previousOpen = { selector: !1, element: !1 }),
        (this.lastClosed = { selector: !1, element: !1 }),
        (this._dataValue = !1),
        (this.hash = !1),
        (this._reopen = !1),
        (this._selectorOpen = !1),
        (this.lastFocusEl = !1),
        (this._focusEl = [
          "a[href]",
          'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
          "button:not([disabled]):not([aria-hidden])",
          "select:not([disabled]):not([aria-hidden])",
          "textarea:not([disabled]):not([aria-hidden])",
          "area[href]",
          "iframe",
          "object",
          "embed",
          "[contenteditable]",
          '[tabindex]:not([tabindex^="-"])',
        ]),
        (this.options = {
          ...t,
          ...e,
          classes: { ...t.classes, ...e?.classes },
          hashSettings: { ...t.hashSettings, ...e?.hashSettings },
          on: { ...t.on, ...e?.on },
        }),
        this.options.init && this.initPopups();
    }
    initPopups() {
      this.popupLogging("Проснулся"), this.eventsPopup();
    }
    eventsPopup() {
      document.addEventListener(
        "click",
        function (e) {
          const t = e.target.closest(`[${this.options.attributeOpenButton}]`);
          if (t)
            return (
              e.preventDefault(),
              (this._dataValue = t.getAttribute(
                this.options.attributeOpenButton
              )
                ? t.getAttribute(this.options.attributeOpenButton)
                : "error"),
              "error" !== this._dataValue
                ? (this.isOpen || (this.lastFocusEl = t),
                  (this.targetOpen.selector = `${this._dataValue}`),
                  (this._selectorOpen = !0),
                  void this.open())
                : void this.popupLogging(
                    `Ой ой, не заполнен атрибут у ${t.classList}`
                  )
            );
          return e.target.closest(`[${this.options.attributeCloseButton}]`) ||
            (!e.target.closest(`.${this.options.classes.popupContent}`) &&
              this.isOpen)
            ? (e.preventDefault(), void this.close())
            : void 0;
        }.bind(this)
      ),
        document.addEventListener(
          "keydown",
          function (e) {
            if (
              this.options.closeEsc &&
              27 == e.which &&
              "Escape" === e.code &&
              this.isOpen
            )
              return e.preventDefault(), void this.close();
            this.options.focusCatch &&
              9 == e.which &&
              this.isOpen &&
              this._focusCatch(e);
          }.bind(this)
        ),
        document.querySelector("form[data-ajax],form[data-dev]") &&
          document.addEventListener(
            "formSent",
            function (e) {
              const t = e.detail.form.dataset.popupMessage;
              t && this.open(t);
            }.bind(this)
          ),
        this.options.hashSettings.goHash &&
          (window.addEventListener(
            "hashchange",
            function () {
              window.location.hash
                ? this._openToHash()
                : this.close(this.targetOpen.selector);
            }.bind(this)
          ),
          window.addEventListener(
            "load",
            function () {
              window.location.hash && this._openToHash();
            }.bind(this)
          ));
    }
    open(e) {
      if (
        (e &&
          "string" == typeof e &&
          "" !== e.trim() &&
          ((this.targetOpen.selector = e), (this._selectorOpen = !0)),
        this.isOpen && ((this._reopen = !0), this.close()),
        this._selectorOpen ||
          (this.targetOpen.selector = this.lastClosed.selector),
        this._reopen || (this.previousActiveElement = document.activeElement),
        (this.targetOpen.element = document.querySelector(
          this.targetOpen.selector
        )),
        this.targetOpen.element)
      ) {
        if (
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute)
        ) {
          const e = `https://www.youtube.com/embed/${this.targetOpen.element.getAttribute(
              this.options.youtubeAttribute
            )}?rel=0&showinfo=0&autoplay=1`,
            t = document.createElement("iframe");
          t.setAttribute("allowfullscreen", "");
          const s = this.options.setAutoplayYoutube ? "autoplay;" : "";
          t.setAttribute("allow", `${s}; encrypted-media`),
            t.setAttribute("src", e),
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
              this.targetOpen.element
                .querySelector(`[${this.options.youtubePlaceAttribute}]`)
                .appendChild(t);
        }
        this.options.hashSettings.location &&
          (this._getHash(), this._setHash()),
          this.options.on.beforeOpen(this),
          this.targetOpen.element.classList.add(
            this.options.classes.popupActive
          ),
          document.body.classList.add(this.options.classes.bodyActive),
          this._reopen ? (this._reopen = !1) : i(),
          this.targetOpen.element.setAttribute("aria-hidden", "false"),
          (this.previousOpen.selector = this.targetOpen.selector),
          (this.previousOpen.element = this.targetOpen.element),
          (this._selectorOpen = !1),
          (this.isOpen = !0),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          document.dispatchEvent(
            new CustomEvent("afterPopupOpen", { detail: { popup: this } })
          ),
          this.popupLogging("Открыл попап");
      } else
        this.popupLogging(
          "Ой ой, такого попапа нет. Проверьте корректность ввода. "
        );
    }
    close(e) {
      e &&
        "string" == typeof e &&
        "" !== e.trim() &&
        (this.previousOpen.selector = e),
        this.isOpen &&
          s &&
          (this.options.on.beforeClose(this),
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute) &&
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
            (this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ).innerHTML = ""),
          this.previousOpen.element.classList.remove(
            this.options.classes.popupActive
          ),
          this.previousOpen.element.setAttribute("aria-hidden", "true"),
          this._reopen ||
            (document.body.classList.remove(this.options.classes.bodyActive),
            i(),
            (this.isOpen = !1)),
          this._removeHash(),
          this._selectorOpen &&
            ((this.lastClosed.selector = this.previousOpen.selector),
            (this.lastClosed.element = this.previousOpen.element)),
          this.options.on.afterClose(this),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          this.popupLogging("Закрыл попап"));
    }
    _getHash() {
      this.options.hashSettings.location &&
        (this.hash = this.targetOpen.selector.includes("#")
          ? this.targetOpen.selector
          : this.targetOpen.selector.replace(".", "#"));
    }
    _openToHash() {
      let e = document.querySelector(
        `.${window.location.hash.replace("#", "")}`
      )
        ? `.${window.location.hash.replace("#", "")}`
        : document.querySelector(`${window.location.hash}`)
        ? `${window.location.hash}`
        : null;
      document.querySelector(`[${this.options.attributeOpenButton}="${e}"]`) &&
        e &&
        this.open(e);
    }
    _setHash() {
      history.pushState("", "", this.hash);
    }
    _removeHash() {
      history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(e) {
      const t = this.targetOpen.element.querySelectorAll(this._focusEl),
        s = Array.prototype.slice.call(t),
        i = s.indexOf(document.activeElement);
      e.shiftKey && 0 === i && (s[s.length - 1].focus(), e.preventDefault()),
        e.shiftKey || i !== s.length - 1 || (s[0].focus(), e.preventDefault());
    }
    _focusTrap() {
      const e = this.previousOpen.element.querySelectorAll(this._focusEl);
      !this.isOpen && this.lastFocusEl
        ? this.lastFocusEl.focus()
        : e[0].focus();
    }
    popupLogging(e) {
      this.options.logging &&
        (function (e) {
          setTimeout(() => {
            window.FLS && console.log(e);
          }, 0);
        })(`[Попапос]: ${e}`);
    }
  }
  let t = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (
        t.Android() || t.BlackBerry() || t.iOS() || t.Opera() || t.Windows()
      );
    },
  };
  let s = !0,
    i = (e = 500) => {
      document.documentElement.classList.contains("lock") ? n(e) : r(e);
    },
    n = (e = 500) => {
      let t = document.querySelector("body");
      if (s) {
        let i = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
          for (let e = 0; e < i.length; e++) {
            i[e].style.paddingRight = "0px";
          }
          (t.style.paddingRight = "0px"),
            document.documentElement.classList.remove("lock");
        }, e),
          (s = !1),
          setTimeout(function () {
            s = !0;
          }, e);
      }
    },
    r = (e = 500) => {
      let t = document.querySelector("body");
      if (s) {
        let i = document.querySelectorAll("[data-lp]");
        for (let e = 0; e < i.length; e++) {
          i[e].style.paddingRight =
            window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";
        }
        (t.style.paddingRight =
          window.innerWidth -
          document.querySelector(".wrapper").offsetWidth +
          "px"),
          document.documentElement.classList.add("lock"),
          (s = !1),
          setTimeout(function () {
            s = !0;
          }, e);
      }
    };
  const o = { inputMaskModule: null, selectModule: null };
  let a = {
    getErrors(e) {
      let t = 0,
        s = e.querySelectorAll("*[data-required]");
      return (
        s.length &&
          s.forEach((e) => {
            (null === e.offsetParent && "SELECT" !== e.tagName) ||
              e.disabled ||
              (t += this.validateInput(e));
          }),
        t
      );
    },
    validateInput(e) {
      let t = 0;
      return (
        "email" === e.dataset.required
          ? ((e.value = e.value.replace(" ", "")),
            this.emailTest(e) ? (this.addError(e), t++) : this.removeError(e))
          : ("checkbox" !== e.type || e.checked) && e.value
          ? this.removeError(e)
          : (this.addError(e), t++),
        t
      );
    },
    addError(e) {
      e.classList.add("_form-error"),
        e.parentElement.classList.add("_form-error");
      let t = e.parentElement.querySelector(".form__error");
      t && e.parentElement.removeChild(t),
        e.dataset.error &&
          e.parentElement.insertAdjacentHTML(
            "beforeend",
            `<div class="form__error">${e.dataset.error}</div>`
          );
    },
    removeError(e) {
      e.classList.remove("_form-error"),
        e.parentElement.classList.remove("_form-error"),
        e.parentElement.querySelector(".form__error") &&
          e.parentElement.removeChild(
            e.parentElement.querySelector(".form__error")
          );
    },
    formClean(e) {
      e.reset(),
        setTimeout(() => {
          let t = e.querySelectorAll("input,textarea");
          for (let e = 0; e < t.length; e++) {
            const s = t[e];
            s.parentElement.classList.remove("_form-focus"),
              s.classList.remove("_form-focus"),
              a.removeError(s),
              (s.value = s.dataset.placeholder);
          }
          let s = e.querySelectorAll(".checkbox__input");
          if (s.length > 0)
            for (let e = 0; e < s.length; e++) {
              s[e].checked = !1;
            }
          if (o.selectModule) {
            let t = e.querySelectorAll(".select");
            if (t.length)
              for (let e = 0; e < t.length; e++) {
                const s = t[e].querySelector("select");
                o.selectModule.selectBuild(s);
              }
          }
        }, 0);
    },
    emailTest: (e) => (
      console.log("asd"),
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(e.value)
    ),
  };
  function l(e) {
    return (
      null !== e &&
      "object" == typeof e &&
      "constructor" in e &&
      e.constructor === Object
    );
  }
  function d(e = {}, t = {}) {
    Object.keys(t).forEach((s) => {
      void 0 === e[s]
        ? (e[s] = t[s])
        : l(t[s]) && l(e[s]) && Object.keys(t[s]).length > 0 && d(e[s], t[s]);
    });
  }
  const c = {
    body: {},
    addEventListener() {},
    removeEventListener() {},
    activeElement: { blur() {}, nodeName: "" },
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    createEvent: () => ({ initEvent() {} }),
    createElement: () => ({
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {},
      getElementsByTagName: () => [],
    }),
    createElementNS: () => ({}),
    importNode: () => null,
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
  };
  function p() {
    const e = "undefined" != typeof document ? document : {};
    return d(e, c), e;
  }
  const u = {
    document: c,
    navigator: { userAgent: "" },
    location: {
      hash: "",
      host: "",
      hostname: "",
      href: "",
      origin: "",
      pathname: "",
      protocol: "",
      search: "",
    },
    history: { replaceState() {}, pushState() {}, go() {}, back() {} },
    CustomEvent: function () {
      return this;
    },
    addEventListener() {},
    removeEventListener() {},
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    Image() {},
    Date() {},
    screen: {},
    setTimeout() {},
    clearTimeout() {},
    matchMedia: () => ({}),
    requestAnimationFrame: (e) =>
      "undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0),
    cancelAnimationFrame(e) {
      "undefined" != typeof setTimeout && clearTimeout(e);
    },
  };
  function h() {
    const e = "undefined" != typeof window ? window : {};
    return d(e, u), e;
  }
  class f extends Array {
    constructor(e) {
      "number" == typeof e
        ? super(e)
        : (super(...(e || [])),
          (function (e) {
            const t = e.__proto__;
            Object.defineProperty(e, "__proto__", {
              get: () => t,
              set(e) {
                t.__proto__ = e;
              },
            });
          })(this));
    }
  }
  function m(e = []) {
    const t = [];
    return (
      e.forEach((e) => {
        Array.isArray(e) ? t.push(...m(e)) : t.push(e);
      }),
      t
    );
  }
  function g(e, t) {
    return Array.prototype.filter.call(e, t);
  }
  function v(e, t) {
    const s = h(),
      i = p();
    let n = [];
    if (!t && e instanceof f) return e;
    if (!e) return new f(n);
    if ("string" == typeof e) {
      const s = e.trim();
      if (s.indexOf("<") >= 0 && s.indexOf(">") >= 0) {
        let e = "div";
        0 === s.indexOf("<li") && (e = "ul"),
          0 === s.indexOf("<tr") && (e = "tbody"),
          (0 !== s.indexOf("<td") && 0 !== s.indexOf("<th")) || (e = "tr"),
          0 === s.indexOf("<tbody") && (e = "table"),
          0 === s.indexOf("<option") && (e = "select");
        const t = i.createElement(e);
        t.innerHTML = s;
        for (let e = 0; e < t.childNodes.length; e += 1)
          n.push(t.childNodes[e]);
      } else
        n = (function (e, t) {
          if ("string" != typeof e) return [e];
          const s = [],
            i = t.querySelectorAll(e);
          for (let e = 0; e < i.length; e += 1) s.push(i[e]);
          return s;
        })(e.trim(), t || i);
    } else if (e.nodeType || e === s || e === i) n.push(e);
    else if (Array.isArray(e)) {
      if (e instanceof f) return e;
      n = e;
    }
    return new f(
      (function (e) {
        const t = [];
        for (let s = 0; s < e.length; s += 1)
          -1 === t.indexOf(e[s]) && t.push(e[s]);
        return t;
      })(n)
    );
  }
  v.fn = f.prototype;
  const w = "resize scroll".split(" ");
  function b(e) {
    return function (...t) {
      if (void 0 === t[0]) {
        for (let t = 0; t < this.length; t += 1)
          w.indexOf(e) < 0 &&
            (e in this[t] ? this[t][e]() : v(this[t]).trigger(e));
        return this;
      }
      return this.on(e, ...t);
    };
  }
  b("click"),
    b("blur"),
    b("focus"),
    b("focusin"),
    b("focusout"),
    b("keyup"),
    b("keydown"),
    b("keypress"),
    b("submit"),
    b("change"),
    b("mousedown"),
    b("mousemove"),
    b("mouseup"),
    b("mouseenter"),
    b("mouseleave"),
    b("mouseout"),
    b("mouseover"),
    b("touchstart"),
    b("touchend"),
    b("touchmove"),
    b("resize"),
    b("scroll");
  const S = {
    addClass: function (...e) {
      const t = m(e.map((e) => e.split(" ")));
      return (
        this.forEach((e) => {
          e.classList.add(...t);
        }),
        this
      );
    },
    removeClass: function (...e) {
      const t = m(e.map((e) => e.split(" ")));
      return (
        this.forEach((e) => {
          e.classList.remove(...t);
        }),
        this
      );
    },
    hasClass: function (...e) {
      const t = m(e.map((e) => e.split(" ")));
      return (
        g(this, (e) => t.filter((t) => e.classList.contains(t)).length > 0)
          .length > 0
      );
    },
    toggleClass: function (...e) {
      const t = m(e.map((e) => e.split(" ")));
      this.forEach((e) => {
        t.forEach((t) => {
          e.classList.toggle(t);
        });
      });
    },
    attr: function (e, t) {
      if (1 === arguments.length && "string" == typeof e)
        return this[0] ? this[0].getAttribute(e) : void 0;
      for (let s = 0; s < this.length; s += 1)
        if (2 === arguments.length) this[s].setAttribute(e, t);
        else
          for (const t in e) (this[s][t] = e[t]), this[s].setAttribute(t, e[t]);
      return this;
    },
    removeAttr: function (e) {
      for (let t = 0; t < this.length; t += 1) this[t].removeAttribute(e);
      return this;
    },
    transform: function (e) {
      for (let t = 0; t < this.length; t += 1) this[t].style.transform = e;
      return this;
    },
    transition: function (e) {
      for (let t = 0; t < this.length; t += 1)
        this[t].style.transitionDuration = "string" != typeof e ? `${e}ms` : e;
      return this;
    },
    on: function (...e) {
      let [t, s, i, n] = e;
      function r(e) {
        const t = e.target;
        if (!t) return;
        const n = e.target.dom7EventData || [];
        if ((n.indexOf(e) < 0 && n.unshift(e), v(t).is(s))) i.apply(t, n);
        else {
          const e = v(t).parents();
          for (let t = 0; t < e.length; t += 1)
            v(e[t]).is(s) && i.apply(e[t], n);
        }
      }
      function o(e) {
        const t = (e && e.target && e.target.dom7EventData) || [];
        t.indexOf(e) < 0 && t.unshift(e), i.apply(this, t);
      }
      "function" == typeof e[1] && (([t, i, n] = e), (s = void 0)),
        n || (n = !1);
      const a = t.split(" ");
      let l;
      for (let e = 0; e < this.length; e += 1) {
        const t = this[e];
        if (s)
          for (l = 0; l < a.length; l += 1) {
            const e = a[l];
            t.dom7LiveListeners || (t.dom7LiveListeners = {}),
              t.dom7LiveListeners[e] || (t.dom7LiveListeners[e] = []),
              t.dom7LiveListeners[e].push({ listener: i, proxyListener: r }),
              t.addEventListener(e, r, n);
          }
        else
          for (l = 0; l < a.length; l += 1) {
            const e = a[l];
            t.dom7Listeners || (t.dom7Listeners = {}),
              t.dom7Listeners[e] || (t.dom7Listeners[e] = []),
              t.dom7Listeners[e].push({ listener: i, proxyListener: o }),
              t.addEventListener(e, o, n);
          }
      }
      return this;
    },
    off: function (...e) {
      let [t, s, i, n] = e;
      "function" == typeof e[1] && (([t, i, n] = e), (s = void 0)),
        n || (n = !1);
      const r = t.split(" ");
      for (let e = 0; e < r.length; e += 1) {
        const t = r[e];
        for (let e = 0; e < this.length; e += 1) {
          const r = this[e];
          let o;
          if (
            (!s && r.dom7Listeners
              ? (o = r.dom7Listeners[t])
              : s && r.dom7LiveListeners && (o = r.dom7LiveListeners[t]),
            o && o.length)
          )
            for (let e = o.length - 1; e >= 0; e -= 1) {
              const s = o[e];
              (i && s.listener === i) ||
              (i &&
                s.listener &&
                s.listener.dom7proxy &&
                s.listener.dom7proxy === i)
                ? (r.removeEventListener(t, s.proxyListener, n), o.splice(e, 1))
                : i ||
                  (r.removeEventListener(t, s.proxyListener, n),
                  o.splice(e, 1));
            }
        }
      }
      return this;
    },
    trigger: function (...e) {
      const t = h(),
        s = e[0].split(" "),
        i = e[1];
      for (let n = 0; n < s.length; n += 1) {
        const r = s[n];
        for (let s = 0; s < this.length; s += 1) {
          const n = this[s];
          if (t.CustomEvent) {
            const s = new t.CustomEvent(r, {
              detail: i,
              bubbles: !0,
              cancelable: !0,
            });
            (n.dom7EventData = e.filter((e, t) => t > 0)),
              n.dispatchEvent(s),
              (n.dom7EventData = []),
              delete n.dom7EventData;
          }
        }
      }
      return this;
    },
    transitionEnd: function (e) {
      const t = this;
      return (
        e &&
          t.on("transitionend", function s(i) {
            i.target === this && (e.call(this, i), t.off("transitionend", s));
          }),
        this
      );
    },
    outerWidth: function (e) {
      if (this.length > 0) {
        if (e) {
          const e = this.styles();
          return (
            this[0].offsetWidth +
            parseFloat(e.getPropertyValue("margin-right")) +
            parseFloat(e.getPropertyValue("margin-left"))
          );
        }
        return this[0].offsetWidth;
      }
      return null;
    },
    outerHeight: function (e) {
      if (this.length > 0) {
        if (e) {
          const e = this.styles();
          return (
            this[0].offsetHeight +
            parseFloat(e.getPropertyValue("margin-top")) +
            parseFloat(e.getPropertyValue("margin-bottom"))
          );
        }
        return this[0].offsetHeight;
      }
      return null;
    },
    styles: function () {
      const e = h();
      return this[0] ? e.getComputedStyle(this[0], null) : {};
    },
    offset: function () {
      if (this.length > 0) {
        const e = h(),
          t = p(),
          s = this[0],
          i = s.getBoundingClientRect(),
          n = t.body,
          r = s.clientTop || n.clientTop || 0,
          o = s.clientLeft || n.clientLeft || 0,
          a = s === e ? e.scrollY : s.scrollTop,
          l = s === e ? e.scrollX : s.scrollLeft;
        return { top: i.top + a - r, left: i.left + l - o };
      }
      return null;
    },
    css: function (e, t) {
      const s = h();
      let i;
      if (1 === arguments.length) {
        if ("string" != typeof e) {
          for (i = 0; i < this.length; i += 1)
            for (const t in e) this[i].style[t] = e[t];
          return this;
        }
        if (this[0])
          return s.getComputedStyle(this[0], null).getPropertyValue(e);
      }
      if (2 === arguments.length && "string" == typeof e) {
        for (i = 0; i < this.length; i += 1) this[i].style[e] = t;
        return this;
      }
      return this;
    },
    each: function (e) {
      return e
        ? (this.forEach((t, s) => {
            e.apply(t, [t, s]);
          }),
          this)
        : this;
    },
    html: function (e) {
      if (void 0 === e) return this[0] ? this[0].innerHTML : null;
      for (let t = 0; t < this.length; t += 1) this[t].innerHTML = e;
      return this;
    },
    text: function (e) {
      if (void 0 === e) return this[0] ? this[0].textContent.trim() : null;
      for (let t = 0; t < this.length; t += 1) this[t].textContent = e;
      return this;
    },
    is: function (e) {
      const t = h(),
        s = p(),
        i = this[0];
      let n, r;
      if (!i || void 0 === e) return !1;
      if ("string" == typeof e) {
        if (i.matches) return i.matches(e);
        if (i.webkitMatchesSelector) return i.webkitMatchesSelector(e);
        if (i.msMatchesSelector) return i.msMatchesSelector(e);
        for (n = v(e), r = 0; r < n.length; r += 1) if (n[r] === i) return !0;
        return !1;
      }
      if (e === s) return i === s;
      if (e === t) return i === t;
      if (e.nodeType || e instanceof f) {
        for (n = e.nodeType ? [e] : e, r = 0; r < n.length; r += 1)
          if (n[r] === i) return !0;
        return !1;
      }
      return !1;
    },
    index: function () {
      let e,
        t = this[0];
      if (t) {
        for (e = 0; null !== (t = t.previousSibling); )
          1 === t.nodeType && (e += 1);
        return e;
      }
    },
    eq: function (e) {
      if (void 0 === e) return this;
      const t = this.length;
      if (e > t - 1) return v([]);
      if (e < 0) {
        const s = t + e;
        return v(s < 0 ? [] : [this[s]]);
      }
      return v([this[e]]);
    },
    append: function (...e) {
      let t;
      const s = p();
      for (let i = 0; i < e.length; i += 1) {
        t = e[i];
        for (let e = 0; e < this.length; e += 1)
          if ("string" == typeof t) {
            const i = s.createElement("div");
            for (i.innerHTML = t; i.firstChild; )
              this[e].appendChild(i.firstChild);
          } else if (t instanceof f)
            for (let s = 0; s < t.length; s += 1) this[e].appendChild(t[s]);
          else this[e].appendChild(t);
      }
      return this;
    },
    prepend: function (e) {
      const t = p();
      let s, i;
      for (s = 0; s < this.length; s += 1)
        if ("string" == typeof e) {
          const n = t.createElement("div");
          for (n.innerHTML = e, i = n.childNodes.length - 1; i >= 0; i -= 1)
            this[s].insertBefore(n.childNodes[i], this[s].childNodes[0]);
        } else if (e instanceof f)
          for (i = 0; i < e.length; i += 1)
            this[s].insertBefore(e[i], this[s].childNodes[0]);
        else this[s].insertBefore(e, this[s].childNodes[0]);
      return this;
    },
    next: function (e) {
      return this.length > 0
        ? e
          ? this[0].nextElementSibling && v(this[0].nextElementSibling).is(e)
            ? v([this[0].nextElementSibling])
            : v([])
          : this[0].nextElementSibling
          ? v([this[0].nextElementSibling])
          : v([])
        : v([]);
    },
    nextAll: function (e) {
      const t = [];
      let s = this[0];
      if (!s) return v([]);
      for (; s.nextElementSibling; ) {
        const i = s.nextElementSibling;
        e ? v(i).is(e) && t.push(i) : t.push(i), (s = i);
      }
      return v(t);
    },
    prev: function (e) {
      if (this.length > 0) {
        const t = this[0];
        return e
          ? t.previousElementSibling && v(t.previousElementSibling).is(e)
            ? v([t.previousElementSibling])
            : v([])
          : t.previousElementSibling
          ? v([t.previousElementSibling])
          : v([]);
      }
      return v([]);
    },
    prevAll: function (e) {
      const t = [];
      let s = this[0];
      if (!s) return v([]);
      for (; s.previousElementSibling; ) {
        const i = s.previousElementSibling;
        e ? v(i).is(e) && t.push(i) : t.push(i), (s = i);
      }
      return v(t);
    },
    parent: function (e) {
      const t = [];
      for (let s = 0; s < this.length; s += 1)
        null !== this[s].parentNode &&
          (e
            ? v(this[s].parentNode).is(e) && t.push(this[s].parentNode)
            : t.push(this[s].parentNode));
      return v(t);
    },
    parents: function (e) {
      const t = [];
      for (let s = 0; s < this.length; s += 1) {
        let i = this[s].parentNode;
        for (; i; ) e ? v(i).is(e) && t.push(i) : t.push(i), (i = i.parentNode);
      }
      return v(t);
    },
    closest: function (e) {
      let t = this;
      return void 0 === e ? v([]) : (t.is(e) || (t = t.parents(e).eq(0)), t);
    },
    find: function (e) {
      const t = [];
      for (let s = 0; s < this.length; s += 1) {
        const i = this[s].querySelectorAll(e);
        for (let e = 0; e < i.length; e += 1) t.push(i[e]);
      }
      return v(t);
    },
    children: function (e) {
      const t = [];
      for (let s = 0; s < this.length; s += 1) {
        const i = this[s].children;
        for (let s = 0; s < i.length; s += 1)
          (e && !v(i[s]).is(e)) || t.push(i[s]);
      }
      return v(t);
    },
    filter: function (e) {
      return v(g(this, e));
    },
    remove: function () {
      for (let e = 0; e < this.length; e += 1)
        this[e].parentNode && this[e].parentNode.removeChild(this[e]);
      return this;
    },
  };
  Object.keys(S).forEach((e) => {
    Object.defineProperty(v.fn, e, { value: S[e], writable: !0 });
  });
  const T = v;
  function E(e, t) {
    return void 0 === t && (t = 0), setTimeout(e, t);
  }
  function y() {
    return Date.now();
  }
  function C(e, t) {
    void 0 === t && (t = "x");
    const s = h();
    let i, n, r;
    const o = (function (e) {
      const t = h();
      let s;
      return (
        t.getComputedStyle && (s = t.getComputedStyle(e, null)),
        !s && e.currentStyle && (s = e.currentStyle),
        s || (s = e.style),
        s
      );
    })(e);
    return (
      s.WebKitCSSMatrix
        ? ((n = o.transform || o.webkitTransform),
          n.split(",").length > 6 &&
            (n = n
              .split(", ")
              .map((e) => e.replace(",", "."))
              .join(", ")),
          (r = new s.WebKitCSSMatrix("none" === n ? "" : n)))
        : ((r =
            o.MozTransform ||
            o.OTransform ||
            o.MsTransform ||
            o.msTransform ||
            o.transform ||
            o
              .getPropertyValue("transform")
              .replace("translate(", "matrix(1, 0, 0, 1,")),
          (i = r.toString().split(","))),
      "x" === t &&
        (n = s.WebKitCSSMatrix
          ? r.m41
          : 16 === i.length
          ? parseFloat(i[12])
          : parseFloat(i[4])),
      "y" === t &&
        (n = s.WebKitCSSMatrix
          ? r.m42
          : 16 === i.length
          ? parseFloat(i[13])
          : parseFloat(i[5])),
      n || 0
    );
  }
  function x(e) {
    return (
      "object" == typeof e &&
      null !== e &&
      e.constructor &&
      "Object" === Object.prototype.toString.call(e).slice(8, -1)
    );
  }
  function L(e) {
    return "undefined" != typeof window && void 0 !== window.HTMLElement
      ? e instanceof HTMLElement
      : e && (1 === e.nodeType || 11 === e.nodeType);
  }
  function O() {
    const e = Object(arguments.length <= 0 ? void 0 : arguments[0]),
      t = ["__proto__", "constructor", "prototype"];
    for (let s = 1; s < arguments.length; s += 1) {
      const i = s < 0 || arguments.length <= s ? void 0 : arguments[s];
      if (null != i && !L(i)) {
        const s = Object.keys(Object(i)).filter((e) => t.indexOf(e) < 0);
        for (let t = 0, n = s.length; t < n; t += 1) {
          const n = s[t],
            r = Object.getOwnPropertyDescriptor(i, n);
          void 0 !== r &&
            r.enumerable &&
            (x(e[n]) && x(i[n])
              ? i[n].__swiper__
                ? (e[n] = i[n])
                : O(e[n], i[n])
              : !x(e[n]) && x(i[n])
              ? ((e[n] = {}), i[n].__swiper__ ? (e[n] = i[n]) : O(e[n], i[n]))
              : (e[n] = i[n]));
        }
      }
    }
    return e;
  }
  function M(e, t, s) {
    e.style.setProperty(t, s);
  }
  function k(e) {
    let { swiper: t, targetPosition: s, side: i } = e;
    const n = h(),
      r = -t.translate;
    let o,
      a = null;
    const l = t.params.speed;
    (t.wrapperEl.style.scrollSnapType = "none"),
      n.cancelAnimationFrame(t.cssModeFrameID);
    const d = s > r ? "next" : "prev",
      c = (e, t) => ("next" === d && e >= t) || ("prev" === d && e <= t),
      p = () => {
        (o = new Date().getTime()), null === a && (a = o);
        const e = Math.max(Math.min((o - a) / l, 1), 0),
          d = 0.5 - Math.cos(e * Math.PI) / 2;
        let u = r + d * (s - r);
        if ((c(u, s) && (u = s), t.wrapperEl.scrollTo({ [i]: u }), c(u, s)))
          return (
            (t.wrapperEl.style.overflow = "hidden"),
            (t.wrapperEl.style.scrollSnapType = ""),
            setTimeout(() => {
              (t.wrapperEl.style.overflow = ""),
                t.wrapperEl.scrollTo({ [i]: u });
            }),
            void n.cancelAnimationFrame(t.cssModeFrameID)
          );
        t.cssModeFrameID = n.requestAnimationFrame(p);
      };
    p();
  }
  let P, A, $;
  function _() {
    return (
      P ||
        (P = (function () {
          const e = h(),
            t = p();
          return {
            smoothScroll:
              t.documentElement && "scrollBehavior" in t.documentElement.style,
            touch: !!(
              "ontouchstart" in e ||
              (e.DocumentTouch && t instanceof e.DocumentTouch)
            ),
            passiveListener: (function () {
              let t = !1;
              try {
                const s = Object.defineProperty({}, "passive", {
                  get() {
                    t = !0;
                  },
                });
                e.addEventListener("testPassiveListener", null, s);
              } catch (e) {}
              return t;
            })(),
            gestures: "ongesturestart" in e,
          };
        })()),
      P
    );
  }
  function I(e) {
    return (
      void 0 === e && (e = {}),
      A ||
        (A = (function (e) {
          let { userAgent: t } = void 0 === e ? {} : e;
          const s = _(),
            i = h(),
            n = i.navigator.platform,
            r = t || i.navigator.userAgent,
            o = { ios: !1, android: !1 },
            a = i.screen.width,
            l = i.screen.height,
            d = r.match(/(Android);?[\s\/]+([\d.]+)?/);
          let c = r.match(/(iPad).*OS\s([\d_]+)/);
          const p = r.match(/(iPod)(.*OS\s([\d_]+))?/),
            u = !c && r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
            f = "Win32" === n;
          let m = "MacIntel" === n;
          return (
            !c &&
              m &&
              s.touch &&
              [
                "1024x1366",
                "1366x1024",
                "834x1194",
                "1194x834",
                "834x1112",
                "1112x834",
                "768x1024",
                "1024x768",
                "820x1180",
                "1180x820",
                "810x1080",
                "1080x810",
              ].indexOf(`${a}x${l}`) >= 0 &&
              ((c = r.match(/(Version)\/([\d.]+)/)),
              c || (c = [0, 1, "13_0_0"]),
              (m = !1)),
            d && !f && ((o.os = "android"), (o.android = !0)),
            (c || u || p) && ((o.os = "ios"), (o.ios = !0)),
            o
          );
        })(e)),
      A
    );
  }
  function z() {
    return (
      $ ||
        ($ = (function () {
          const e = h();
          return {
            isSafari: (function () {
              const t = e.navigator.userAgent.toLowerCase();
              return (
                t.indexOf("safari") >= 0 &&
                t.indexOf("chrome") < 0 &&
                t.indexOf("android") < 0
              );
            })(),
            isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
              e.navigator.userAgent
            ),
          };
        })()),
      $
    );
  }
  const D = {
    on(e, t, s) {
      const i = this;
      if ("function" != typeof t) return i;
      const n = s ? "unshift" : "push";
      return (
        e.split(" ").forEach((e) => {
          i.eventsListeners[e] || (i.eventsListeners[e] = []),
            i.eventsListeners[e][n](t);
        }),
        i
      );
    },
    once(e, t, s) {
      const i = this;
      if ("function" != typeof t) return i;
      function n() {
        i.off(e, n), n.__emitterProxy && delete n.__emitterProxy;
        for (var s = arguments.length, r = new Array(s), o = 0; o < s; o++)
          r[o] = arguments[o];
        t.apply(i, r);
      }
      return (n.__emitterProxy = t), i.on(e, n, s);
    },
    onAny(e, t) {
      const s = this;
      if ("function" != typeof e) return s;
      const i = t ? "unshift" : "push";
      return (
        s.eventsAnyListeners.indexOf(e) < 0 && s.eventsAnyListeners[i](e), s
      );
    },
    offAny(e) {
      const t = this;
      if (!t.eventsAnyListeners) return t;
      const s = t.eventsAnyListeners.indexOf(e);
      return s >= 0 && t.eventsAnyListeners.splice(s, 1), t;
    },
    off(e, t) {
      const s = this;
      return s.eventsListeners
        ? (e.split(" ").forEach((e) => {
            void 0 === t
              ? (s.eventsListeners[e] = [])
              : s.eventsListeners[e] &&
                s.eventsListeners[e].forEach((i, n) => {
                  (i === t || (i.__emitterProxy && i.__emitterProxy === t)) &&
                    s.eventsListeners[e].splice(n, 1);
                });
          }),
          s)
        : s;
    },
    emit() {
      const e = this;
      if (!e.eventsListeners) return e;
      let t, s, i;
      for (var n = arguments.length, r = new Array(n), o = 0; o < n; o++)
        r[o] = arguments[o];
      "string" == typeof r[0] || Array.isArray(r[0])
        ? ((t = r[0]), (s = r.slice(1, r.length)), (i = e))
        : ((t = r[0].events), (s = r[0].data), (i = r[0].context || e)),
        s.unshift(i);
      return (
        (Array.isArray(t) ? t : t.split(" ")).forEach((t) => {
          e.eventsAnyListeners &&
            e.eventsAnyListeners.length &&
            e.eventsAnyListeners.forEach((e) => {
              e.apply(i, [t, ...s]);
            }),
            e.eventsListeners &&
              e.eventsListeners[t] &&
              e.eventsListeners[t].forEach((e) => {
                e.apply(i, s);
              });
        }),
        e
      );
    },
  };
  const B = {
    updateSize: function () {
      const e = this;
      let t, s;
      const i = e.$el;
      (t =
        void 0 !== e.params.width && null !== e.params.width
          ? e.params.width
          : i[0].clientWidth),
        (s =
          void 0 !== e.params.height && null !== e.params.height
            ? e.params.height
            : i[0].clientHeight),
        (0 === t && e.isHorizontal()) ||
          (0 === s && e.isVertical()) ||
          ((t =
            t -
            parseInt(i.css("padding-left") || 0, 10) -
            parseInt(i.css("padding-right") || 0, 10)),
          (s =
            s -
            parseInt(i.css("padding-top") || 0, 10) -
            parseInt(i.css("padding-bottom") || 0, 10)),
          Number.isNaN(t) && (t = 0),
          Number.isNaN(s) && (s = 0),
          Object.assign(e, {
            width: t,
            height: s,
            size: e.isHorizontal() ? t : s,
          }));
    },
    updateSlides: function () {
      const e = this;
      function t(t) {
        return e.isHorizontal()
          ? t
          : {
              width: "height",
              "margin-top": "margin-left",
              "margin-bottom ": "margin-right",
              "margin-left": "margin-top",
              "margin-right": "margin-bottom",
              "padding-left": "padding-top",
              "padding-right": "padding-bottom",
              marginRight: "marginBottom",
            }[t];
      }
      function s(e, s) {
        return parseFloat(e.getPropertyValue(t(s)) || 0);
      }
      const i = e.params,
        { $wrapperEl: n, size: r, rtlTranslate: o, wrongRTL: a } = e,
        l = e.virtual && i.virtual.enabled,
        d = l ? e.virtual.slides.length : e.slides.length,
        c = n.children(`.${e.params.slideClass}`),
        p = l ? e.virtual.slides.length : c.length;
      let u = [];
      const h = [],
        f = [];
      let m = i.slidesOffsetBefore;
      "function" == typeof m && (m = i.slidesOffsetBefore.call(e));
      let g = i.slidesOffsetAfter;
      "function" == typeof g && (g = i.slidesOffsetAfter.call(e));
      const v = e.snapGrid.length,
        w = e.slidesGrid.length;
      let b = i.spaceBetween,
        S = -m,
        T = 0,
        E = 0;
      if (void 0 === r) return;
      "string" == typeof b &&
        b.indexOf("%") >= 0 &&
        (b = (parseFloat(b.replace("%", "")) / 100) * r),
        (e.virtualSize = -b),
        o
          ? c.css({ marginLeft: "", marginBottom: "", marginTop: "" })
          : c.css({ marginRight: "", marginBottom: "", marginTop: "" }),
        i.centeredSlides &&
          i.cssMode &&
          (M(e.wrapperEl, "--swiper-centered-offset-before", ""),
          M(e.wrapperEl, "--swiper-centered-offset-after", ""));
      const y = i.grid && i.grid.rows > 1 && e.grid;
      let C;
      y && e.grid.initSlides(p);
      const x =
        "auto" === i.slidesPerView &&
        i.breakpoints &&
        Object.keys(i.breakpoints).filter(
          (e) => void 0 !== i.breakpoints[e].slidesPerView
        ).length > 0;
      for (let n = 0; n < p; n += 1) {
        C = 0;
        const o = c.eq(n);
        if (
          (y && e.grid.updateSlide(n, o, p, t), "none" !== o.css("display"))
        ) {
          if ("auto" === i.slidesPerView) {
            x && (c[n].style[t("width")] = "");
            const r = getComputedStyle(o[0]),
              a = o[0].style.transform,
              l = o[0].style.webkitTransform;
            if (
              (a && (o[0].style.transform = "none"),
              l && (o[0].style.webkitTransform = "none"),
              i.roundLengths)
            )
              C = e.isHorizontal() ? o.outerWidth(!0) : o.outerHeight(!0);
            else {
              const e = s(r, "width"),
                t = s(r, "padding-left"),
                i = s(r, "padding-right"),
                n = s(r, "margin-left"),
                a = s(r, "margin-right"),
                l = r.getPropertyValue("box-sizing");
              if (l && "border-box" === l) C = e + n + a;
              else {
                const { clientWidth: s, offsetWidth: r } = o[0];
                C = e + t + i + n + a + (r - s);
              }
            }
            a && (o[0].style.transform = a),
              l && (o[0].style.webkitTransform = l),
              i.roundLengths && (C = Math.floor(C));
          } else
            (C = (r - (i.slidesPerView - 1) * b) / i.slidesPerView),
              i.roundLengths && (C = Math.floor(C)),
              c[n] && (c[n].style[t("width")] = `${C}px`);
          c[n] && (c[n].swiperSlideSize = C),
            f.push(C),
            i.centeredSlides
              ? ((S = S + C / 2 + T / 2 + b),
                0 === T && 0 !== n && (S = S - r / 2 - b),
                0 === n && (S = S - r / 2 - b),
                Math.abs(S) < 0.001 && (S = 0),
                i.roundLengths && (S = Math.floor(S)),
                E % i.slidesPerGroup == 0 && u.push(S),
                h.push(S))
              : (i.roundLengths && (S = Math.floor(S)),
                (E - Math.min(e.params.slidesPerGroupSkip, E)) %
                  e.params.slidesPerGroup ==
                  0 && u.push(S),
                h.push(S),
                (S = S + C + b)),
            (e.virtualSize += C + b),
            (T = C),
            (E += 1);
        }
      }
      if (
        ((e.virtualSize = Math.max(e.virtualSize, r) + g),
        o &&
          a &&
          ("slide" === i.effect || "coverflow" === i.effect) &&
          n.css({ width: `${e.virtualSize + i.spaceBetween}px` }),
        i.setWrapperSize &&
          n.css({ [t("width")]: `${e.virtualSize + i.spaceBetween}px` }),
        y && e.grid.updateWrapperSize(C, u, t),
        !i.centeredSlides)
      ) {
        const t = [];
        for (let s = 0; s < u.length; s += 1) {
          let n = u[s];
          i.roundLengths && (n = Math.floor(n)),
            u[s] <= e.virtualSize - r && t.push(n);
        }
        (u = t),
          Math.floor(e.virtualSize - r) - Math.floor(u[u.length - 1]) > 1 &&
            u.push(e.virtualSize - r);
      }
      if ((0 === u.length && (u = [0]), 0 !== i.spaceBetween)) {
        const s = e.isHorizontal() && o ? "marginLeft" : t("marginRight");
        c.filter((e, t) => !i.cssMode || t !== c.length - 1).css({
          [s]: `${b}px`,
        });
      }
      if (i.centeredSlides && i.centeredSlidesBounds) {
        let e = 0;
        f.forEach((t) => {
          e += t + (i.spaceBetween ? i.spaceBetween : 0);
        }),
          (e -= i.spaceBetween);
        const t = e - r;
        u = u.map((e) => (e < 0 ? -m : e > t ? t + g : e));
      }
      if (i.centerInsufficientSlides) {
        let e = 0;
        if (
          (f.forEach((t) => {
            e += t + (i.spaceBetween ? i.spaceBetween : 0);
          }),
          (e -= i.spaceBetween),
          e < r)
        ) {
          const t = (r - e) / 2;
          u.forEach((e, s) => {
            u[s] = e - t;
          }),
            h.forEach((e, s) => {
              h[s] = e + t;
            });
        }
      }
      if (
        (Object.assign(e, {
          slides: c,
          snapGrid: u,
          slidesGrid: h,
          slidesSizesGrid: f,
        }),
        i.centeredSlides && i.cssMode && !i.centeredSlidesBounds)
      ) {
        M(e.wrapperEl, "--swiper-centered-offset-before", -u[0] + "px"),
          M(
            e.wrapperEl,
            "--swiper-centered-offset-after",
            e.size / 2 - f[f.length - 1] / 2 + "px"
          );
        const t = -e.snapGrid[0],
          s = -e.slidesGrid[0];
        (e.snapGrid = e.snapGrid.map((e) => e + t)),
          (e.slidesGrid = e.slidesGrid.map((e) => e + s));
      }
      if (
        (p !== d && e.emit("slidesLengthChange"),
        u.length !== v &&
          (e.params.watchOverflow && e.checkOverflow(),
          e.emit("snapGridLengthChange")),
        h.length !== w && e.emit("slidesGridLengthChange"),
        i.watchSlidesProgress && e.updateSlidesOffset(),
        !(l || i.cssMode || ("slide" !== i.effect && "fade" !== i.effect)))
      ) {
        const t = `${i.containerModifierClass}backface-hidden`,
          s = e.$el.hasClass(t);
        p <= i.maxBackfaceHiddenSlides
          ? s || e.$el.addClass(t)
          : s && e.$el.removeClass(t);
      }
    },
    updateAutoHeight: function (e) {
      const t = this,
        s = [],
        i = t.virtual && t.params.virtual.enabled;
      let n,
        r = 0;
      "number" == typeof e
        ? t.setTransition(e)
        : !0 === e && t.setTransition(t.params.speed);
      const o = (e) =>
        i
          ? t.slides.filter(
              (t) =>
                parseInt(t.getAttribute("data-swiper-slide-index"), 10) === e
            )[0]
          : t.slides.eq(e)[0];
      if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
        if (t.params.centeredSlides)
          t.visibleSlides.each((e) => {
            s.push(e);
          });
        else
          for (n = 0; n < Math.ceil(t.params.slidesPerView); n += 1) {
            const e = t.activeIndex + n;
            if (e > t.slides.length && !i) break;
            s.push(o(e));
          }
      else s.push(o(t.activeIndex));
      for (n = 0; n < s.length; n += 1)
        if (void 0 !== s[n]) {
          const e = s[n].offsetHeight;
          r = e > r ? e : r;
        }
      (r || 0 === r) && t.$wrapperEl.css("height", `${r}px`);
    },
    updateSlidesOffset: function () {
      const e = this,
        t = e.slides;
      for (let s = 0; s < t.length; s += 1)
        t[s].swiperSlideOffset = e.isHorizontal()
          ? t[s].offsetLeft
          : t[s].offsetTop;
    },
    updateSlidesProgress: function (e) {
      void 0 === e && (e = (this && this.translate) || 0);
      const t = this,
        s = t.params,
        { slides: i, rtlTranslate: n, snapGrid: r } = t;
      if (0 === i.length) return;
      void 0 === i[0].swiperSlideOffset && t.updateSlidesOffset();
      let o = -e;
      n && (o = e),
        i.removeClass(s.slideVisibleClass),
        (t.visibleSlidesIndexes = []),
        (t.visibleSlides = []);
      for (let e = 0; e < i.length; e += 1) {
        const a = i[e];
        let l = a.swiperSlideOffset;
        s.cssMode && s.centeredSlides && (l -= i[0].swiperSlideOffset);
        const d =
            (o + (s.centeredSlides ? t.minTranslate() : 0) - l) /
            (a.swiperSlideSize + s.spaceBetween),
          c =
            (o - r[0] + (s.centeredSlides ? t.minTranslate() : 0) - l) /
            (a.swiperSlideSize + s.spaceBetween),
          p = -(o - l),
          u = p + t.slidesSizesGrid[e];
        ((p >= 0 && p < t.size - 1) ||
          (u > 1 && u <= t.size) ||
          (p <= 0 && u >= t.size)) &&
          (t.visibleSlides.push(a),
          t.visibleSlidesIndexes.push(e),
          i.eq(e).addClass(s.slideVisibleClass)),
          (a.progress = n ? -d : d),
          (a.originalProgress = n ? -c : c);
      }
      t.visibleSlides = T(t.visibleSlides);
    },
    updateProgress: function (e) {
      const t = this;
      if (void 0 === e) {
        const s = t.rtlTranslate ? -1 : 1;
        e = (t && t.translate && t.translate * s) || 0;
      }
      const s = t.params,
        i = t.maxTranslate() - t.minTranslate();
      let { progress: n, isBeginning: r, isEnd: o } = t;
      const a = r,
        l = o;
      0 === i
        ? ((n = 0), (r = !0), (o = !0))
        : ((n = (e - t.minTranslate()) / i), (r = n <= 0), (o = n >= 1)),
        Object.assign(t, { progress: n, isBeginning: r, isEnd: o }),
        (s.watchSlidesProgress || (s.centeredSlides && s.autoHeight)) &&
          t.updateSlidesProgress(e),
        r && !a && t.emit("reachBeginning toEdge"),
        o && !l && t.emit("reachEnd toEdge"),
        ((a && !r) || (l && !o)) && t.emit("fromEdge"),
        t.emit("progress", n);
    },
    updateSlidesClasses: function () {
      const e = this,
        {
          slides: t,
          params: s,
          $wrapperEl: i,
          activeIndex: n,
          realIndex: r,
        } = e,
        o = e.virtual && s.virtual.enabled;
      let a;
      t.removeClass(
        `${s.slideActiveClass} ${s.slideNextClass} ${s.slidePrevClass} ${s.slideDuplicateActiveClass} ${s.slideDuplicateNextClass} ${s.slideDuplicatePrevClass}`
      ),
        (a = o
          ? e.$wrapperEl.find(
              `.${s.slideClass}[data-swiper-slide-index="${n}"]`
            )
          : t.eq(n)),
        a.addClass(s.slideActiveClass),
        s.loop &&
          (a.hasClass(s.slideDuplicateClass)
            ? i
                .children(
                  `.${s.slideClass}:not(.${s.slideDuplicateClass})[data-swiper-slide-index="${r}"]`
                )
                .addClass(s.slideDuplicateActiveClass)
            : i
                .children(
                  `.${s.slideClass}.${s.slideDuplicateClass}[data-swiper-slide-index="${r}"]`
                )
                .addClass(s.slideDuplicateActiveClass));
      let l = a.nextAll(`.${s.slideClass}`).eq(0).addClass(s.slideNextClass);
      s.loop && 0 === l.length && ((l = t.eq(0)), l.addClass(s.slideNextClass));
      let d = a.prevAll(`.${s.slideClass}`).eq(0).addClass(s.slidePrevClass);
      s.loop &&
        0 === d.length &&
        ((d = t.eq(-1)), d.addClass(s.slidePrevClass)),
        s.loop &&
          (l.hasClass(s.slideDuplicateClass)
            ? i
                .children(
                  `.${s.slideClass}:not(.${
                    s.slideDuplicateClass
                  })[data-swiper-slide-index="${l.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(s.slideDuplicateNextClass)
            : i
                .children(
                  `.${s.slideClass}.${
                    s.slideDuplicateClass
                  }[data-swiper-slide-index="${l.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(s.slideDuplicateNextClass),
          d.hasClass(s.slideDuplicateClass)
            ? i
                .children(
                  `.${s.slideClass}:not(.${
                    s.slideDuplicateClass
                  })[data-swiper-slide-index="${d.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(s.slideDuplicatePrevClass)
            : i
                .children(
                  `.${s.slideClass}.${
                    s.slideDuplicateClass
                  }[data-swiper-slide-index="${d.attr(
                    "data-swiper-slide-index"
                  )}"]`
                )
                .addClass(s.slideDuplicatePrevClass)),
        e.emitSlidesClasses();
    },
    updateActiveIndex: function (e) {
      const t = this,
        s = t.rtlTranslate ? t.translate : -t.translate,
        {
          slidesGrid: i,
          snapGrid: n,
          params: r,
          activeIndex: o,
          realIndex: a,
          snapIndex: l,
        } = t;
      let d,
        c = e;
      if (void 0 === c) {
        for (let e = 0; e < i.length; e += 1)
          void 0 !== i[e + 1]
            ? s >= i[e] && s < i[e + 1] - (i[e + 1] - i[e]) / 2
              ? (c = e)
              : s >= i[e] && s < i[e + 1] && (c = e + 1)
            : s >= i[e] && (c = e);
        r.normalizeSlideIndex && (c < 0 || void 0 === c) && (c = 0);
      }
      if (n.indexOf(s) >= 0) d = n.indexOf(s);
      else {
        const e = Math.min(r.slidesPerGroupSkip, c);
        d = e + Math.floor((c - e) / r.slidesPerGroup);
      }
      if ((d >= n.length && (d = n.length - 1), c === o))
        return void (d !== l && ((t.snapIndex = d), t.emit("snapIndexChange")));
      const p = parseInt(
        t.slides.eq(c).attr("data-swiper-slide-index") || c,
        10
      );
      Object.assign(t, {
        snapIndex: d,
        realIndex: p,
        previousIndex: o,
        activeIndex: c,
      }),
        t.emit("activeIndexChange"),
        t.emit("snapIndexChange"),
        a !== p && t.emit("realIndexChange"),
        (t.initialized || t.params.runCallbacksOnInit) && t.emit("slideChange");
    },
    updateClickedSlide: function (e) {
      const t = this,
        s = t.params,
        i = T(e).closest(`.${s.slideClass}`)[0];
      let n,
        r = !1;
      if (i)
        for (let e = 0; e < t.slides.length; e += 1)
          if (t.slides[e] === i) {
            (r = !0), (n = e);
            break;
          }
      if (!i || !r)
        return (t.clickedSlide = void 0), void (t.clickedIndex = void 0);
      (t.clickedSlide = i),
        t.virtual && t.params.virtual.enabled
          ? (t.clickedIndex = parseInt(
              T(i).attr("data-swiper-slide-index"),
              10
            ))
          : (t.clickedIndex = n),
        s.slideToClickedSlide &&
          void 0 !== t.clickedIndex &&
          t.clickedIndex !== t.activeIndex &&
          t.slideToClickedSlide();
    },
  };
  const G = {
    getTranslate: function (e) {
      void 0 === e && (e = this.isHorizontal() ? "x" : "y");
      const { params: t, rtlTranslate: s, translate: i, $wrapperEl: n } = this;
      if (t.virtualTranslate) return s ? -i : i;
      if (t.cssMode) return i;
      let r = C(n[0], e);
      return s && (r = -r), r || 0;
    },
    setTranslate: function (e, t) {
      const s = this,
        {
          rtlTranslate: i,
          params: n,
          $wrapperEl: r,
          wrapperEl: o,
          progress: a,
        } = s;
      let l,
        d = 0,
        c = 0;
      s.isHorizontal() ? (d = i ? -e : e) : (c = e),
        n.roundLengths && ((d = Math.floor(d)), (c = Math.floor(c))),
        n.cssMode
          ? (o[s.isHorizontal() ? "scrollLeft" : "scrollTop"] = s.isHorizontal()
              ? -d
              : -c)
          : n.virtualTranslate ||
            r.transform(`translate3d(${d}px, ${c}px, 0px)`),
        (s.previousTranslate = s.translate),
        (s.translate = s.isHorizontal() ? d : c);
      const p = s.maxTranslate() - s.minTranslate();
      (l = 0 === p ? 0 : (e - s.minTranslate()) / p),
        l !== a && s.updateProgress(e),
        s.emit("setTranslate", s.translate, t);
    },
    minTranslate: function () {
      return -this.snapGrid[0];
    },
    maxTranslate: function () {
      return -this.snapGrid[this.snapGrid.length - 1];
    },
    translateTo: function (e, t, s, i, n) {
      void 0 === e && (e = 0),
        void 0 === t && (t = this.params.speed),
        void 0 === s && (s = !0),
        void 0 === i && (i = !0);
      const r = this,
        { params: o, wrapperEl: a } = r;
      if (r.animating && o.preventInteractionOnTransition) return !1;
      const l = r.minTranslate(),
        d = r.maxTranslate();
      let c;
      if (
        ((c = i && e > l ? l : i && e < d ? d : e),
        r.updateProgress(c),
        o.cssMode)
      ) {
        const e = r.isHorizontal();
        if (0 === t) a[e ? "scrollLeft" : "scrollTop"] = -c;
        else {
          if (!r.support.smoothScroll)
            return (
              k({ swiper: r, targetPosition: -c, side: e ? "left" : "top" }), !0
            );
          a.scrollTo({ [e ? "left" : "top"]: -c, behavior: "smooth" });
        }
        return !0;
      }
      return (
        0 === t
          ? (r.setTransition(0),
            r.setTranslate(c),
            s &&
              (r.emit("beforeTransitionStart", t, n), r.emit("transitionEnd")))
          : (r.setTransition(t),
            r.setTranslate(c),
            s &&
              (r.emit("beforeTransitionStart", t, n),
              r.emit("transitionStart")),
            r.animating ||
              ((r.animating = !0),
              r.onTranslateToWrapperTransitionEnd ||
                (r.onTranslateToWrapperTransitionEnd = function (e) {
                  r &&
                    !r.destroyed &&
                    e.target === this &&
                    (r.$wrapperEl[0].removeEventListener(
                      "transitionend",
                      r.onTranslateToWrapperTransitionEnd
                    ),
                    r.$wrapperEl[0].removeEventListener(
                      "webkitTransitionEnd",
                      r.onTranslateToWrapperTransitionEnd
                    ),
                    (r.onTranslateToWrapperTransitionEnd = null),
                    delete r.onTranslateToWrapperTransitionEnd,
                    s && r.emit("transitionEnd"));
                }),
              r.$wrapperEl[0].addEventListener(
                "transitionend",
                r.onTranslateToWrapperTransitionEnd
              ),
              r.$wrapperEl[0].addEventListener(
                "webkitTransitionEnd",
                r.onTranslateToWrapperTransitionEnd
              ))),
        !0
      );
    },
  };
  function N(e) {
    let { swiper: t, runCallbacks: s, direction: i, step: n } = e;
    const { activeIndex: r, previousIndex: o } = t;
    let a = i;
    if (
      (a || (a = r > o ? "next" : r < o ? "prev" : "reset"),
      t.emit(`transition${n}`),
      s && r !== o)
    ) {
      if ("reset" === a) return void t.emit(`slideResetTransition${n}`);
      t.emit(`slideChangeTransition${n}`),
        "next" === a
          ? t.emit(`slideNextTransition${n}`)
          : t.emit(`slidePrevTransition${n}`);
    }
  }
  const H = {
    slideTo: function (e, t, s, i, n) {
      if (
        (void 0 === e && (e = 0),
        void 0 === t && (t = this.params.speed),
        void 0 === s && (s = !0),
        "number" != typeof e && "string" != typeof e)
      )
        throw new Error(
          `The 'index' argument cannot have type other than 'number' or 'string'. [${typeof e}] given.`
        );
      if ("string" == typeof e) {
        const t = parseInt(e, 10);
        if (!isFinite(t))
          throw new Error(
            `The passed-in 'index' (string) couldn't be converted to 'number'. [${e}] given.`
          );
        e = t;
      }
      const r = this;
      let o = e;
      o < 0 && (o = 0);
      const {
        params: a,
        snapGrid: l,
        slidesGrid: d,
        previousIndex: c,
        activeIndex: p,
        rtlTranslate: u,
        wrapperEl: h,
        enabled: f,
      } = r;
      if ((r.animating && a.preventInteractionOnTransition) || (!f && !i && !n))
        return !1;
      const m = Math.min(r.params.slidesPerGroupSkip, o);
      let g = m + Math.floor((o - m) / r.params.slidesPerGroup);
      g >= l.length && (g = l.length - 1),
        (p || a.initialSlide || 0) === (c || 0) &&
          s &&
          r.emit("beforeSlideChangeStart");
      const v = -l[g];
      if ((r.updateProgress(v), a.normalizeSlideIndex))
        for (let e = 0; e < d.length; e += 1) {
          const t = -Math.floor(100 * v),
            s = Math.floor(100 * d[e]),
            i = Math.floor(100 * d[e + 1]);
          void 0 !== d[e + 1]
            ? t >= s && t < i - (i - s) / 2
              ? (o = e)
              : t >= s && t < i && (o = e + 1)
            : t >= s && (o = e);
        }
      if (r.initialized && o !== p) {
        if (!r.allowSlideNext && v < r.translate && v < r.minTranslate())
          return !1;
        if (
          !r.allowSlidePrev &&
          v > r.translate &&
          v > r.maxTranslate() &&
          (p || 0) !== o
        )
          return !1;
      }
      let w;
      if (
        ((w = o > p ? "next" : o < p ? "prev" : "reset"),
        (u && -v === r.translate) || (!u && v === r.translate))
      )
        return (
          r.updateActiveIndex(o),
          a.autoHeight && r.updateAutoHeight(),
          r.updateSlidesClasses(),
          "slide" !== a.effect && r.setTranslate(v),
          "reset" !== w && (r.transitionStart(s, w), r.transitionEnd(s, w)),
          !1
        );
      if (a.cssMode) {
        const e = r.isHorizontal(),
          s = u ? v : -v;
        if (0 === t) {
          const t = r.virtual && r.params.virtual.enabled;
          t &&
            ((r.wrapperEl.style.scrollSnapType = "none"),
            (r._immediateVirtual = !0)),
            (h[e ? "scrollLeft" : "scrollTop"] = s),
            t &&
              requestAnimationFrame(() => {
                (r.wrapperEl.style.scrollSnapType = ""),
                  (r._swiperImmediateVirtual = !1);
              });
        } else {
          if (!r.support.smoothScroll)
            return (
              k({ swiper: r, targetPosition: s, side: e ? "left" : "top" }), !0
            );
          h.scrollTo({ [e ? "left" : "top"]: s, behavior: "smooth" });
        }
        return !0;
      }
      return (
        r.setTransition(t),
        r.setTranslate(v),
        r.updateActiveIndex(o),
        r.updateSlidesClasses(),
        r.emit("beforeTransitionStart", t, i),
        r.transitionStart(s, w),
        0 === t
          ? r.transitionEnd(s, w)
          : r.animating ||
            ((r.animating = !0),
            r.onSlideToWrapperTransitionEnd ||
              (r.onSlideToWrapperTransitionEnd = function (e) {
                r &&
                  !r.destroyed &&
                  e.target === this &&
                  (r.$wrapperEl[0].removeEventListener(
                    "transitionend",
                    r.onSlideToWrapperTransitionEnd
                  ),
                  r.$wrapperEl[0].removeEventListener(
                    "webkitTransitionEnd",
                    r.onSlideToWrapperTransitionEnd
                  ),
                  (r.onSlideToWrapperTransitionEnd = null),
                  delete r.onSlideToWrapperTransitionEnd,
                  r.transitionEnd(s, w));
              }),
            r.$wrapperEl[0].addEventListener(
              "transitionend",
              r.onSlideToWrapperTransitionEnd
            ),
            r.$wrapperEl[0].addEventListener(
              "webkitTransitionEnd",
              r.onSlideToWrapperTransitionEnd
            )),
        !0
      );
    },
    slideToLoop: function (e, t, s, i) {
      void 0 === e && (e = 0),
        void 0 === t && (t = this.params.speed),
        void 0 === s && (s = !0);
      const n = this;
      let r = e;
      return n.params.loop && (r += n.loopedSlides), n.slideTo(r, t, s, i);
    },
    slideNext: function (e, t, s) {
      void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
      const i = this,
        { animating: n, enabled: r, params: o } = i;
      if (!r) return i;
      let a = o.slidesPerGroup;
      "auto" === o.slidesPerView &&
        1 === o.slidesPerGroup &&
        o.slidesPerGroupAuto &&
        (a = Math.max(i.slidesPerViewDynamic("current", !0), 1));
      const l = i.activeIndex < o.slidesPerGroupSkip ? 1 : a;
      if (o.loop) {
        if (n && o.loopPreventsSlide) return !1;
        i.loopFix(), (i._clientLeft = i.$wrapperEl[0].clientLeft);
      }
      return o.rewind && i.isEnd
        ? i.slideTo(0, e, t, s)
        : i.slideTo(i.activeIndex + l, e, t, s);
    },
    slidePrev: function (e, t, s) {
      void 0 === e && (e = this.params.speed), void 0 === t && (t = !0);
      const i = this,
        {
          params: n,
          animating: r,
          snapGrid: o,
          slidesGrid: a,
          rtlTranslate: l,
          enabled: d,
        } = i;
      if (!d) return i;
      if (n.loop) {
        if (r && n.loopPreventsSlide) return !1;
        i.loopFix(), (i._clientLeft = i.$wrapperEl[0].clientLeft);
      }
      function c(e) {
        return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
      }
      const p = c(l ? i.translate : -i.translate),
        u = o.map((e) => c(e));
      let h = o[u.indexOf(p) - 1];
      if (void 0 === h && n.cssMode) {
        let e;
        o.forEach((t, s) => {
          p >= t && (e = s);
        }),
          void 0 !== e && (h = o[e > 0 ? e - 1 : e]);
      }
      let f = 0;
      if (
        (void 0 !== h &&
          ((f = a.indexOf(h)),
          f < 0 && (f = i.activeIndex - 1),
          "auto" === n.slidesPerView &&
            1 === n.slidesPerGroup &&
            n.slidesPerGroupAuto &&
            ((f = f - i.slidesPerViewDynamic("previous", !0) + 1),
            (f = Math.max(f, 0)))),
        n.rewind && i.isBeginning)
      ) {
        const n =
          i.params.virtual && i.params.virtual.enabled && i.virtual
            ? i.virtual.slides.length - 1
            : i.slides.length - 1;
        return i.slideTo(n, e, t, s);
      }
      return i.slideTo(f, e, t, s);
    },
    slideReset: function (e, t, s) {
      return (
        void 0 === e && (e = this.params.speed),
        void 0 === t && (t = !0),
        this.slideTo(this.activeIndex, e, t, s)
      );
    },
    slideToClosest: function (e, t, s, i) {
      void 0 === e && (e = this.params.speed),
        void 0 === t && (t = !0),
        void 0 === i && (i = 0.5);
      const n = this;
      let r = n.activeIndex;
      const o = Math.min(n.params.slidesPerGroupSkip, r),
        a = o + Math.floor((r - o) / n.params.slidesPerGroup),
        l = n.rtlTranslate ? n.translate : -n.translate;
      if (l >= n.snapGrid[a]) {
        const e = n.snapGrid[a];
        l - e > (n.snapGrid[a + 1] - e) * i && (r += n.params.slidesPerGroup);
      } else {
        const e = n.snapGrid[a - 1];
        l - e <= (n.snapGrid[a] - e) * i && (r -= n.params.slidesPerGroup);
      }
      return (
        (r = Math.max(r, 0)),
        (r = Math.min(r, n.slidesGrid.length - 1)),
        n.slideTo(r, e, t, s)
      );
    },
    slideToClickedSlide: function () {
      const e = this,
        { params: t, $wrapperEl: s } = e,
        i =
          "auto" === t.slidesPerView
            ? e.slidesPerViewDynamic()
            : t.slidesPerView;
      let n,
        r = e.clickedIndex;
      if (t.loop) {
        if (e.animating) return;
        (n = parseInt(T(e.clickedSlide).attr("data-swiper-slide-index"), 10)),
          t.centeredSlides
            ? r < e.loopedSlides - i / 2 ||
              r > e.slides.length - e.loopedSlides + i / 2
              ? (e.loopFix(),
                (r = s
                  .children(
                    `.${t.slideClass}[data-swiper-slide-index="${n}"]:not(.${t.slideDuplicateClass})`
                  )
                  .eq(0)
                  .index()),
                E(() => {
                  e.slideTo(r);
                }))
              : e.slideTo(r)
            : r > e.slides.length - i
            ? (e.loopFix(),
              (r = s
                .children(
                  `.${t.slideClass}[data-swiper-slide-index="${n}"]:not(.${t.slideDuplicateClass})`
                )
                .eq(0)
                .index()),
              E(() => {
                e.slideTo(r);
              }))
            : e.slideTo(r);
      } else e.slideTo(r);
    },
  };
  const q = {
    loopCreate: function () {
      const e = this,
        t = p(),
        { params: s, $wrapperEl: i } = e,
        n = i.children().length > 0 ? T(i.children()[0].parentNode) : i;
      n.children(`.${s.slideClass}.${s.slideDuplicateClass}`).remove();
      let r = n.children(`.${s.slideClass}`);
      if (s.loopFillGroupWithBlank) {
        const e = s.slidesPerGroup - (r.length % s.slidesPerGroup);
        if (e !== s.slidesPerGroup) {
          for (let i = 0; i < e; i += 1) {
            const e = T(t.createElement("div")).addClass(
              `${s.slideClass} ${s.slideBlankClass}`
            );
            n.append(e);
          }
          r = n.children(`.${s.slideClass}`);
        }
      }
      "auto" !== s.slidesPerView ||
        s.loopedSlides ||
        (s.loopedSlides = r.length),
        (e.loopedSlides = Math.ceil(
          parseFloat(s.loopedSlides || s.slidesPerView, 10)
        )),
        (e.loopedSlides += s.loopAdditionalSlides),
        e.loopedSlides > r.length && (e.loopedSlides = r.length);
      const o = [],
        a = [];
      r.each((t, s) => {
        const i = T(t);
        s < e.loopedSlides && a.push(t),
          s < r.length && s >= r.length - e.loopedSlides && o.push(t),
          i.attr("data-swiper-slide-index", s);
      });
      for (let e = 0; e < a.length; e += 1)
        n.append(T(a[e].cloneNode(!0)).addClass(s.slideDuplicateClass));
      for (let e = o.length - 1; e >= 0; e -= 1)
        n.prepend(T(o[e].cloneNode(!0)).addClass(s.slideDuplicateClass));
    },
    loopFix: function () {
      const e = this;
      e.emit("beforeLoopFix");
      const {
        activeIndex: t,
        slides: s,
        loopedSlides: i,
        allowSlidePrev: n,
        allowSlideNext: r,
        snapGrid: o,
        rtlTranslate: a,
      } = e;
      let l;
      (e.allowSlidePrev = !0), (e.allowSlideNext = !0);
      const d = -o[t] - e.getTranslate();
      if (t < i) {
        (l = s.length - 3 * i + t), (l += i);
        e.slideTo(l, 0, !1, !0) &&
          0 !== d &&
          e.setTranslate((a ? -e.translate : e.translate) - d);
      } else if (t >= s.length - i) {
        (l = -s.length + t + i), (l += i);
        e.slideTo(l, 0, !1, !0) &&
          0 !== d &&
          e.setTranslate((a ? -e.translate : e.translate) - d);
      }
      (e.allowSlidePrev = n), (e.allowSlideNext = r), e.emit("loopFix");
    },
    loopDestroy: function () {
      const { $wrapperEl: e, params: t, slides: s } = this;
      e
        .children(
          `.${t.slideClass}.${t.slideDuplicateClass},.${t.slideClass}.${t.slideBlankClass}`
        )
        .remove(),
        s.removeAttr("data-swiper-slide-index");
    },
  };
  function j(e) {
    const t = this,
      s = p(),
      i = h(),
      n = t.touchEventsData,
      { params: r, touches: o, enabled: a } = t;
    if (!a) return;
    if (t.animating && r.preventInteractionOnTransition) return;
    !t.animating && r.cssMode && r.loop && t.loopFix();
    let l = e;
    l.originalEvent && (l = l.originalEvent);
    let d = T(l.target);
    if ("wrapper" === r.touchEventsTarget && !d.closest(t.wrapperEl).length)
      return;
    if (
      ((n.isTouchEvent = "touchstart" === l.type),
      !n.isTouchEvent && "which" in l && 3 === l.which)
    )
      return;
    if (!n.isTouchEvent && "button" in l && l.button > 0) return;
    if (n.isTouched && n.isMoved) return;
    !!r.noSwipingClass &&
      "" !== r.noSwipingClass &&
      l.target &&
      l.target.shadowRoot &&
      e.path &&
      e.path[0] &&
      (d = T(e.path[0]));
    const c = r.noSwipingSelector
        ? r.noSwipingSelector
        : `.${r.noSwipingClass}`,
      u = !(!l.target || !l.target.shadowRoot);
    if (
      r.noSwiping &&
      (u
        ? (function (e, t) {
            return (
              void 0 === t && (t = this),
              (function t(s) {
                return s && s !== p() && s !== h()
                  ? (s.assignedSlot && (s = s.assignedSlot),
                    s.closest(e) || t(s.getRootNode().host))
                  : null;
              })(t)
            );
          })(c, l.target)
        : d.closest(c)[0])
    )
      return void (t.allowClick = !0);
    if (r.swipeHandler && !d.closest(r.swipeHandler)[0]) return;
    (o.currentX = "touchstart" === l.type ? l.targetTouches[0].pageX : l.pageX),
      (o.currentY =
        "touchstart" === l.type ? l.targetTouches[0].pageY : l.pageY);
    const f = o.currentX,
      m = o.currentY,
      g = r.edgeSwipeDetection || r.iOSEdgeSwipeDetection,
      v = r.edgeSwipeThreshold || r.iOSEdgeSwipeThreshold;
    if (g && (f <= v || f >= i.innerWidth - v)) {
      if ("prevent" !== g) return;
      e.preventDefault();
    }
    if (
      (Object.assign(n, {
        isTouched: !0,
        isMoved: !1,
        allowTouchCallbacks: !0,
        isScrolling: void 0,
        startMoving: void 0,
      }),
      (o.startX = f),
      (o.startY = m),
      (n.touchStartTime = y()),
      (t.allowClick = !0),
      t.updateSize(),
      (t.swipeDirection = void 0),
      r.threshold > 0 && (n.allowThresholdMove = !1),
      "touchstart" !== l.type)
    ) {
      let e = !0;
      d.is(n.focusableElements) &&
        ((e = !1), "SELECT" === d[0].nodeName && (n.isTouched = !1)),
        s.activeElement &&
          T(s.activeElement).is(n.focusableElements) &&
          s.activeElement !== d[0] &&
          s.activeElement.blur();
      const i = e && t.allowTouchMove && r.touchStartPreventDefault;
      (!r.touchStartForcePreventDefault && !i) ||
        d[0].isContentEditable ||
        l.preventDefault();
    }
    t.params.freeMode &&
      t.params.freeMode.enabled &&
      t.freeMode &&
      t.animating &&
      !r.cssMode &&
      t.freeMode.onTouchStart(),
      t.emit("touchStart", l);
  }
  function V(e) {
    const t = p(),
      s = this,
      i = s.touchEventsData,
      { params: n, touches: r, rtlTranslate: o, enabled: a } = s;
    if (!a) return;
    let l = e;
    if ((l.originalEvent && (l = l.originalEvent), !i.isTouched))
      return void (
        i.startMoving &&
        i.isScrolling &&
        s.emit("touchMoveOpposite", l)
      );
    if (i.isTouchEvent && "touchmove" !== l.type) return;
    const d =
        "touchmove" === l.type &&
        l.targetTouches &&
        (l.targetTouches[0] || l.changedTouches[0]),
      c = "touchmove" === l.type ? d.pageX : l.pageX,
      u = "touchmove" === l.type ? d.pageY : l.pageY;
    if (l.preventedByNestedSwiper) return (r.startX = c), void (r.startY = u);
    if (!s.allowTouchMove)
      return (
        T(l.target).is(i.focusableElements) || (s.allowClick = !1),
        void (
          i.isTouched &&
          (Object.assign(r, { startX: c, startY: u, currentX: c, currentY: u }),
          (i.touchStartTime = y()))
        )
      );
    if (i.isTouchEvent && n.touchReleaseOnEdges && !n.loop)
      if (s.isVertical()) {
        if (
          (u < r.startY && s.translate <= s.maxTranslate()) ||
          (u > r.startY && s.translate >= s.minTranslate())
        )
          return (i.isTouched = !1), void (i.isMoved = !1);
      } else if (
        (c < r.startX && s.translate <= s.maxTranslate()) ||
        (c > r.startX && s.translate >= s.minTranslate())
      )
        return;
    if (
      i.isTouchEvent &&
      t.activeElement &&
      l.target === t.activeElement &&
      T(l.target).is(i.focusableElements)
    )
      return (i.isMoved = !0), void (s.allowClick = !1);
    if (
      (i.allowTouchCallbacks && s.emit("touchMove", l),
      l.targetTouches && l.targetTouches.length > 1)
    )
      return;
    (r.currentX = c), (r.currentY = u);
    const h = r.currentX - r.startX,
      f = r.currentY - r.startY;
    if (s.params.threshold && Math.sqrt(h ** 2 + f ** 2) < s.params.threshold)
      return;
    if (void 0 === i.isScrolling) {
      let e;
      (s.isHorizontal() && r.currentY === r.startY) ||
      (s.isVertical() && r.currentX === r.startX)
        ? (i.isScrolling = !1)
        : h * h + f * f >= 25 &&
          ((e = (180 * Math.atan2(Math.abs(f), Math.abs(h))) / Math.PI),
          (i.isScrolling = s.isHorizontal()
            ? e > n.touchAngle
            : 90 - e > n.touchAngle));
    }
    if (
      (i.isScrolling && s.emit("touchMoveOpposite", l),
      void 0 === i.startMoving &&
        ((r.currentX === r.startX && r.currentY === r.startY) ||
          (i.startMoving = !0)),
      i.isScrolling)
    )
      return void (i.isTouched = !1);
    if (!i.startMoving) return;
    (s.allowClick = !1),
      !n.cssMode && l.cancelable && l.preventDefault(),
      n.touchMoveStopPropagation && !n.nested && l.stopPropagation(),
      i.isMoved ||
        (n.loop && !n.cssMode && s.loopFix(),
        (i.startTranslate = s.getTranslate()),
        s.setTransition(0),
        s.animating &&
          s.$wrapperEl.trigger("webkitTransitionEnd transitionend"),
        (i.allowMomentumBounce = !1),
        !n.grabCursor ||
          (!0 !== s.allowSlideNext && !0 !== s.allowSlidePrev) ||
          s.setGrabCursor(!0),
        s.emit("sliderFirstMove", l)),
      s.emit("sliderMove", l),
      (i.isMoved = !0);
    let m = s.isHorizontal() ? h : f;
    (r.diff = m),
      (m *= n.touchRatio),
      o && (m = -m),
      (s.swipeDirection = m > 0 ? "prev" : "next"),
      (i.currentTranslate = m + i.startTranslate);
    let g = !0,
      v = n.resistanceRatio;
    if (
      (n.touchReleaseOnEdges && (v = 0),
      m > 0 && i.currentTranslate > s.minTranslate()
        ? ((g = !1),
          n.resistance &&
            (i.currentTranslate =
              s.minTranslate() -
              1 +
              (-s.minTranslate() + i.startTranslate + m) ** v))
        : m < 0 &&
          i.currentTranslate < s.maxTranslate() &&
          ((g = !1),
          n.resistance &&
            (i.currentTranslate =
              s.maxTranslate() +
              1 -
              (s.maxTranslate() - i.startTranslate - m) ** v)),
      g && (l.preventedByNestedSwiper = !0),
      !s.allowSlideNext &&
        "next" === s.swipeDirection &&
        i.currentTranslate < i.startTranslate &&
        (i.currentTranslate = i.startTranslate),
      !s.allowSlidePrev &&
        "prev" === s.swipeDirection &&
        i.currentTranslate > i.startTranslate &&
        (i.currentTranslate = i.startTranslate),
      s.allowSlidePrev ||
        s.allowSlideNext ||
        (i.currentTranslate = i.startTranslate),
      n.threshold > 0)
    ) {
      if (!(Math.abs(m) > n.threshold || i.allowThresholdMove))
        return void (i.currentTranslate = i.startTranslate);
      if (!i.allowThresholdMove)
        return (
          (i.allowThresholdMove = !0),
          (r.startX = r.currentX),
          (r.startY = r.currentY),
          (i.currentTranslate = i.startTranslate),
          void (r.diff = s.isHorizontal()
            ? r.currentX - r.startX
            : r.currentY - r.startY)
        );
    }
    n.followFinger &&
      !n.cssMode &&
      (((n.freeMode && n.freeMode.enabled && s.freeMode) ||
        n.watchSlidesProgress) &&
        (s.updateActiveIndex(), s.updateSlidesClasses()),
      s.params.freeMode &&
        n.freeMode.enabled &&
        s.freeMode &&
        s.freeMode.onTouchMove(),
      s.updateProgress(i.currentTranslate),
      s.setTranslate(i.currentTranslate));
  }
  function F(e) {
    const t = this,
      s = t.touchEventsData,
      { params: i, touches: n, rtlTranslate: r, slidesGrid: o, enabled: a } = t;
    if (!a) return;
    let l = e;
    if (
      (l.originalEvent && (l = l.originalEvent),
      s.allowTouchCallbacks && t.emit("touchEnd", l),
      (s.allowTouchCallbacks = !1),
      !s.isTouched)
    )
      return (
        s.isMoved && i.grabCursor && t.setGrabCursor(!1),
        (s.isMoved = !1),
        void (s.startMoving = !1)
      );
    i.grabCursor &&
      s.isMoved &&
      s.isTouched &&
      (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) &&
      t.setGrabCursor(!1);
    const d = y(),
      c = d - s.touchStartTime;
    if (t.allowClick) {
      const e = l.path || (l.composedPath && l.composedPath());
      t.updateClickedSlide((e && e[0]) || l.target),
        t.emit("tap click", l),
        c < 300 &&
          d - s.lastClickTime < 300 &&
          t.emit("doubleTap doubleClick", l);
    }
    if (
      ((s.lastClickTime = y()),
      E(() => {
        t.destroyed || (t.allowClick = !0);
      }),
      !s.isTouched ||
        !s.isMoved ||
        !t.swipeDirection ||
        0 === n.diff ||
        s.currentTranslate === s.startTranslate)
    )
      return (s.isTouched = !1), (s.isMoved = !1), void (s.startMoving = !1);
    let p;
    if (
      ((s.isTouched = !1),
      (s.isMoved = !1),
      (s.startMoving = !1),
      (p = i.followFinger
        ? r
          ? t.translate
          : -t.translate
        : -s.currentTranslate),
      i.cssMode)
    )
      return;
    if (t.params.freeMode && i.freeMode.enabled)
      return void t.freeMode.onTouchEnd({ currentPos: p });
    let u = 0,
      h = t.slidesSizesGrid[0];
    for (
      let e = 0;
      e < o.length;
      e += e < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup
    ) {
      const t = e < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
      void 0 !== o[e + t]
        ? p >= o[e] && p < o[e + t] && ((u = e), (h = o[e + t] - o[e]))
        : p >= o[e] && ((u = e), (h = o[o.length - 1] - o[o.length - 2]));
    }
    let f = null,
      m = null;
    i.rewind &&
      (t.isBeginning
        ? (m =
            t.params.virtual && t.params.virtual.enabled && t.virtual
              ? t.virtual.slides.length - 1
              : t.slides.length - 1)
        : t.isEnd && (f = 0));
    const g = (p - o[u]) / h,
      v = u < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
    if (c > i.longSwipesMs) {
      if (!i.longSwipes) return void t.slideTo(t.activeIndex);
      "next" === t.swipeDirection &&
        (g >= i.longSwipesRatio
          ? t.slideTo(i.rewind && t.isEnd ? f : u + v)
          : t.slideTo(u)),
        "prev" === t.swipeDirection &&
          (g > 1 - i.longSwipesRatio
            ? t.slideTo(u + v)
            : null !== m && g < 0 && Math.abs(g) > i.longSwipesRatio
            ? t.slideTo(m)
            : t.slideTo(u));
    } else {
      if (!i.shortSwipes) return void t.slideTo(t.activeIndex);
      t.navigation &&
      (l.target === t.navigation.nextEl || l.target === t.navigation.prevEl)
        ? l.target === t.navigation.nextEl
          ? t.slideTo(u + v)
          : t.slideTo(u)
        : ("next" === t.swipeDirection && t.slideTo(null !== f ? f : u + v),
          "prev" === t.swipeDirection && t.slideTo(null !== m ? m : u));
    }
  }
  function W() {
    const e = this,
      { params: t, el: s } = e;
    if (s && 0 === s.offsetWidth) return;
    t.breakpoints && e.setBreakpoint();
    const { allowSlideNext: i, allowSlidePrev: n, snapGrid: r } = e;
    (e.allowSlideNext = !0),
      (e.allowSlidePrev = !0),
      e.updateSize(),
      e.updateSlides(),
      e.updateSlidesClasses(),
      ("auto" === t.slidesPerView || t.slidesPerView > 1) &&
      e.isEnd &&
      !e.isBeginning &&
      !e.params.centeredSlides
        ? e.slideTo(e.slides.length - 1, 0, !1, !0)
        : e.slideTo(e.activeIndex, 0, !1, !0),
      e.autoplay && e.autoplay.running && e.autoplay.paused && e.autoplay.run(),
      (e.allowSlidePrev = n),
      (e.allowSlideNext = i),
      e.params.watchOverflow && r !== e.snapGrid && e.checkOverflow();
  }
  function R(e) {
    const t = this;
    t.enabled &&
      (t.allowClick ||
        (t.params.preventClicks && e.preventDefault(),
        t.params.preventClicksPropagation &&
          t.animating &&
          (e.stopPropagation(), e.stopImmediatePropagation())));
  }
  function Y() {
    const e = this,
      { wrapperEl: t, rtlTranslate: s, enabled: i } = e;
    if (!i) return;
    let n;
    (e.previousTranslate = e.translate),
      e.isHorizontal()
        ? (e.translate = -t.scrollLeft)
        : (e.translate = -t.scrollTop),
      -0 === e.translate && (e.translate = 0),
      e.updateActiveIndex(),
      e.updateSlidesClasses();
    const r = e.maxTranslate() - e.minTranslate();
    (n = 0 === r ? 0 : (e.translate - e.minTranslate()) / r),
      n !== e.progress && e.updateProgress(s ? -e.translate : e.translate),
      e.emit("setTranslate", e.translate, !1);
  }
  let X = !1;
  function U() {}
  const K = (e, t) => {
    const s = p(),
      {
        params: i,
        touchEvents: n,
        el: r,
        wrapperEl: o,
        device: a,
        support: l,
      } = e,
      d = !!i.nested,
      c = "on" === t ? "addEventListener" : "removeEventListener",
      u = t;
    if (l.touch) {
      const t = !(
        "touchstart" !== n.start ||
        !l.passiveListener ||
        !i.passiveListeners
      ) && { passive: !0, capture: !1 };
      r[c](n.start, e.onTouchStart, t),
        r[c](
          n.move,
          e.onTouchMove,
          l.passiveListener ? { passive: !1, capture: d } : d
        ),
        r[c](n.end, e.onTouchEnd, t),
        n.cancel && r[c](n.cancel, e.onTouchEnd, t);
    } else
      r[c](n.start, e.onTouchStart, !1),
        s[c](n.move, e.onTouchMove, d),
        s[c](n.end, e.onTouchEnd, !1);
    (i.preventClicks || i.preventClicksPropagation) &&
      r[c]("click", e.onClick, !0),
      i.cssMode && o[c]("scroll", e.onScroll),
      i.updateOnWindowResize
        ? e[u](
            a.ios || a.android
              ? "resize orientationchange observerUpdate"
              : "resize observerUpdate",
            W,
            !0
          )
        : e[u]("observerUpdate", W, !0);
  };
  const J = {
      attachEvents: function () {
        const e = this,
          t = p(),
          { params: s, support: i } = e;
        (e.onTouchStart = j.bind(e)),
          (e.onTouchMove = V.bind(e)),
          (e.onTouchEnd = F.bind(e)),
          s.cssMode && (e.onScroll = Y.bind(e)),
          (e.onClick = R.bind(e)),
          i.touch && !X && (t.addEventListener("touchstart", U), (X = !0)),
          K(e, "on");
      },
      detachEvents: function () {
        K(this, "off");
      },
    },
    Q = (e, t) => e.grid && t.grid && t.grid.rows > 1;
  const Z = {
    setBreakpoint: function () {
      const e = this,
        {
          activeIndex: t,
          initialized: s,
          loopedSlides: i = 0,
          params: n,
          $el: r,
        } = e,
        o = n.breakpoints;
      if (!o || (o && 0 === Object.keys(o).length)) return;
      const a = e.getBreakpoint(o, e.params.breakpointsBase, e.el);
      if (!a || e.currentBreakpoint === a) return;
      const l = (a in o ? o[a] : void 0) || e.originalParams,
        d = Q(e, n),
        c = Q(e, l),
        p = n.enabled;
      d && !c
        ? (r.removeClass(
            `${n.containerModifierClass}grid ${n.containerModifierClass}grid-column`
          ),
          e.emitContainerClasses())
        : !d &&
          c &&
          (r.addClass(`${n.containerModifierClass}grid`),
          ((l.grid.fill && "column" === l.grid.fill) ||
            (!l.grid.fill && "column" === n.grid.fill)) &&
            r.addClass(`${n.containerModifierClass}grid-column`),
          e.emitContainerClasses());
      const u = l.direction && l.direction !== n.direction,
        h = n.loop && (l.slidesPerView !== n.slidesPerView || u);
      u && s && e.changeDirection(), O(e.params, l);
      const f = e.params.enabled;
      Object.assign(e, {
        allowTouchMove: e.params.allowTouchMove,
        allowSlideNext: e.params.allowSlideNext,
        allowSlidePrev: e.params.allowSlidePrev,
      }),
        p && !f ? e.disable() : !p && f && e.enable(),
        (e.currentBreakpoint = a),
        e.emit("_beforeBreakpoint", l),
        h &&
          s &&
          (e.loopDestroy(),
          e.loopCreate(),
          e.updateSlides(),
          e.slideTo(t - i + e.loopedSlides, 0, !1)),
        e.emit("breakpoint", l);
    },
    getBreakpoint: function (e, t, s) {
      if ((void 0 === t && (t = "window"), !e || ("container" === t && !s)))
        return;
      let i = !1;
      const n = h(),
        r = "window" === t ? n.innerHeight : s.clientHeight,
        o = Object.keys(e).map((e) => {
          if ("string" == typeof e && 0 === e.indexOf("@")) {
            const t = parseFloat(e.substr(1));
            return { value: r * t, point: e };
          }
          return { value: e, point: e };
        });
      o.sort((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10));
      for (let e = 0; e < o.length; e += 1) {
        const { point: r, value: a } = o[e];
        "window" === t
          ? n.matchMedia(`(min-width: ${a}px)`).matches && (i = r)
          : a <= s.clientWidth && (i = r);
      }
      return i || "max";
    },
  };
  const ee = {
    addClasses: function () {
      const e = this,
        { classNames: t, params: s, rtl: i, $el: n, device: r, support: o } = e,
        a = (function (e, t) {
          const s = [];
          return (
            e.forEach((e) => {
              "object" == typeof e
                ? Object.keys(e).forEach((i) => {
                    e[i] && s.push(t + i);
                  })
                : "string" == typeof e && s.push(t + e);
            }),
            s
          );
        })(
          [
            "initialized",
            s.direction,
            { "pointer-events": !o.touch },
            { "free-mode": e.params.freeMode && s.freeMode.enabled },
            { autoheight: s.autoHeight },
            { rtl: i },
            { grid: s.grid && s.grid.rows > 1 },
            {
              "grid-column":
                s.grid && s.grid.rows > 1 && "column" === s.grid.fill,
            },
            { android: r.android },
            { ios: r.ios },
            { "css-mode": s.cssMode },
            { centered: s.cssMode && s.centeredSlides },
          ],
          s.containerModifierClass
        );
      t.push(...a), n.addClass([...t].join(" ")), e.emitContainerClasses();
    },
    removeClasses: function () {
      const { $el: e, classNames: t } = this;
      e.removeClass(t.join(" ")), this.emitContainerClasses();
    },
  };
  const te = {
    init: !0,
    direction: "horizontal",
    touchEventsTarget: "wrapper",
    initialSlide: 0,
    speed: 300,
    cssMode: !1,
    updateOnWindowResize: !0,
    resizeObserver: !0,
    nested: !1,
    createElements: !1,
    enabled: !0,
    focusableElements: "input, select, option, textarea, button, video, label",
    width: null,
    height: null,
    preventInteractionOnTransition: !1,
    userAgent: null,
    url: null,
    edgeSwipeDetection: !1,
    edgeSwipeThreshold: 20,
    autoHeight: !1,
    setWrapperSize: !1,
    virtualTranslate: !1,
    effect: "slide",
    breakpoints: void 0,
    breakpointsBase: "window",
    spaceBetween: 0,
    slidesPerView: 1,
    slidesPerGroup: 1,
    slidesPerGroupSkip: 0,
    slidesPerGroupAuto: !1,
    centeredSlides: !1,
    centeredSlidesBounds: !1,
    slidesOffsetBefore: 0,
    slidesOffsetAfter: 0,
    normalizeSlideIndex: !0,
    centerInsufficientSlides: !1,
    watchOverflow: !0,
    roundLengths: !1,
    touchRatio: 1,
    touchAngle: 45,
    simulateTouch: !0,
    shortSwipes: !0,
    longSwipes: !0,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,
    followFinger: !0,
    allowTouchMove: !0,
    threshold: 0,
    touchMoveStopPropagation: !1,
    touchStartPreventDefault: !0,
    touchStartForcePreventDefault: !1,
    touchReleaseOnEdges: !1,
    uniqueNavElements: !0,
    resistance: !0,
    resistanceRatio: 0.85,
    watchSlidesProgress: !1,
    grabCursor: !1,
    preventClicks: !0,
    preventClicksPropagation: !0,
    slideToClickedSlide: !1,
    preloadImages: !0,
    updateOnImagesReady: !0,
    loop: !1,
    loopAdditionalSlides: 0,
    loopedSlides: null,
    loopFillGroupWithBlank: !1,
    loopPreventsSlide: !0,
    rewind: !1,
    allowSlidePrev: !0,
    allowSlideNext: !0,
    swipeHandler: null,
    noSwiping: !0,
    noSwipingClass: "swiper-no-swiping",
    noSwipingSelector: null,
    passiveListeners: !0,
    maxBackfaceHiddenSlides: 10,
    containerModifierClass: "swiper-",
    slideClass: "swiper-slide",
    slideBlankClass: "swiper-slide-invisible-blank",
    slideActiveClass: "swiper-slide-active",
    slideDuplicateActiveClass: "swiper-slide-duplicate-active",
    slideVisibleClass: "swiper-slide-visible",
    slideDuplicateClass: "swiper-slide-duplicate",
    slideNextClass: "swiper-slide-next",
    slideDuplicateNextClass: "swiper-slide-duplicate-next",
    slidePrevClass: "swiper-slide-prev",
    slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
    wrapperClass: "swiper-wrapper",
    runCallbacksOnInit: !0,
    _emitClasses: !1,
  };
  function se(e, t) {
    return function (s) {
      void 0 === s && (s = {});
      const i = Object.keys(s)[0],
        n = s[i];
      "object" == typeof n && null !== n
        ? (["navigation", "pagination", "scrollbar"].indexOf(i) >= 0 &&
            !0 === e[i] &&
            (e[i] = { auto: !0 }),
          i in e && "enabled" in n
            ? (!0 === e[i] && (e[i] = { enabled: !0 }),
              "object" != typeof e[i] ||
                "enabled" in e[i] ||
                (e[i].enabled = !0),
              e[i] || (e[i] = { enabled: !1 }),
              O(t, s))
            : O(t, s))
        : O(t, s);
    };
  }
  const ie = {
      eventsEmitter: D,
      update: B,
      translate: G,
      transition: {
        setTransition: function (e, t) {
          const s = this;
          s.params.cssMode || s.$wrapperEl.transition(e),
            s.emit("setTransition", e, t);
        },
        transitionStart: function (e, t) {
          void 0 === e && (e = !0);
          const s = this,
            { params: i } = s;
          i.cssMode ||
            (i.autoHeight && s.updateAutoHeight(),
            N({ swiper: s, runCallbacks: e, direction: t, step: "Start" }));
        },
        transitionEnd: function (e, t) {
          void 0 === e && (e = !0);
          const s = this,
            { params: i } = s;
          (s.animating = !1),
            i.cssMode ||
              (s.setTransition(0),
              N({ swiper: s, runCallbacks: e, direction: t, step: "End" }));
        },
      },
      slide: H,
      loop: q,
      grabCursor: {
        setGrabCursor: function (e) {
          const t = this;
          if (
            t.support.touch ||
            !t.params.simulateTouch ||
            (t.params.watchOverflow && t.isLocked) ||
            t.params.cssMode
          )
            return;
          const s =
            "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
          (s.style.cursor = "move"),
            (s.style.cursor = e ? "-webkit-grabbing" : "-webkit-grab"),
            (s.style.cursor = e ? "-moz-grabbin" : "-moz-grab"),
            (s.style.cursor = e ? "grabbing" : "grab");
        },
        unsetGrabCursor: function () {
          const e = this;
          e.support.touch ||
            (e.params.watchOverflow && e.isLocked) ||
            e.params.cssMode ||
            (e[
              "container" === e.params.touchEventsTarget ? "el" : "wrapperEl"
            ].style.cursor = "");
        },
      },
      events: J,
      breakpoints: Z,
      checkOverflow: {
        checkOverflow: function () {
          const e = this,
            { isLocked: t, params: s } = e,
            { slidesOffsetBefore: i } = s;
          if (i) {
            const t = e.slides.length - 1,
              s = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * i;
            e.isLocked = e.size > s;
          } else e.isLocked = 1 === e.snapGrid.length;
          !0 === s.allowSlideNext && (e.allowSlideNext = !e.isLocked),
            !0 === s.allowSlidePrev && (e.allowSlidePrev = !e.isLocked),
            t && t !== e.isLocked && (e.isEnd = !1),
            t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock");
        },
      },
      classes: ee,
      images: {
        loadImage: function (e, t, s, i, n, r) {
          const o = h();
          let a;
          function l() {
            r && r();
          }
          T(e).parent("picture")[0] || (e.complete && n)
            ? l()
            : t
            ? ((a = new o.Image()),
              (a.onload = l),
              (a.onerror = l),
              i && (a.sizes = i),
              s && (a.srcset = s),
              t && (a.src = t))
            : l();
        },
        preloadImages: function () {
          const e = this;
          function t() {
            null != e &&
              e &&
              !e.destroyed &&
              (void 0 !== e.imagesLoaded && (e.imagesLoaded += 1),
              e.imagesLoaded === e.imagesToLoad.length &&
                (e.params.updateOnImagesReady && e.update(),
                e.emit("imagesReady")));
          }
          e.imagesToLoad = e.$el.find("img");
          for (let s = 0; s < e.imagesToLoad.length; s += 1) {
            const i = e.imagesToLoad[s];
            e.loadImage(
              i,
              i.currentSrc || i.getAttribute("src"),
              i.srcset || i.getAttribute("srcset"),
              i.sizes || i.getAttribute("sizes"),
              !0,
              t
            );
          }
        },
      },
    },
    ne = {};
  class re {
    constructor() {
      let e, t;
      for (var s = arguments.length, i = new Array(s), n = 0; n < s; n++)
        i[n] = arguments[n];
      if (
        (1 === i.length &&
        i[0].constructor &&
        "Object" === Object.prototype.toString.call(i[0]).slice(8, -1)
          ? (t = i[0])
          : ([e, t] = i),
        t || (t = {}),
        (t = O({}, t)),
        e && !t.el && (t.el = e),
        t.el && T(t.el).length > 1)
      ) {
        const e = [];
        return (
          T(t.el).each((s) => {
            const i = O({}, t, { el: s });
            e.push(new re(i));
          }),
          e
        );
      }
      const r = this;
      (r.__swiper__ = !0),
        (r.support = _()),
        (r.device = I({ userAgent: t.userAgent })),
        (r.browser = z()),
        (r.eventsListeners = {}),
        (r.eventsAnyListeners = []),
        (r.modules = [...r.__modules__]),
        t.modules && Array.isArray(t.modules) && r.modules.push(...t.modules);
      const o = {};
      r.modules.forEach((e) => {
        e({
          swiper: r,
          extendParams: se(t, o),
          on: r.on.bind(r),
          once: r.once.bind(r),
          off: r.off.bind(r),
          emit: r.emit.bind(r),
        });
      });
      const a = O({}, te, o);
      return (
        (r.params = O({}, a, ne, t)),
        (r.originalParams = O({}, r.params)),
        (r.passedParams = O({}, t)),
        r.params &&
          r.params.on &&
          Object.keys(r.params.on).forEach((e) => {
            r.on(e, r.params.on[e]);
          }),
        r.params && r.params.onAny && r.onAny(r.params.onAny),
        (r.$ = T),
        Object.assign(r, {
          enabled: r.params.enabled,
          el: e,
          classNames: [],
          slides: T(),
          slidesGrid: [],
          snapGrid: [],
          slidesSizesGrid: [],
          isHorizontal: () => "horizontal" === r.params.direction,
          isVertical: () => "vertical" === r.params.direction,
          activeIndex: 0,
          realIndex: 0,
          isBeginning: !0,
          isEnd: !1,
          translate: 0,
          previousTranslate: 0,
          progress: 0,
          velocity: 0,
          animating: !1,
          allowSlideNext: r.params.allowSlideNext,
          allowSlidePrev: r.params.allowSlidePrev,
          touchEvents: (function () {
            const e = ["touchstart", "touchmove", "touchend", "touchcancel"],
              t = ["pointerdown", "pointermove", "pointerup"];
            return (
              (r.touchEventsTouch = {
                start: e[0],
                move: e[1],
                end: e[2],
                cancel: e[3],
              }),
              (r.touchEventsDesktop = { start: t[0], move: t[1], end: t[2] }),
              r.support.touch || !r.params.simulateTouch
                ? r.touchEventsTouch
                : r.touchEventsDesktop
            );
          })(),
          touchEventsData: {
            isTouched: void 0,
            isMoved: void 0,
            allowTouchCallbacks: void 0,
            touchStartTime: void 0,
            isScrolling: void 0,
            currentTranslate: void 0,
            startTranslate: void 0,
            allowThresholdMove: void 0,
            focusableElements: r.params.focusableElements,
            lastClickTime: y(),
            clickTimeout: void 0,
            velocities: [],
            allowMomentumBounce: void 0,
            isTouchEvent: void 0,
            startMoving: void 0,
          },
          allowClick: !0,
          allowTouchMove: r.params.allowTouchMove,
          touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
          imagesToLoad: [],
          imagesLoaded: 0,
        }),
        r.emit("_swiper"),
        r.params.init && r.init(),
        r
      );
    }
    enable() {
      const e = this;
      e.enabled ||
        ((e.enabled = !0),
        e.params.grabCursor && e.setGrabCursor(),
        e.emit("enable"));
    }
    disable() {
      const e = this;
      e.enabled &&
        ((e.enabled = !1),
        e.params.grabCursor && e.unsetGrabCursor(),
        e.emit("disable"));
    }
    setProgress(e, t) {
      const s = this;
      e = Math.min(Math.max(e, 0), 1);
      const i = s.minTranslate(),
        n = (s.maxTranslate() - i) * e + i;
      s.translateTo(n, void 0 === t ? 0 : t),
        s.updateActiveIndex(),
        s.updateSlidesClasses();
    }
    emitContainerClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const t = e.el.className
        .split(" ")
        .filter(
          (t) =>
            0 === t.indexOf("swiper") ||
            0 === t.indexOf(e.params.containerModifierClass)
        );
      e.emit("_containerClasses", t.join(" "));
    }
    getSlideClasses(e) {
      const t = this;
      return e.className
        .split(" ")
        .filter(
          (e) =>
            0 === e.indexOf("swiper-slide") ||
            0 === e.indexOf(t.params.slideClass)
        )
        .join(" ");
    }
    emitSlidesClasses() {
      const e = this;
      if (!e.params._emitClasses || !e.el) return;
      const t = [];
      e.slides.each((s) => {
        const i = e.getSlideClasses(s);
        t.push({ slideEl: s, classNames: i }), e.emit("_slideClass", s, i);
      }),
        e.emit("_slideClasses", t);
    }
    slidesPerViewDynamic(e, t) {
      void 0 === e && (e = "current"), void 0 === t && (t = !1);
      const {
        params: s,
        slides: i,
        slidesGrid: n,
        slidesSizesGrid: r,
        size: o,
        activeIndex: a,
      } = this;
      let l = 1;
      if (s.centeredSlides) {
        let e,
          t = i[a].swiperSlideSize;
        for (let s = a + 1; s < i.length; s += 1)
          i[s] &&
            !e &&
            ((t += i[s].swiperSlideSize), (l += 1), t > o && (e = !0));
        for (let s = a - 1; s >= 0; s -= 1)
          i[s] &&
            !e &&
            ((t += i[s].swiperSlideSize), (l += 1), t > o && (e = !0));
      } else if ("current" === e)
        for (let e = a + 1; e < i.length; e += 1) {
          (t ? n[e] + r[e] - n[a] < o : n[e] - n[a] < o) && (l += 1);
        }
      else
        for (let e = a - 1; e >= 0; e -= 1) {
          n[a] - n[e] < o && (l += 1);
        }
      return l;
    }
    update() {
      const e = this;
      if (!e || e.destroyed) return;
      const { snapGrid: t, params: s } = e;
      function i() {
        const t = e.rtlTranslate ? -1 * e.translate : e.translate,
          s = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
        e.setTranslate(s), e.updateActiveIndex(), e.updateSlidesClasses();
      }
      let n;
      s.breakpoints && e.setBreakpoint(),
        e.updateSize(),
        e.updateSlides(),
        e.updateProgress(),
        e.updateSlidesClasses(),
        e.params.freeMode && e.params.freeMode.enabled
          ? (i(), e.params.autoHeight && e.updateAutoHeight())
          : ((n =
              ("auto" === e.params.slidesPerView ||
                e.params.slidesPerView > 1) &&
              e.isEnd &&
              !e.params.centeredSlides
                ? e.slideTo(e.slides.length - 1, 0, !1, !0)
                : e.slideTo(e.activeIndex, 0, !1, !0)),
            n || i()),
        s.watchOverflow && t !== e.snapGrid && e.checkOverflow(),
        e.emit("update");
    }
    changeDirection(e, t) {
      void 0 === t && (t = !0);
      const s = this,
        i = s.params.direction;
      return (
        e || (e = "horizontal" === i ? "vertical" : "horizontal"),
        e === i ||
          ("horizontal" !== e && "vertical" !== e) ||
          (s.$el
            .removeClass(`${s.params.containerModifierClass}${i}`)
            .addClass(`${s.params.containerModifierClass}${e}`),
          s.emitContainerClasses(),
          (s.params.direction = e),
          s.slides.each((t) => {
            "vertical" === e ? (t.style.width = "") : (t.style.height = "");
          }),
          s.emit("changeDirection"),
          t && s.update()),
        s
      );
    }
    mount(e) {
      const t = this;
      if (t.mounted) return !0;
      const s = T(e || t.params.el);
      if (!(e = s[0])) return !1;
      e.swiper = t;
      const i = () =>
        `.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`;
      let n = (() => {
        if (e && e.shadowRoot && e.shadowRoot.querySelector) {
          const t = T(e.shadowRoot.querySelector(i()));
          return (t.children = (e) => s.children(e)), t;
        }
        return s.children(i());
      })();
      if (0 === n.length && t.params.createElements) {
        const e = p().createElement("div");
        (n = T(e)),
          (e.className = t.params.wrapperClass),
          s.append(e),
          s.children(`.${t.params.slideClass}`).each((e) => {
            n.append(e);
          });
      }
      return (
        Object.assign(t, {
          $el: s,
          el: e,
          $wrapperEl: n,
          wrapperEl: n[0],
          mounted: !0,
          rtl: "rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction"),
          rtlTranslate:
            "horizontal" === t.params.direction &&
            ("rtl" === e.dir.toLowerCase() || "rtl" === s.css("direction")),
          wrongRTL: "-webkit-box" === n.css("display"),
        }),
        !0
      );
    }
    init(e) {
      const t = this;
      if (t.initialized) return t;
      return (
        !1 === t.mount(e) ||
          (t.emit("beforeInit"),
          t.params.breakpoints && t.setBreakpoint(),
          t.addClasses(),
          t.params.loop && t.loopCreate(),
          t.updateSize(),
          t.updateSlides(),
          t.params.watchOverflow && t.checkOverflow(),
          t.params.grabCursor && t.enabled && t.setGrabCursor(),
          t.params.preloadImages && t.preloadImages(),
          t.params.loop
            ? t.slideTo(
                t.params.initialSlide + t.loopedSlides,
                0,
                t.params.runCallbacksOnInit,
                !1,
                !0
              )
            : t.slideTo(
                t.params.initialSlide,
                0,
                t.params.runCallbacksOnInit,
                !1,
                !0
              ),
          t.attachEvents(),
          (t.initialized = !0),
          t.emit("init"),
          t.emit("afterInit")),
        t
      );
    }
    destroy(e, t) {
      void 0 === e && (e = !0), void 0 === t && (t = !0);
      const s = this,
        { params: i, $el: n, $wrapperEl: r, slides: o } = s;
      return (
        void 0 === s.params ||
          s.destroyed ||
          (s.emit("beforeDestroy"),
          (s.initialized = !1),
          s.detachEvents(),
          i.loop && s.loopDestroy(),
          t &&
            (s.removeClasses(),
            n.removeAttr("style"),
            r.removeAttr("style"),
            o &&
              o.length &&
              o
                .removeClass(
                  [
                    i.slideVisibleClass,
                    i.slideActiveClass,
                    i.slideNextClass,
                    i.slidePrevClass,
                  ].join(" ")
                )
                .removeAttr("style")
                .removeAttr("data-swiper-slide-index")),
          s.emit("destroy"),
          Object.keys(s.eventsListeners).forEach((e) => {
            s.off(e);
          }),
          !1 !== e &&
            ((s.$el[0].swiper = null),
            (function (e) {
              const t = e;
              Object.keys(t).forEach((e) => {
                try {
                  t[e] = null;
                } catch (e) {}
                try {
                  delete t[e];
                } catch (e) {}
              });
            })(s)),
          (s.destroyed = !0)),
        null
      );
    }
    static extendDefaults(e) {
      O(ne, e);
    }
    static get extendedDefaults() {
      return ne;
    }
    static get defaults() {
      return te;
    }
    static installModule(e) {
      re.prototype.__modules__ || (re.prototype.__modules__ = []);
      const t = re.prototype.__modules__;
      "function" == typeof e && t.indexOf(e) < 0 && t.push(e);
    }
    static use(e) {
      return Array.isArray(e)
        ? (e.forEach((e) => re.installModule(e)), re)
        : (re.installModule(e), re);
    }
  }
  Object.keys(ie).forEach((e) => {
    Object.keys(ie[e]).forEach((t) => {
      re.prototype[t] = ie[e][t];
    });
  }),
    re.use([
      function (e) {
        let { swiper: t, on: s, emit: i } = e;
        const n = h();
        let r = null,
          o = null;
        const a = () => {
            t &&
              !t.destroyed &&
              t.initialized &&
              (i("beforeResize"), i("resize"));
          },
          l = () => {
            t && !t.destroyed && t.initialized && i("orientationchange");
          };
        s("init", () => {
          t.params.resizeObserver && void 0 !== n.ResizeObserver
            ? t &&
              !t.destroyed &&
              t.initialized &&
              ((r = new ResizeObserver((e) => {
                o = n.requestAnimationFrame(() => {
                  const { width: s, height: i } = t;
                  let n = s,
                    r = i;
                  e.forEach((e) => {
                    let { contentBoxSize: s, contentRect: i, target: o } = e;
                    (o && o !== t.el) ||
                      ((n = i ? i.width : (s[0] || s).inlineSize),
                      (r = i ? i.height : (s[0] || s).blockSize));
                  }),
                    (n === s && r === i) || a();
                });
              })),
              r.observe(t.el))
            : (n.addEventListener("resize", a),
              n.addEventListener("orientationchange", l));
        }),
          s("destroy", () => {
            o && n.cancelAnimationFrame(o),
              r && r.unobserve && t.el && (r.unobserve(t.el), (r = null)),
              n.removeEventListener("resize", a),
              n.removeEventListener("orientationchange", l);
          });
      },
      function (e) {
        let { swiper: t, extendParams: s, on: i, emit: n } = e;
        const r = [],
          o = h(),
          a = function (e, t) {
            void 0 === t && (t = {});
            const s = new (o.MutationObserver || o.WebkitMutationObserver)(
              (e) => {
                if (1 === e.length) return void n("observerUpdate", e[0]);
                const t = function () {
                  n("observerUpdate", e[0]);
                };
                o.requestAnimationFrame
                  ? o.requestAnimationFrame(t)
                  : o.setTimeout(t, 0);
              }
            );
            s.observe(e, {
              attributes: void 0 === t.attributes || t.attributes,
              childList: void 0 === t.childList || t.childList,
              characterData: void 0 === t.characterData || t.characterData,
            }),
              r.push(s);
          };
        s({ observer: !1, observeParents: !1, observeSlideChildren: !1 }),
          i("init", () => {
            if (t.params.observer) {
              if (t.params.observeParents) {
                const e = t.$el.parents();
                for (let t = 0; t < e.length; t += 1) a(e[t]);
              }
              a(t.$el[0], { childList: t.params.observeSlideChildren }),
                a(t.$wrapperEl[0], { attributes: !1 });
            }
          }),
          i("destroy", () => {
            r.forEach((e) => {
              e.disconnect();
            }),
              r.splice(0, r.length);
          });
      },
    ]);
  const oe = re;
  function ae(e) {
    let { swiper: t, extendParams: s, on: i, emit: n } = e;
    function r(e) {
      let s;
      return (
        e &&
          ((s = T(e)),
          t.params.uniqueNavElements &&
            "string" == typeof e &&
            s.length > 1 &&
            1 === t.$el.find(e).length &&
            (s = t.$el.find(e))),
        s
      );
    }
    function o(e, s) {
      const i = t.params.navigation;
      e &&
        e.length > 0 &&
        (e[s ? "addClass" : "removeClass"](i.disabledClass),
        e[0] && "BUTTON" === e[0].tagName && (e[0].disabled = s),
        t.params.watchOverflow &&
          t.enabled &&
          e[t.isLocked ? "addClass" : "removeClass"](i.lockClass));
    }
    function a() {
      if (t.params.loop) return;
      const { $nextEl: e, $prevEl: s } = t.navigation;
      o(s, t.isBeginning && !t.params.rewind),
        o(e, t.isEnd && !t.params.rewind);
    }
    function l(e) {
      e.preventDefault(),
        (!t.isBeginning || t.params.loop || t.params.rewind) && t.slidePrev();
    }
    function d(e) {
      e.preventDefault(),
        (!t.isEnd || t.params.loop || t.params.rewind) && t.slideNext();
    }
    function c() {
      const e = t.params.navigation;
      if (
        ((t.params.navigation = (function (e, t, s, i) {
          const n = p();
          return (
            e.params.createElements &&
              Object.keys(i).forEach((r) => {
                if (!s[r] && !0 === s.auto) {
                  let o = e.$el.children(`.${i[r]}`)[0];
                  o ||
                    ((o = n.createElement("div")),
                    (o.className = i[r]),
                    e.$el.append(o)),
                    (s[r] = o),
                    (t[r] = o);
                }
              }),
            s
          );
        })(t, t.originalParams.navigation, t.params.navigation, {
          nextEl: "swiper-button-next",
          prevEl: "swiper-button-prev",
        })),
        !e.nextEl && !e.prevEl)
      )
        return;
      const s = r(e.nextEl),
        i = r(e.prevEl);
      s && s.length > 0 && s.on("click", d),
        i && i.length > 0 && i.on("click", l),
        Object.assign(t.navigation, {
          $nextEl: s,
          nextEl: s && s[0],
          $prevEl: i,
          prevEl: i && i[0],
        }),
        t.enabled ||
          (s && s.addClass(e.lockClass), i && i.addClass(e.lockClass));
    }
    function u() {
      const { $nextEl: e, $prevEl: s } = t.navigation;
      e &&
        e.length &&
        (e.off("click", d), e.removeClass(t.params.navigation.disabledClass)),
        s &&
          s.length &&
          (s.off("click", l), s.removeClass(t.params.navigation.disabledClass));
    }
    s({
      navigation: {
        nextEl: null,
        prevEl: null,
        hideOnClick: !1,
        disabledClass: "swiper-button-disabled",
        hiddenClass: "swiper-button-hidden",
        lockClass: "swiper-button-lock",
      },
    }),
      (t.navigation = {
        nextEl: null,
        $nextEl: null,
        prevEl: null,
        $prevEl: null,
      }),
      i("init", () => {
        c(), a();
      }),
      i("toEdge fromEdge lock unlock", () => {
        a();
      }),
      i("destroy", () => {
        u();
      }),
      i("enable disable", () => {
        const { $nextEl: e, $prevEl: s } = t.navigation;
        e &&
          e[t.enabled ? "removeClass" : "addClass"](
            t.params.navigation.lockClass
          ),
          s &&
            s[t.enabled ? "removeClass" : "addClass"](
              t.params.navigation.lockClass
            );
      }),
      i("click", (e, s) => {
        const { $nextEl: i, $prevEl: r } = t.navigation,
          o = s.target;
        if (t.params.navigation.hideOnClick && !T(o).is(r) && !T(o).is(i)) {
          if (
            t.pagination &&
            t.params.pagination &&
            t.params.pagination.clickable &&
            (t.pagination.el === o || t.pagination.el.contains(o))
          )
            return;
          let e;
          i
            ? (e = i.hasClass(t.params.navigation.hiddenClass))
            : r && (e = r.hasClass(t.params.navigation.hiddenClass)),
            n(!0 === e ? "navigationShow" : "navigationHide"),
            i && i.toggleClass(t.params.navigation.hiddenClass),
            r && r.toggleClass(t.params.navigation.hiddenClass);
        }
      }),
      Object.assign(t.navigation, { update: a, init: c, destroy: u });
  }
  function le() {
    let e = document.querySelectorAll(
      '[class*="__swiper"]:not(.swiper-wrapper)'
    );
    e &&
      e.forEach((e) => {
        e.parentElement.classList.add("swiper"),
          e.classList.add("swiper-wrapper");
        for (const t of e.children) t.classList.add("swiper-slide");
      });
  }
  window.addEventListener("DOMContentLoaded", () => {
    le(),
      document.querySelector(".about__slider") &&
        new oe(".about__slider", {
          modules: [ae],
          observer: !0,
          observeParents: !0,
          slidesPerView: 1,
          spaceBetween: 0,
          autoHeight: !0,
          speed: 800,
          loop: !0,
          navigation: {
            nextEl: ".about__arrow_next",
            prevEl: ".about__arrow_prev",
          },
          breakpoints: {
            320: { slidesPerView: 1, spaceBetween: 0, autoHeight: !0 },
            768: { slidesPerView: 2, spaceBetween: 0 },
            992: { slidesPerView: 2, spaceBetween: 34 },
          },
          on: {},
        });
  });
  const de = document.querySelectorAll("[data-scroll]");
  function ce() {
    de.forEach((e, t) => {
      e.getBoundingClientRect().top < 0.8 * window.innerHeight
        ? e.classList.add("_scroll-active")
        : e.classList.remove("_scroll-active");
    });
  }
  window.addEventListener("load", ce),
    window.addEventListener("scroll", ce),
    window.addEventListener("DOMContentLoaded", function () {
      const e = document.getElementById("skeleton-wrapper");
      e &&
        ((e.style.opacity = "0"),
        (e.style.pointerEvents = "none"),
        setTimeout(() => e.remove(), 300));
    }),
    (window.FLS = !0),
    (function (e) {
      let t = new Image();
      (t.onload = t.onerror =
        function () {
          e(2 == t.height);
        }),
        (t.src =
          "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
    })(function (e) {
      let t = !0 === e ? "webp" : "no-webp";
      document.documentElement.classList.add(t);
    }),
    (function () {
      let e = document.querySelector(".icon-menu");
      e &&
        e.addEventListener("click", function (e) {
          s && (i(), document.documentElement.classList.toggle("menu-open"));
        });
    })(),
    (function () {
      if (document.querySelectorAll("[data-fullscreen]").length && t.any()) {
        function e() {
          let e = 0.01 * window.innerHeight;
          document.documentElement.style.setProperty("--vh", `${e}px`);
        }
        window.addEventListener("resize", e), e();
      }
    })(),
    new e({}),
    a.emailTest(document.getElementById("email-input")),
    (function () {
      const e = document.querySelectorAll(".rating");
      e.length > 0 &&
        (function () {
          let t, s;
          for (let t = 0; t < e.length; t++) {
            i(e[t]);
          }
          function i(e) {
            n(e), r(), e.classList.contains("rating_set") && o(e);
          }
          function n(e) {
            (t = e.querySelector(".rating__active")),
              (s = e.querySelector(".rating__value"));
          }
          function r(e = s.innerHTML) {
            const i = e / 0.05;
            t.style.width = `${i}%`;
          }
          function o(e) {
            const t = e.querySelectorAll(".rating__item");
            for (let i = 0; i < t.length; i++) {
              const o = t[i];
              o.addEventListener("mouseenter", function (t) {
                n(e), r(o.value);
              }),
                o.addEventListener("mouseleave", function (e) {
                  r();
                }),
                o.addEventListener("click", function (t) {
                  n(e),
                    e.dataset.ajax
                      ? a(o.value, e)
                      : ((s.innerHTML = i + 1), r());
                });
            }
          }
          async function a(e, t) {
            if (!t.classList.contains("rating_sending")) {
              t.classList.add("rating_sending");
              let e = await fetch("rating.json", { method: "GET" });
              if (e.ok) {
                const i = (await e.json()).newRating;
                (s.innerHTML = i), r(), t.classList.remove("rating_sending");
              } else alert("Ошибка"), t.classList.remove("rating_sending");
            }
          }
        })();
    })(),
    ce();
})();
