window.CoNDeT.ui.THDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    return [{ type: window.CoNDeT.ui.TextComponent, id: "text", props: { isSmall: false, value: this.component.props.value }}]
  }

  return constructor;
})();
