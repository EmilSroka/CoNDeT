window.CoNDeT.ui.TableComponentAddConnectionMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onMouseDown = function (event) {
    event.stopPropagation();
    this.component.common.stateModifier.addConnection(
      this.component.common.mode.state.from,
      this.component.common.mode.state.row,
      this.component.id,
    );
    this.component.common.setMode("edit");
  };
  constructor.prototype.onMouseLeave = function () {
    this.component.ref.className = "condet-table condet-class-" + this.component.props.class;
  };
  constructor.prototype.onMouseEnter = function () {
    this.component.ref.className = "condet-table condet-class-" + this.component.props.class + " condet-table-selected";
  }

  constructor.prototype.onInit = function (table) {
    this.component = table;
    this.component.ref.style.cursor = "pointer";
  };
  constructor.prototype.onDestroy = function () {
    this.component.ref.style.cursor = "inherit";
  };

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;

  }

  return constructor;
})();
