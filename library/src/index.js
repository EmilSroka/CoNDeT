window.CoNDeT = function (configs) {
  var selector = configs.selector || ".condet-display";
  var modeName = configs.entryMode || "display";

  var state = new window.CoNDeT.data.State()
  var display = new window.CoNDeT.ui.DisplayComponent();
  var common = {
    stateModifier: {
      // todo(es): replace mock with stateModifier
      moveTable: (() => {
        let stateObj = [];

        state.subscribe(newState => stateObj = newState);

        return (tableName, coordinates) => {
          const x = stateObj.shift();
          state.setState([{ ...x, coordinates }], ...stateObj)
        }
      })(),
    },
    mode: getMode(modeName)
  }

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
      })
    },
    saveToFile: function () {
      window.CoNDeT.data.FileReaderWriter.saveToFile(state.state);
    },
    changeMode: function (modeName) {
      common.mode = getMode(modeName);
      common.mode.setToAllComponents(display);
    }
  }

  function getMode(modeName) {
    if (modeName === "edit") {
      return window.CoNDeT.ui.EditMode;
    }

    if (modeName === "display") {
      return window.CoNDeT.ui.DisplayMode;
    }

    return new window.CoNDeT.ui.Mode({});
  }
};

window.CoNDeT.ui = {};
window.CoNDeT.core = {};
