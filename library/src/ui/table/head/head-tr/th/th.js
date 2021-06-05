window.CoNDeT.ui.THComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "THComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("th");
  }
  constructor.prototype.onInit = function () {
    this.ref.className = this.props.className;
  }

  return constructor;
})();
