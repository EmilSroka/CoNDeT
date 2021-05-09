window.CoNDeT.ui.DisplayComponent = (function () {
  function constructor() {
    common = {};
  }

  constructor.prototype.setCurrentXY = function (currentXY) {
    common.deltaXY = { x: currentXY.x, y: currentXY.y };
  };

  constructor.prototype.getCurrentXY = function () {
    return common.deltaXY;
  };

  constructor.prototype.prepareData = function (tablesJSON) {
    var tablesList = [];
    for (var i = 0; i < tablesJSON.length; i++) {
      var tableProps = tablesJSON[i];
      var rowsPrepared = [];
      for (var j = 0, k = 0; j < tableProps.columns.conditions.length; j++) {
        if (tableProps.rows.conditions[k][1] != null) {
          rowsPrepared.push(tableProps.rows.conditions[k][1]);
          k += 1;
        } else {
          rowsPrepared.push("");
        }
      }
      for (var j = 0, k = 0; j < tableProps.columns.decisions.length; j++) {
        if (tableProps.rows.decisions[k][1] != null) {
          rowsPrepared.push(tableProps.rows.decisions[k][1]);
          k += 1;
        } else {
          rowsPrepared.push("");
        }
      }

      tablesList.push({
        name: tableProps.name,
        class: tableProps.classType,
        coordinates: tableProps.coordinates,
        conditions: tableProps.columns.conditions,
        decisions: tableProps.columns.decisions,
        rows: rowsPrepared,
      });
    }

    return tablesList;
  };

  constructor.prototype.prepareConnections = function (tablesJSON, pathAlgo) {
    var connections = [];
    for (var i = 0; i < tablesJSON.length; i++) {
      var rows = tablesJSON[i].rows;
      for (var j = 0; j < rows.length; j++) {
        for (var k = 0; k < rows[j].connections.length; k++) {
          var toTableId = getTableIndexByName(
            tablesJSON[i].rows[j].connections[k]
          );
          var connection = [
            toTableId + "-" + tablesJSON[i].name,
            this.children[i].getRowXY[j],
            this.children[getTableIndexByName(toTableId)].getPosition(),
          ];
          connections.push(connection);
        }
      }
    }

    connections = connections.map(function (connection) {
      return window.CoNDeT.core.getLinePoints({
        startPoint: connection[0],
        endpoint: connection[1],
        freePlaceCallback: pathAlgo,
      });
    });

    return connections;

    function getTableIndexByName(name) {
      for (var i = 0; i < tablesJSON.length; i++) {
        if (tablesJSON[i].name === name) return i;
      }
      return null;
    }
  };

  constructor.prototype.onInit = function (common, props) {
    var ref = document.getElementsByClassName(props.className)[0];
    var tables = this.prepareData(props.data);
    for (var i = 0; i < tables.length; i++) {
      this.createChild(window.CoNDeT.ui.TableComponent, tables[i]);
    }
    var paths = this.prepareConnections(props.data, props.algo);
    this.createChild(window.CoNDeT.ui.ConnectionsComponent, {
      connections: paths,
      dimentions: this.getDimensions(),
    });

    return ref;
  };

  constructor.prototype.onUpdate = function (common, props) {
    var tables = this.prepareData(props.data);
    var unused = findTablesWithoutCorrespondingName(this.children, tables);

    for (var i = 0; i < array.length; i++) {
      this.removeChild(unused[i]);
    }

    for (var i = 0; i < tables.length; i++) {
      var correspondedChild = findTableByName(this.children, tables[i].name);
      var tablesProps = tables[i];
      if (correspondedChild != null) {
        correspondedChild.update(common, tablesProps);
      } else {
        this.createChild(window.CoNDeT.ui.TableComponent, tablesProps);
      }
    }
  };
  constructor.prototype.onDestroy = function (common) {};

  return constructor;

  function findTableByName(children, name) {
    for (var i = 0; i < children.length; i++) {
      if (children[i].name === name) return children[i];
    }
    return null;
  }

  function findTablesWithoutCorrespondingName(children, tables) {
    var names = tables.reduce(function (acc, val) {
      if (findTableByName(children, val[0].name) == null) return acc;
      acc[val[0].name] = true;
      return acc;
    }, {});

    var unused = [];

    children.forEach(function (child) {
      if (names[child.name]) return;
      unused.push(child);
    });

    return unused;
  }
})();

window.CoNDeT.ui.DisplayMode = (function () {
  function constructor() {
    this.deltaXY = null;
    this.currentDelta = null;
  }

  constructor.prototype.updateXY = function (event) {
    if (this.deltaXY == null) return;
    this.ref.setCurrentXY({
      x: this.deltaXY.x + this.currentDelta.x - event.clientX,
      y: this.deltaXY.y + this.currentDelta.y - event.clientY,
    });
  };

  constructor.prototype.onKeyDown = function (event) {};
  constructor.prototype.onKeyUp = function (event) {};
  constructor.prototype.onMouseDown = function (event) {
    this.deltaXY = this.ref.getCurrentXY();
    this.currentDelta = { x: event.clientX, y: event.clientY };
  };
  constructor.prototype.onMouseMove = function (event) {
    this.updateXY(event);
  };
  constructor.prototype.onMouseUp = function (event) {
    this.updateXY(event);
    this.deltaXY = null;
    this.currentDelta = null;
  };
  constructor.prototype.onMouseLeave = function (event) {
    this.updateXY(event);
    this.deltaXY = null;
    this.currentDelta = null;
  };

  constructor.prototype.onInit = function (ref) {
    this.ref = ref;
  };
  constructor.prototype.onDestroy = function () {};

  return constructor;
})();
