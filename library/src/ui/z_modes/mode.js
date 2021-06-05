window.CoNDeT.ui.BaseMode = {
  setToAllComponents: function (componentInstance) {
    var strategy = this.getEntryStrategy(componentInstance);
    componentInstance.setStrategy(strategy);

    for (var i = 0; i < componentInstance.children.length; i++) {
      this.setToAllComponents(componentInstance.children[i]);
    }
  },
  getEntryStrategy: function (componentInstance) {
    var Mode =
      this.mapper[Object.getPrototypeOf(componentInstance).typeId] ||
      window.CoNDeT.ui.BaseStrategy;
    return new Mode();
  },
};

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
  HeadComponent: window.CoNDeT.ui.HeadDisplayMode,
  ConnectionComponent: window.CoNDeT.ui.ConnectionDisplayMode,
  RowComponent: window.CoNDeT.ui.RowDisplayMode,
  HeadTrComponent: window.CoNDeT.ui.HeadTrDisplayMode,
  IconBtnComponent: window.CoNDeT.ui.IconBtnDisplayMode,
  THComponent: window.CoNDeT.ui.THDisplayMode,
  BodyComponent: window.CoNDeT.ui.BodyComponentDisplayMode,
};

window.CoNDeT.ui.componentToEditModeEntryStrategy = {
  DisplayComponent: window.CoNDeT.ui.DisplayEditMode,
  TableComponent: window.CoNDeT.ui.TableComponentEditMode,
  CellComponent: window.CoNDeT.ui.CellEditMode,
  TextComponent: window.CoNDeT.ui.TextEditMode,
  InputComponent: window.CoNDeT.ui.InputEditMode,
  CaptionComponent: window.CoNDeT.ui.CaptionEditMode,
  HeadComponent: window.CoNDeT.ui.HeadEditMode,
  ConnectionComponent: window.CoNDeT.ui.ConnectionEditMode,
  RowComponent: window.CoNDeT.ui.RowEditMode,
  HeadTrComponent: window.CoNDeT.ui.HeadTrEditMode,
  IconBtnComponent: window.CoNDeT.ui.IconBtnEditMode,
  THComponent: window.CoNDeT.ui.THEditMode,
  BodyComponent: window.CoNDeT.ui.BodyComponentEditMode,
};

window.CoNDeT.ui.componentToAddConnectionModeEntryStrategy = {
  DisplayComponent: window.CoNDeT.ui.DisplayAddConnectionMode,
  TableComponent: window.CoNDeT.ui.TableComponentAddConnectionMode,
  CellComponent: window.CoNDeT.ui.CellDisplayMode,
  TextComponent: window.CoNDeT.ui.TextDisplayMode,
  InputComponent: window.CoNDeT.ui.InputDisplayMode,
  CaptionComponent: window.CoNDeT.ui.CaptionDisplayMode,
  HeadComponent: window.CoNDeT.ui.HeadDisplayMode,
  ConnectionComponent: window.CoNDeT.ui.ConnectionDisplayMode,
  RowComponent: window.CoNDeT.ui.RowDisplayMode,
  HeadTrComponent: window.CoNDeT.ui.HeadTrDisplayMode,
  IconBtnComponent: window.CoNDeT.ui.IconBtnDisplayMode,
  THComponent: window.CoNDeT.ui.THDisplayMode,
  BodyComponent: window.CoNDeT.ui.BodyComponentDisplayMode,
};

window.CoNDeT.ui.DisplayModeConstructor = (function () {
  function constructor() {
    this.mapper = window.CoNDeT.ui.componentToDisplayModeEntryStrategy;
  }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseMode);

  return constructor;
})();

window.CoNDeT.ui.EditModeConstructor = (function () {
  function constructor() {
    this.mapper = window.CoNDeT.ui.componentToEditModeEntryStrategy;
  }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseMode);

  return constructor;
})();

window.CoNDeT.ui.AddConnectionModeConstructor = (function () {
  function constructor() {
    this.mapper = window.CoNDeT.ui.componentToAddConnectionModeEntryStrategy;
    this.state = {
      from: "",
      to: "",
      row: "",
    }
  }

  constructor.prototype = Object.create(window.CoNDeT.ui.BaseMode);

  constructor.prototype.setFrom = function (from) {
    this.state.from = from;
  }
  constructor.prototype.setTo = function (to) {
    this.state.to = to;
  }
  constructor.prototype.setRow = function (row) {
    this.state.row = row;
  }

  return constructor;
})();