window.CoNDeT.ui.AddRowComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "AddRowComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("tr");
  };

  constructor.prototype.getChildren = function () {
    return [{
      type: window.CoNDeT.ui.AddRowCellComponent,
      id: "add-row-cell",
      props: this.props,
    }];
  };

  return constructor;
})();
