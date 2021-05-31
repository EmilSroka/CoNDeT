window.CoNDeT.ui.AddColBtnEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onMouseDown = function (event) {
    event.stopPropagation();
    window.CoNDeT.core.addColumn(this.component);
  };

  return constructor;
})();
