window.CoNDeT.ui.CellEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onDbClick = function () {
    if (this.component.props.disabled) return;
    this.component.setStrategy(new window.CoNDeT.ui.CellEditState())
  }

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.TextComponent, id: "text", props: { isSmall: false, value: this.component.props.value }}]
  }

  return constructor;
})();

window.CoNDeT.ui.CellEditState = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onKeyDown = function (event) {
    if (event.keyCode !== 13) return;

    this.component.setStrategy(new window.CoNDeT.ui.CellEditMode())
  }

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.InputComponent, id: "input", props: { onSubmit: this.component.props.changeValue, value: this.component.props.value }}]
  }

  return constructor;
})();

