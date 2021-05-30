window.CoNDeT.ui.HeadDisplayMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    return [
      {
        type: window.CoNDeT.ui.HeadTrComponent,
        id: "tr",
        props: this.component.props,
      },
    ];
  };

  return constructor;
})();
