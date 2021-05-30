window.CoNDeT.ui.DeleteColBtnEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onMouseDown = function (event) {
    event.stopPropagation();
    window.CoNDeT.core.deleteColumn(this.component);
  };

  return constructor;
})();
