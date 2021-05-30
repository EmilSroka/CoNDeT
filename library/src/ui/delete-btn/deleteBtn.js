window.CoNDeT.ui.DeleteTableBtnComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "DeleteTableBtnComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("span");
  };

  constructor.prototype.onInit = function () {
    this.ref.className = "delete-table-btn";
    this.ref.setAttribute("role", "button");
    this.ref.setAttribute("aria-label", "Delete table");
    this.ref.setAttribute("tabindex", 0);

    this.ref.innerText = "❌";
  };

  return constructor;
})();