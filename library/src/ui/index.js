window.CoNDeT.ui = {
  BaseComponent: {
    init: function (common, props) {
      this.ref = this.onInit(common, props);
      this.common = common;
    },
    update: function (common, props) {
      this.onUpdate(common, props);
      this.common = common;
    },
    destroy: function (common) {
      if (this.children != null) {
        for (let i = 0; i < children.length; i++) {
          children[i].destroy(common);
        }
      }
      this.onDestroy(common);
    },
    getPosition: function () {
      return {
        x: this.ref.offsetLeft,
        y: this.ref.offsetTop,
      };
    },
    getDimensions: function () {
      return {
        width: this.ref.clientWidth,
        height: this.ref.clientHeight,
      };
    },
    containsPoint: function (x, y) {
      return (
        x >= this.ref.offsetLeft &&
        x <= this.ref.offsetLeft + this.ref.clientWidth &&
        y >= this.ref.offsetTop &&
        y <= this.ref.offsetTop + this.ref.clientHeight
      );
    },
    setState: function (state) {
      if (this.state != null) this.state.onDestroy();
      this.state = state;
      this.state.onInit();
    },
    setupEventListeners: function () {
      var self = this;

      this.ref.addEventListener("keyup", function () {
        self.strategy.onKeyUp();
      });
      this.ref.addEventListener("keydown", function () {
        self.strategy.onKeyDown();
      });
      this.ref.addEventListener("mouseup", function () {
        self.strategy.onMouseUp();
      });
      this.ref.addEventListener("mousedown", function () {
        self.strategy.onMouseDown();
      });
    },
    appendChild: function (child, position = 0) {
      if (this.children == null || position > this.children.length) return;
      if (position == this.children.length) {
        this.ref.appendChild(child);
      } else {
        this.ref.insertBefore(child, this.children[position]);
      }
      this.children.splice(position, 0, child);
    },
    createChild: function (componentRef, props, position = 0) {
      var child = componentRef.init(this.common, props);
      this.appendChild(child, position);
    },
    removeChild: function (component) {
      if (this.children == null) return;
      for (let i = 0; i < this.children.length; i++) {
        if (this.children[i] === component) {
          this.children[i].destroy(this.common);
          this.children.splice(i, 1);
        }
      }
    },
    removeChildAtPosition: function (position) {
      if (position <= -1 || position >= this.children.length) return;
      var childToRemove = this.children[position];
      this.removeChild(childToRemove);
    },
  },

  DisplayMode: (function () {
    function constructor() {}

    this.deltaXY = null;
    this.currentDelta = null;

    constructor.prototype.onKeyDown = function (event) {};
    constructor.prototype.onKeyUp = function (event) {};
    constructor.prototype.onMouseDown = function (event) {
      this.deltaXY = this.ref.getCurrentXY();
      this.currentDelta = { x: event.clientX, y: event.clientY };
    };
    constructor.prototype.onMouseMove = function (event) {
      if (this.deltaXY == null) return;
      this.currentDelta = { x: event.clientX, y: event.clientY };
      this.ref.setDeltaXY({
        x: this.deltaXY.x + this.currentDelta.x,
        y: this.deltaXY.y + this.currentDelta.y,
      });
    };
    constructor.prototype.onMouseUp = function (event) {
      if (this.deltaXY == null) return;
      this.currentDelta = { x: event.clientX, y: event.clientY };
      this.ref.setDeltaXY({
        x: this.deltaXY.x + this.currentDelta.x,
        y: this.deltaXY.y + this.currentDelta.y,
      });
      this.deltaXY = null;
      this.currentDelta = null;
    };
    constructor.prototype.onMouseLeave = function (event) {
      if (this.deltaXY == null) return;
      this.currentDelta = { x: event.clientX, y: event.clientY };
      this.ref.setDeltaXY({
        x: this.deltaXY.x + this.currentDelta.x,
        y: this.deltaXY.y + this.currentDelta.y,
      });
      this.deltaXY = null;
      this.currentDelta = null;
    };

    constructor.prototype.onInit = function () {
      this.ref = window.CoNDeT.ui.DisplayComponent;
    };
    constructor.prototype.onDestroy = function () {};

    return constructor;
  })(),
};
