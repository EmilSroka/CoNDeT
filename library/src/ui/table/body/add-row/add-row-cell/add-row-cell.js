window.CoNDeT.ui.AddRowCellComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "AddRowCellComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("td");
  };
  constructor.prototype.getChildren = function () {
    return [{
      type: window.CoNDeT.ui.IconBtnComponent,
      id: "add-row",
      props: {
        action: this.props.addRow,
        icon: this.common.icons.add,
        className: "add-column-btn",
        label: "Add row",
      },
    }];
  };

  return constructor;
})();
