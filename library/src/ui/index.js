window.CoNDeT.ui = {
  BaseComponent: {
    init: function (common, props) {
      this.ref = this.onInit(common, props);
      this.common = common;
    },
    update: function (common, props) {
      this.ref.onUpdate(common, props);
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
      if (this.state == null) return;
      this.state.onDestroy();
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
      if (this.children != null && position <= this.children.length) {
        if (position == this.children.length) {
          this.ref.appendChild(child);
        } else {
          this.ref.insertBefore(child, this.children[position]);
        }
        this.children.splice(position, 0, child);
      }
    },
    createChild: function (componentRef, props, position = 0) {
      var child = componentRef.init(this.common, props);
      this.appendChild(child, position);
    },
    removeChild: function (component) {
      if (this.children != null) {
        for (let i = 0; i < this.children.length; i++) {
          if (this.children[i] === component) {
            this.children.splice(i, 1);
            this.children[i].destroy(this.common);
          }
        }
      }
    },
    removeChildAtPosition: function (position) {
      if (position > -1 && position < this.children.length) {
        this.children.splice(position, 1);
        this.children[position].destroy(this.common);
      }
    },
  },
};
