/*
* props:
* * className
* * label
* * icon
*/
window.CoNDeT.ui.IconBtnComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "IconBtnComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("span");
  };

  constructor.prototype.onInit = function () {
    this.ref.className = this.props.className;
    this.ref.setAttribute("role", "button");
    this.ref.setAttribute("aria-label", this.props.label);
    this.ref.setAttribute("tabindex", 0);

    this.ref.innerHTML = this.props.icon;
  };

  return constructor;
})();
