/*
 * props:
 * * getConnections -> callback that return list of paths
 * * width
 * * height
 */
window.CoNDeT.ui.ConnectionsComponent = (function () {
  var constructor = function () {};

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "ConnectionsComponent";

  constructor.prototype.createRef = function () {
    return document.createElementNS("http://www.w3.org/2000/svg", "svg");
  }
  constructor.prototype.getChildren = function () {
    var children = [];
    var connections = this.props.getConnections();
    for (var i = 0; i<connections.length; i++) {
      children.push({ type: window.CoNDeT.ui.ConnectionComponent, id: connections[i].id, props: { path: connections[i].path, delete: connections[i].delete } });
    }
    return children;
  }
  constructor.prototype.onUpdate = function () {
    this.ref.setAttribute(
        "viewBox",
        "0 0 " + this.props.width + " " + this.props.height
    );
  }

  return constructor;
})();