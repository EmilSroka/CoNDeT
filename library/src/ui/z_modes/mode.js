window.CoNDeT.ui.BaseMode = {
  setToAllComponents: function (componentInstance) {
    var Strategy = getEntryStrategy(componentInstance);
    componentInstance.setStrategy(new Strategy());

    for (var i=0; i<componentInstance.children; i++) {
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
}

window.CoNDeT.ui.componentToEditModeEntryStrategy = {
  DisplayComponent: window.CoNDeT.ui.DisplayEditMode,
  TableComponent: window.CoNDeT.ui.TableComponentEditMode,
}

window.CoNDeT.ui.DisplayMode = new window.CoNDeT.ui.Mode(window.CoNDeT.ui.componentToDisplayModeEntryStrategy);

window.CoNDeT.ui.EditMode = new window.CoNDeT.ui.Mode(window.CoNDeT.ui.componentToEditModeEntryStrategy);
