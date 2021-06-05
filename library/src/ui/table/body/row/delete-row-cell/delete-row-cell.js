window.CoNDeT.ui.DeleteRowCellComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "DeleteRowCellComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("td");
  };
  constructor.prototype.getChildren = function () {
    return [{
      type: window.CoNDeT.ui.IconBtnComponent,
      id: "add-row",
      props: {
        action: this.props.deleteRow,
        icon: this.common.icons.delete,
        className: "delete-column-btn",
        label: "Delete row",
      },
    }];
  };

  return constructor;
})();
