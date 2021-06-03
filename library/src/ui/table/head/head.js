window.CoNDeT.ui.HeadComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "HeadComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("thead");
  };

  constructor.prototype.getChildren = function () {
    return [
      {
        type: window.CoNDeT.ui.HeadTrComponent,
        id: "tr",
        props: this.props,
      },
    ];
  };

  return constructor;
})();
