window.CoNDeT.ui.DeleteColumnComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "DeleteColumnComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("span");
  };

  constructor.prototype.onInit = function () {
    this.ref.className = "del-col-element";
    this.ref.setAttribute("role", "button");
    this.ref.setAttribute("aria-label", "Delete column");
    this.ref.setAttribute("tabindex", 0);

    this.ref.innerHTML = "❌";
  };

  return constructor;
})();
