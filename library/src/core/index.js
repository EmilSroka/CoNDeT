window.CoNDeT.core.toTableProps = function (tablesJSON, deltaXY) {
  var tablesList = [];
  for (var i = 0; i < tablesJSON.length; i++) {
    var tableProps = tablesJSON[i];
    var rowsPrepared = [];
    for (var j = 0; j < tableProps.rows.length; j++) {
      var row = tableProps.rows[j];
      var content = [];
      for (var k = 0; k < tableProps.columns.conditions.length; k++) {
        content.push(["", "conditions", k, tableProps.columns.conditions[k]]);
      }
      for (var k = 0; k < tableProps.columns.decisions.length; k++) {
        content.push(["", "decisions", k, tableProps.columns.decisions[k]]);
      }
      for (var k = 0; k < row.conditions.length; k++) {
        content[row.conditions[k][0]][0] = tableProps.rows[j].conditions[k][1];
      }
      for (var k = 0; k < row.decisions.length; k++) {
        content[row.decisions[k][0] + tableProps.columns.conditions.length][0] =
          row.decisions[k][1];
      }
      rowsPrepared.push({ content: content, id: row.row_id });
    }
    tablesList.push({
      id: tableProps.id,
      name: tableProps.name,
      class: tableProps.class,
      coordinates: {
        x: tableProps.coordinates.x + deltaXY.x,
        y: tableProps.coordinates.y + deltaXY.y,
      },
      conditions: tableProps.columns.conditions,
      decisions: tableProps.columns.decisions,
      rows: rowsPrepared,
    });
  }

  return tablesList;
};

window.CoNDeT.core.toConnectionsProps = function (display, tablesJSON) {
  var connections = [];
  for (var i = 0; i < tablesJSON.length; i++) {
    var table = tablesJSON[i];
    for (var j = 0; j < table.rows.length; j++) {
      var row = table.rows[j];
      for (var k = 0; k < row.connections.length; k++) {
        var fromTableId = table.id;
        var fromTable = display.findChild(
          window.CoNDeT.ui.TableComponent,
          fromTableId
        );
        if (fromTable == null) continue;
        var starPoint = fromTable.getRowXY(j);

        var toTableId = row.connections[k];
        var toTable = display.findChild(
          window.CoNDeT.ui.TableComponent,
          toTableId
        );
        if (toTable == null) continue;
        var endPoint = toTable.entryPoint();

        connections.push({
          id: table.id + "-" + row.row_id + "_" + toTableId,
          path: window.CoNDeT.core.getLinePoints(starPoint, endPoint),
          delete: (function () {
            var id1 = fromTableId;
            var r = row;
            var id2 = toTableId;
            return function () {
              display.common.stateModifier.removeConnection(id1, r.row_id, id2);
            }
          })()
        });
      }
    }
  }
  return connections;
};

window.CoNDeT.core.colorHash = function (inputString) {
  var sum = 0;

  for (var i in inputString) {
    sum += inputString.charCodeAt(i);
  }

  var r = ~~(
    ("0." +
      Math.sin(sum + 1)
        .toString()
        .substr(6)) *
    210
  );
  var g = ~~(
    ("0." +
      Math.sin(sum + 2)
        .toString()
        .substr(6)) *
    210
  );
  var b = ~~(
    ("0." +
      Math.sin(sum + 3)
        .toString()
        .substr(6)) *
    210
  );

  var hex = "#";

  hex += ("00" + r.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + g.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + b.toString(16)).substr(-2, 2).toUpperCase();

  return hex;
};

window.CoNDeT.core.getLinePoints = function (startPoint, endPoint) {
  return [
    { x: startPoint.x, y: startPoint.y },
    { x: startPoint.x + 20, y: startPoint.y },
    { x: startPoint.x + 20, y: endPoint.y - 20 },
    { x: endPoint.x, y: endPoint.y - 20 },
    { x: endPoint.x, y: endPoint.y },
  ];
};

window.CoNDeT.core.equals = function (value1, value2) {
  if (typeof value1 !== "object" || typeof value2 !== "object")
    return value1 === value2;

  var checkedKeys = [];

  for (var key in value1) {
    var logicalSumOfOwnProps =
      Number(value1.hasOwnProperty(key)) + Number(value2.hasOwnProperty(key));
    if (logicalSumOfOwnProps === 0) continue;
    if (logicalSumOfOwnProps === 1) return false;
    if (!window.CoNDeT.core.equals(value1[key], value2[key])) return false;

    checkedKeys.push(key);
  }

  for (var key in value2) {
    if (checkedKeys.indexOf(key) != -1) continue;
    var logicalSumOfOwnProps =
      Number(value1.hasOwnProperty(key)) + Number(value2.hasOwnProperty(key));
    if (logicalSumOfOwnProps === 0) continue;
    if (logicalSumOfOwnProps === 1) return false;
    if (!window.CoNDeT.core.equals(value1[key], value2[key])) return false;
  }

  return true;
};

window.CoNDeT.core.clone = function (toClone) {
  if (typeof toClone !== "object" || toClone === null) return toClone;
  var result = Array.isArray(toClone) ? [] : {};
  for (var attr in toClone) {
    if (!toClone.hasOwnProperty(attr)) continue;
    result[attr] = window.CoNDeT.core.clone(toClone[attr]);
  }
  return result;
};

window.CoNDeT.core.copy = function (toClone) {
  if (typeof toClone !== "object" || toClone === null) return toClone;
  var result = Array.isArray(toClone) ? [] : {};
  for (var attr in toClone) {
    if (!toClone.hasOwnProperty(attr)) continue;
    result[attr] = toClone[attr];
  }
  return result;
};

window.CoNDeT.core.addTable = function (common) {
  var retAddTable = function () {
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
  };

  return retAddTable;
};

window.CoNDeT.core.getIcons = function (custom) {
  return {
    delete: custom.delete || "❌",
    add: custom.add || "➕",
  }
};

window.CoNDeT.core.getUniqueId = (function () {
  var i = 0;
  return function () {
    i++;
    return "CoNDeT-id-" + (Math.random() * 1000000000000000 >>> 0) + "-" + i;
  }
})();

