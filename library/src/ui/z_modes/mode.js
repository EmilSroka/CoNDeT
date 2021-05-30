window.CoNDeT.ui.BaseMode = {
  setToAllComponents: function (componentInstance) {
    var strategy = this.getEntryStrategy(componentInstance);
    componentInstance.setStrategy(strategy);

    for (var i=0; i<componentInstance.children.length; i++) {
      this.setToAllComponents(componentInstance.children[i]);
    }
  },
  getEntryStrategy: function (componentInstance) {
    var Mode = this.mapper[Object.getPrototypeOf(componentInstance).typeId] || window.CoNDeT.ui.BaseStrategy;
    return new Mode();
  }
}

window.CoNDeT.ui.Mode = (function () {
  function constructor(mapper) {
    this.mapper = mapper;
  }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseMode);

  return constructor;
})();

window.CoNDeT.ui.componentToDisplayModeEntryStrategy = {
  DisplayComponent: window.CoNDeT.ui.DisplayDisplayMode,
  TableComponent: window.CoNDeT.ui.TableComponentDisplayMode,
  CellComponent: window.CoNDeT.ui.CellDisplayMode,
  TextComponent: window.CoNDeT.ui.TextDisplayMode,
  InputComponent: window.CoNDeT.ui.InputDisplayMode,
  CaptionComponent: window.CoNDeT.ui.CaptionDisplayMode,
}

window.CoNDeT.ui.componentToEditModeEntryStrategy = {
  DisplayComponent: window.CoNDeT.ui.DisplayEditMode,
  TableComponent: window.CoNDeT.ui.TableComponentEditMode,
  CellComponent: window.CoNDeT.ui.CellEditMode,
  TextComponent: window.CoNDeT.ui.TextEditMode,
  InputComponent: window.CoNDeT.ui.InputEditMode,
  CaptionComponent: window.CoNDeT.ui.CaptionEditMode,
  DeleteTableBtnComponent: window.CoNDeT.ui.DeleteTableBtnEditMode,
}

window.CoNDeT.ui.DisplayMode = new window.CoNDeT.ui.Mode(window.CoNDeT.ui.componentToDisplayModeEntryStrategy);

window.CoNDeT.ui.EditMode = new window.CoNDeT.ui.Mode(window.CoNDeT.ui.componentToEditModeEntryStrategy);
