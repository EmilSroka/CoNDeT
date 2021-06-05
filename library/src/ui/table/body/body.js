window.CoNDeT.ui.BodyComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "BodyComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tbody");
  };

  return constructor;
})();
