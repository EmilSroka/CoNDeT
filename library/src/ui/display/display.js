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

  return constructor;
})();
