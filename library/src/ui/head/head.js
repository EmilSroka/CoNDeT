/*
 * props:
 * * conditions -> list of conditions (strings)
 * * decisions -> list of decisions (strings)
 */
window.CoNDeT.ui.HeadComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "HeadComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("thead");
  };

  return constructor;
})();
