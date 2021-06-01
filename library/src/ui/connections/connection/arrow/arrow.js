window.CoNDeT.ui.ArrowComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "ArrowComponent";

  constructor.prototype.createRef = function () {
    return document.createElementNS("http://www.w3.org/2000/svg", "path");
  }
  constructor.prototype.onUpdate = function () {
    this.ref.setAttribute("d", calcPath(this.props.x, this.props.y));
  }

  return constructor;

  function calcPath (x, y) {
    return "M " + x + " " + y + "L " + (x - 5) + " " + (y - 5) + "L " + (x + 5) + " " + (y - 5) + " Z";
  }
})();
