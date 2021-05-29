/*
 * props:
 * * name -> table name
 * * class -> table CoNDeT class
 * * id -> table id
 */
window.CoNDeT.ui.CaptionComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "CaptionComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("caption");
  };
  constructor.prototype.onInit = function () {
    this.ref.className = "condet-caption";
  }

  return constructor;
})();