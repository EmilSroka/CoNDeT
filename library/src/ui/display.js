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
  constructor.prototype.onInit = function () {
    this.setState({ deltaXY: { x: 0, y: 0 } });
    this.ref.style.position = 'relative';
    this.ref.style.overflow = 'hidden';
  }
  constructor.prototype.getChildren = function () {
    var children = [];

    var tablesProps = window.CoNDeT.core.toTableProps(this.props.state, this.state.deltaXY);
    for (var i = 0; i < this.props.state.length; i++) {
      children.push({ type: window.CoNDeT.ui.TableComponent, id: tablesProps[i].id, props: tablesProps[i] });
    }

    return children;
  }

  return constructor;
})();

window.CoNDeT.ui.DisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseStrategy);

  constructor.prototype.updateXY = function (event) {
    if (this.currentDelta == null) return;
    this.display.setState({ deltaXY: {
        x: this.startPosition.x + event.clientX - this.currentDelta.x,
        y: this.startPosition.y + event.clientY - this.currentDelta.y,
      }});
  };
  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = { x: this.display.state.deltaXY.x, y: this.display.state.deltaXY.y }
    this.display.ref.style.cursor = 'grabbing';
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.currentDelta = null;
    this.startPosition = null;
    this.display.ref.style.cursor = 'grab';
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
  };

  constructor.prototype.onInit = function (display) {
    this.display = display;
    this.resetState();
  };

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.display.ref.style.cursor = 'grab';
  }

  return constructor;
})();
