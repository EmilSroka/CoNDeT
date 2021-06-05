window.CoNDeT.ui.THEditMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onDbClick = function (event) {
    event.stopPropagation();
    this.component.setStrategy(new window.CoNDeT.ui.THEditState())
  }

  constructor.prototype.getChildren = function () {
    return [
      { type: window.CoNDeT.ui.IconBtnComponent, id: "delete-column", props: {
        action: this.component.props.delete, icon: this.component.common.icons.delete, className: "delete-column-btn", label: "Delete column"
      }},
      { type: window.CoNDeT.ui.TextComponent, id: "text", props: { isSmall: false, value: this.component.props.value }},
    ]
  }

  return constructor;
})();

window.CoNDeT.ui.THEditState = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onKeyDown = function (event) {
    if (event.keyCode !== 13) return;

    this.component.setStrategy(new window.CoNDeT.ui.THEditMode())
  }

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.InputComponent, id: "input", props: { onSubmit: this.component.props.changeValue, value: this.component.props.value }}]
  }

  return constructor;
})();

