window.CoNDeT.ui.ConnectionComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

  constructor.prototype.onInit = function (common, props) {
    var element = document.createElementNS("path");
    element.setAttribute("d", this.calcPath(props.path));
    this.appendChild(window.CoNDeT.ui.ArrowComponent, {
      x: props.path[props.path.length - 1].x,
      y: props.path[props.path.length - 1].y,
    });
    return element;
  };

  constructor.prototype.onUpdate = function (common, props) {
    this.ref.setAttribute("d", this.calcPath(props.path));
    this.children[0].update({
      x: props.path[props.path.length - 1].x,
      y: props.path[props.path.length - 1].y,
    });
  };

  constructor.prototype.onDestroy = function () {
    this.ref.remove();
  };

  constructor.prototype.calcPath = function (path) {
    var d = "M " + path[0].x + " " + path[0].y;
    for (var i = 1; i < path.length; i++) {
      var point = "L " + path[i].x + " " + path[i].y;
      d += point;
    }
    return d;
  };

  return constructor;
})();
