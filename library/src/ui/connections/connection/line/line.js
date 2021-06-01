window.CoNDeT.ui.LineComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "LineComponent";

  constructor.prototype.createRef = function () {
    return document.createElementNS("http://www.w3.org/2000/svg", "path");
  }
  constructor.prototype.onUpdate = function () {
    this.ref.setAttribute("d", calcPath(this.props.path));
  }

  return constructor;

  function calcPath (path) {
    var d = "M " + path[0].x + " " + path[0].y;
    for (var i = 1; i < path.length; i++) {
      d += "L " + path[i].x + " " + path[i].y;
    }
    return d;
  }
})();