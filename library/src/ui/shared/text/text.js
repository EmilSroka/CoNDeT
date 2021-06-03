/*
 * props:
 * * isSmall
 * * value
 */
window.CoNDeT.ui.TextComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "TextComponent";

  constructor.prototype.createRef = function () {
    return document.createElement(this.props.isSmall ? "small": "span");
  }
  constructor.prototype.onUpdate = function () {
    this.ref.innerHTML = this.props.value;
  }

  return constructor;
})();
