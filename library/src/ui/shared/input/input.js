/*
 * props:
 * * value
 * * onSubmit
 */
window.CoNDeT.ui.InputComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "InputComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("input");
  }
  constructor.prototype.onInit = function () {
    var self = this;

    this.ref.type = "text";
    this.ref.value = this.props.value;
    setTimeout(function () {
      self.ref.focus();
    }, 0);
  }

  return constructor;
})();