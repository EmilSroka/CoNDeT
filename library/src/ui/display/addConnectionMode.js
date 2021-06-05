window.CoNDeT.ui.DisplayAddConnectionMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.updateXY = function (event) {
    if (this.currentDelta == null) return;
    this.component.setState({
      deltaXY: {
        x: this.startPosition.x + event.clientX - this.currentDelta.x,
        y: this.startPosition.y + event.clientY - this.currentDelta.y,
      },
    });
  };
  constructor.prototype.onMouseDown = function (event) {
    this.currentDelta = { x: event.clientX, y: event.clientY };
    this.startPosition = {
      x: this.component.state.deltaXY.x,
      y: this.component.state.deltaXY.y,
    };
    this.component.ref.style.cursor = "grabbing";
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.currentDelta = null;
    this.startPosition = null;
    this.component.ref.style.cursor = "grab";
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.resetState();
  };

  constructor.prototype.onInit = function (display) {
    this.component = display;
    this.resetState();
  };
  constructor.prototype.onDestroy = function () {
    this.component.ref.style.cursor = "auto";
  }

  constructor.prototype.resetState = function () {
    this.currentDelta = null;
    this.startPosition = null;
    this.component.ref.style.cursor = "grab";
  };

  constructor.prototype.getChildren = function () {
    var children = [];

    var tablesProps = window.CoNDeT.core.toTableProps(this.component.props.state, this.component.state.deltaXY);
    for (var i = 0; i < this.component.props.state.length; i++) {
      tablesProps[i].moveTable = function (id, x, y) {
        self.component.common.stateModifier.moveTable(id, { x: x - self.component.state.deltaXY.x, y: y - self.component.state.deltaXY.y})
      }
      children.push({ type: window.CoNDeT.ui.TableComponent, id: tablesProps[i].id, props: tablesProps[i] });
    }

    return children;
  }

  return constructor;
})();
