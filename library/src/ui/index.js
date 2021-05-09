window.CoNDeT.ui.BaseComponent = {
  init: function (common, props) {
    this.children = [];
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
    this.state.onInit(this);
  },
  setupEventListeners: function () {
    var self = this;

    this.ref.addEventListener("keyup", function (event) {
      self.strategy.onKeyUp(event);
    });
    this.ref.addEventListener("keydown", function (event) {
      self.strategy.onKeyDown(event);
    });
    this.ref.addEventListener("mouseup", function (event) {
      self.strategy.onMouseUp(event);
    });
    this.ref.addEventListener("mousedown", function (event) {
      self.strategy.onMouseDown(event);
    });
    this.ref.addEventListener("mousemove", function (event) {
      self.strategy.onMouseMove(event);
    });
  },
  appendChild: function (child, position = 0) {
    if (this.children == null || position > this.children.length) return;
    if (position === this.children.length) {
      this.ref.appendChild(child);
    } else {
      this.ref.insertBefore(child, this.children[position]);
    }
    this.children.splice(position, 0, child);
  },
  createChild: function (ComponentRef, props, position = 0) {
    var child = new ComponentRef();
    componentRef.init(this.common, props);
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
};
