window.CoNDeT.ui.ConnectionEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onMouseDown = function (event) {
    if (!event.ctrlKey) return;

    this.component.props.delete();
  }

  return constructor;
})();
