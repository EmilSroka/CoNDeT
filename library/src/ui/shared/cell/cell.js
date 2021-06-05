window.CoNDeT.ui.CellComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "CellComponent";

  constructor.prototype.createRef = function () {
    return document.createElement(this.props.type);
  }
  constructor.prototype.onInit = function () {
    if (!this.props.className) return;
    this.ref.className = this.props.className;
  }

  return constructor;
})();