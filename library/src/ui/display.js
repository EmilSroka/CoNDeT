/*
 * props
 * * selector -> css selector of display wrapper
 * * state
 */
window.CoNDeT.ui.DisplayComponent = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "DisplayComponent";

  constructor.prototype.createRef = function () {
    return document.querySelector(this.props.selector);
  }
  constructor.prototype.getChildren = function () {
    var children = [];

    var tablesProps = window.CoNDeT.core.toTableProps(this.props.state);
    for (var i = 0; i < this.props.state.length; i++) {
      children.push({ type: window.CoNDeT.ui.TableComponent, id: tablesProps[i].id, props: tablesProps[i] });
    }

    return children;
  }

  constructor.prototype.setCurrentXY = function (currentXY) {
    this.common.deltaXY = { x: currentXY.x, y: currentXY.y };
  };

  constructor.prototype.getCurrentXY = function () {
    return this.common.deltaXY;
  };

  return constructor;
})();

window.CoNDeT.ui.DisplayMode = (function () {
  function constructor() {
    this.deltaXY = null;
    this.currentDelta = null;
  }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseStrategy);

  constructor.prototype.updateXY = function (event) {
    if (this.deltaXY == null) return;
    this.ref.setCurrentXY({
      x: this.deltaXY.x + this.currentDelta.x - event.clientX,
      y: this.deltaXY.y + this.currentDelta.y - event.clientY,
    });
  };

  constructor.prototype.onKeyDown = function (event) {};
  constructor.prototype.onKeyUp = function (event) {};
  constructor.prototype.onMouseDown = function (event) {
    this.deltaXY = this.ref.getCurrentXY();
    this.currentDelta = { x: event.clientX, y: event.clientY };
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.deltaXY = null;
    this.currentDelta = null;
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.deltaXY = null;
    this.currentDelta = null;
  };

  constructor.prototype.onInit = function (ref) {
    this.ref = ref;
  };
  constructor.prototype.onDestroy = function () {};

  return constructor;
})();
