window.CoNDeT.ui.ArrowComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);

  constructor.prototype.onInit = function (common, props) {
    var element = document.createElementNS("path");
    var d =
      "M " +
      props.x +
      " " +
      props.y +
      "L " +
      props.x -
      5 +
      " " +
      props.y -
      5 +
      "L " +
      props.x -
      5 +
      " " +
      props.y +
      5 +
      " Z";
    element.setAttribute("d", d);
    return element;
  };

  constructor.prototype.onUpdate = function (common, props) {
    var d =
      "M " +
      props.x +
      " " +
      props.y +
      "L " +
      props.x -
      5 +
      " " +
      props.y -
      5 +
      "L " +
      props.x -
      5 +
      " " +
      props.y +
      5 +
      " Z";
    this.ref.setAttribute("d", d);
  };

  constructor.prototype.onDestroy = function () {
    this.ref.remove();
  };

  return constructor;
})();
