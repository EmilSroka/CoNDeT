window.CoNDeT.ui.DisplayDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.updateXY = function (event) {
    if (this.currentDelta == null) return;
    this.display.setState({
      deltaXY: {
        x: this.startPosition.x + event.clientX - this.currentDelta.x,
        y: this.startPosition.y + event.clientY - this.currentDelta.y,
      },
    });
  };
  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = {
      x: this.display.state.deltaXY.x,
      y: this.display.state.deltaXY.y,
    };
    this.display.ref.style.cursor = "grabbing";
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.currentDelta = null;
    this.startPosition = null;
    this.display.ref.style.cursor = "grab";
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
  };

  constructor.prototype.onInit = function (display) {
    this.display = display;
    this.resetState();
  };
  constructor.prototype.onDestroy = function () {
    this.display.ref.style.cursor = "auto";
  }

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.display.ref.style.cursor = "grab";
  };

  return constructor;
})();
