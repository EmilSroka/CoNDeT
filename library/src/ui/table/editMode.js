window.CoNDeT.ui.TableComponentEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.updateXY = function (event) {
    if (this.startPosition == null) return;
    this.component.props.moveTable(
      this.component.id,
      this.startPosition.x + event.clientX - this.currentDelta.x,
      this.startPosition.y + event.clientY - this.currentDelta.y
    );
  };

  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = { x: this.component.props.coordinates.x, y: this.component.props.coordinates.y }
    this.component.ref.style.cursor = "grabbing";
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.resetState();
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
    this.component.ref.className = "condet-table condet-class-" + this.component.props.class;
  };
  constructor.prototype.onMouseEnter = function () {
    this.component.ref.className = "condet-table condet-class-" + this.component.props.class + " condet-table-movable";
  }

  constructor.prototype.onInit = function (table) {
    this.component = table;
    this.resetState();
  };
  constructor.prototype.onDestroy = function () {
    this.component.ref.style.cursor = "inherit";
  };

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.component.ref.style.cursor = "grab";
  }

  return constructor;
})();
