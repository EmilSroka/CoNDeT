window.CoNDeT.ui.IconBtnEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onMouseDown = function (event) {
    event.stopPropagation();
    this.component.props.action(event);
  };

  return constructor;
})();
