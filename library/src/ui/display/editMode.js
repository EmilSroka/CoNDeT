window.CoNDeT.ui.DisplayEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onInit = function (display) {
    this.display = display;
  };

  return constructor;
})();
