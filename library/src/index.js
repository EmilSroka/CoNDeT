window.CoNDeT = function (configs) {
  var selector = configs.selector || ".condet-display";
  var modeName = configs.entryMode || "display";
  var icons = configs.icons || {};

  var state = new window.CoNDeT.data.State();
  var display = new window.CoNDeT.ui.DisplayComponent();
  var common = {
    stateModifier: new window.CoNDeT.data.StateModifier(state),
    mode: getMode(modeName),
    setMode: setMode,
    icons: window.CoNDeT.core.getIcons(icons),
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
    changeMode: setMode,
    addTable: window.CoNDeT.core.addTable(common),
  };

  function getMode(modeName) {
    if (modeName === "edit") {
      return new window.CoNDeT.ui.EditModeConstructor();
    }

    if (modeName === "display") {
      return new window.CoNDeT.ui.DisplayModeConstructor();
    }

    if (modeName === "add connection") {
      return new window.CoNDeT.ui.AddConnectionModeConstructor();
    }

    return new window.CoNDeT.ui.Mode({});
  }

  function setMode (modeName) {
    common.mode = getMode(modeName);
    common.mode.setToAllComponents(display);
  }
};

window.CoNDeT.ui = {};
window.CoNDeT.core = {};
