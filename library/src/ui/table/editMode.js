window.CoNDeT.ui.TableComponentEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.updateXY = function (event) {
    if (this.startPosition == null) return;
    this.table.common.stateModifier.moveTable(
      this.table.id,
      {
        x: this.startPosition.x + event.clientX - this.currentDelta.x,
        y: this.startPosition.y + event.clientY - this.currentDelta.y
      }
    )
  };

  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = { x: this.table.props.coordinates.x, y: this.table.props.coordinates.y }
    this.table.ref.style.cursor = "grabbing";
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.currentDelta = null;
    this.startPosition = null;
    this.table.ref.style.cursor = "grab";
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
    this.table.ref.className = "condet-table condet-class-" + this.table.props.class;
  };
  constructor.prototype.onMouseEnter = function () {
    this.table.ref.className = "condet-table condet-class-" + this.table.props.class + " condet-table-movable";
  }

  constructor.prototype.onInit = function (table) {
    this.table = table;
    this.resetState();
  };

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.table.ref.style.cursor = "grab";
  }

  return constructor;
})();
