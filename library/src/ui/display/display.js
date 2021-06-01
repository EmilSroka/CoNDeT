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
    this.ref.style.position = "relative";
    this.ref.style.overflow = "hidden";
  }
  constructor.prototype.getChildren = function () {
    var self = this;
    var children = [];

    var tablesProps = window.CoNDeT.core.toTableProps(this.props.state, this.state.deltaXY);
    for (var i = 0; i < this.props.state.length; i++) {
      tablesProps[i].moveTable = function (id, x, y) {
        self.common.stateModifier.moveTable(id, { x: x - self.state.deltaXY.x, y: y - self.state.deltaXY.y})
      }
      children.push({ type: window.CoNDeT.ui.TableComponent, id: tablesProps[i].id, props: tablesProps[i] });
    }
    var size = this.getDimensions();
    children.push({ type: window.CoNDeT.ui.ConnectionsComponent, id: "connections",
      props: { getConnections: function () { return window.CoNDeT.core.toConnectionsProps(self, self.props.state) }, width: size.width, height: size.height }});

    return children;
  }

  return constructor;
})();
