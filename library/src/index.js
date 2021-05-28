window.CoNDeT = function (configs) {
  var selector = configs.selector || ".condet-display";
  var modeName = configs.entryMode || "display";

  var state = new window.CoNDeT.data.State();
  var display = new window.CoNDeT.ui.DisplayComponent();
  var common = {
    stateModifier: new window.CoNDeT.data.StateModifier(state),
    mode: getMode(modeName),
    addTable: addTable,
  };

  display.init(common, selector, { selector: selector, state: state.state });

  state.subscribe(function (newState) {
    display.update({
      selector: selector,
      state: newState,
    });
  });

  return {
    setState: function (newState) {
      state.setState(newState);
    },
    readFromFile: function () {
      window.CoNDeT.data.FileReaderWriter.readFromFile(function (newState) {
        state.setState(newState);
      });
    },
    saveToFile: function () {
      window.CoNDeT.data.FileReaderWriter.saveToFile(state.state);
    },
    changeMode: function (modeName) {
      common.mode = getMode(modeName);
      common.mode.setToAllComponents(display);
    },
    addTable: addTable,
  };

  function getMode(modeName) {
    if (modeName === "edit") {
      return window.CoNDeT.ui.EditMode;
    }

    if (modeName === "display") {
      return window.CoNDeT.ui.DisplayMode;
    }

    return new window.CoNDeT.ui.Mode({});
  }

  function addTable() {
    if (common.mode === window.CoNDeT.ui.DisplayMode) return;

    var tableObj = {};
    var rowTab = [];
    var id = prompt("Enter Table ID:");
    var name = prompt("Enter Table Name:");
    var classType = prompt("Enter Table Class:");

    for (var i = 0; i < 3; i++) {
      rowTab.push({
        conditions: [],
        decisions: [],
        connections: [],
        row_id: id + "_row_" + i,
      });
    }

    tableObj.id = id;
    tableObj.name = name;
    tableObj.class = classType;
    tableObj.coordinates = {};
    tableObj.coordinates.x = 0;
    tableObj.coordinates.y = 0;
    tableObj.columns = {};
    tableObj.columns.conditions = ["defaultCon", ""];
    tableObj.columns.decisions = ["defaultDet", ""];
    tableObj.rows = rowTab;

    common.stateModifier.createTable(tableObj);
  }
};

window.CoNDeT.ui = {};
window.CoNDeT.core = {};
