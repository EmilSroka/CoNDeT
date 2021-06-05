window.CoNDeT.ui.AddConnectionCellComponent = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseComponent);
  constructor.prototype.typeId = "DeleteRowCellComponent";

  constructor.prototype.createRef = function () {
    return document.createElement("td");
  };
  constructor.prototype.getChildren = function () {
    return [{
      type: window.CoNDeT.ui.IconBtnComponent,
      id: "add-connection",
      props: {
        action: this.props.startAddingConnection,
        icon: this.common.icons.add,
        className: "add-connection-btn",
        label: "Add connection",
      },
    }];
  };

  return constructor;
})();
