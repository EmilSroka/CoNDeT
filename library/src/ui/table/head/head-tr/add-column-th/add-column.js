window.CoNDeT.ui.AddColumnComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "AddColumnComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("th");
  }

  constructor.prototype.onInit = function () {
    if (!this.props.className) return;
    this.ref.className = this.props.className;
  }

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.IconBtnComponent, id: "add-column", props: {
      action: this.props.action, icon: this.common.icons.add, className: "add-column-btn", label: "Add column"
    }}]
  }

  return constructor;
})();
