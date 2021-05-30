window.CoNDeT.ui.HeadEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.getChildren = function () {
    return [
      {
        type: window.CoNDeT.ui.HeadTrComponent,
        id: "tr",
        props: this.component.props,
      },
      {
        type: window.CoNDeT.ui.AddColumnComponent,
        id: "add-col-edit",
        props: { id: this.component.props.id },
      },
      {
        type: window.CoNDeT.ui.DeleteColumnComponent,
        id: "del-col-edit",
        props: this.component.props,
      },
    ];
  };

  return constructor;
})();
