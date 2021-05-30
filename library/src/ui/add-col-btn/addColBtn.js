window.CoNDeT.ui.AddColumnComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "AddColumnComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("span");
  };

  constructor.prototype.onInit = function () {
    this.ref.className = "add-col-element";
    this.ref.innerHTML = "❎";
  };

  return constructor;
})();
