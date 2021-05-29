window.CoNDeT.ui.InputEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onKeyDown = function (event) {
    if (event.keyCode !== 13) return;

    this.component.props.onSubmit(this.component.ref.value);
  }

  return constructor;
})();
