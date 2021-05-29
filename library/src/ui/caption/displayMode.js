window.CoNDeT.ui.CaptionDisplayMode = (function () {
  function constructor() { }

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    return [
      { type: window.CoNDeT.ui.TextComponent, id: "name", props: { isSmall: false, value: this.component.props.name }},
      { type: window.CoNDeT.ui.TextComponent, id: "class", props: { isSmall: true, value: " (class: " + this.component.props.class }},
      { type: window.CoNDeT.ui.TextComponent, id: "id", props: { isSmall: true, value: ", id: " + this.component.props.id + ")" }}
    ];
  }

  return constructor;
})();
