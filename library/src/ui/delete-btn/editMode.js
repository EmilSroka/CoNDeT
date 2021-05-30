window.CoNDeT.ui.DeleteTableBtnEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onMouseDown = function () {
    this.component.common.stateModifier.removeTable(this.component.props.id);
  }

  constructor.prototype.onKeyDown = function (event) {
    if (event.keyCode !== 13) return;

    this.component.common.stateModifier.removeTable(this.component.props.id);
  }

  return constructor;
})();
