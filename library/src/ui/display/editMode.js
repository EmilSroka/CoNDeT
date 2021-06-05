window.CoNDeT.ui.DisplayEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onDbClick = function (event) {
    this.component.common.addTable({
      x: event.clientX + this.component.state.deltaXY.x,
      y: event.clientY + this.component.state.deltaXY.y,
    });
  }

  constructor.prototype.getChildren = function () {
    var self = this;
    var children = [];

    var tablesProps = window.CoNDeT.core.toTableProps(this.component.props.state, this.component.state.deltaXY);
    for (var i = 0; i < this.component.props.state.length; i++) {
      tablesProps[i].moveTable = function (id, x, y) {
        self.component.common.stateModifier.moveTable(id, { x: x - self.component.state.deltaXY.x, y: y - self.component.state.deltaXY.y})
      }
      children.push({ type: window.CoNDeT.ui.TableComponent, id: tablesProps[i].id, props: tablesProps[i] });
    }
    var size = this.component.getDimensions();
    children.push({ type: window.CoNDeT.ui.ConnectionsComponent, id: "connections",
      props: { getConnections: function () { return window.CoNDeT.core.toConnectionsProps(self.component, self.component.props.state) }, width: size.width, height: size.height }});

    return children;
  }

  return constructor;
})();
