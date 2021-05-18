window.CoNDeT.core.toTableProps = function (tablesJSON, deltaXY) {
  var tablesList = [];
  for (var i = 0; i < tablesJSON.length; i++) {
    var tableProps = tablesJSON[i];
    var rowsPrepared = [];
    for (var j = 0; j < tableProps.rows.length; j++) {
      var row = tableProps.rows[j];
      var content = [];
      for (var k = 0; k < tableProps.columns.conditions.length + tableProps.columns.decisions.length; k++) {
        content.push("");
      }
      for (var k = 0; k < row.conditions.length; k++) {
        content[row.conditions[k][0]] = tableProps.rows[j].conditions[k][1];
      }
      for (var k = 0; k < row.decisions.length; k++) {
        content[row.decisions[k][0] + tableProps.columns.conditions.length] = row.decisions[k][1];
      }
      rowsPrepared.push(content);
    }
    tablesList.push({
      id: tableProps.id,
      name: tableProps.name,
      class: tableProps.class,
      coordinates: { x: tableProps.coordinates.x + deltaXY.x, y: tableProps.coordinates.y + deltaXY.y },
      conditions: tableProps.columns.conditions,
      decisions: tableProps.columns.decisions,
      rows: rowsPrepared,
    });
  }

  return tablesList;
};

window.CoNDeT.core.toConnectionsProps = function (display, tablesJSON) {
  var connections = [];
  for (var i=0; i<tablesJSON.length; i++) {
    var table = tablesJSON[i];
    for (var j=0; j<table.rows.length; j++) {
      var row = table.rows[j];
      for (var k=0; k<row.connections.length; k++) {
        var fromTableId = table.id;
        var fromTable = display.findChild(window.CoNDeT.ui.TableComponent, fromTableId);
        if (fromTable == null) continue;
        var starPoint = fromTable.getRowXY(j);

        var toTableId = row.connections[k];
        var toTable = display.findChild(window.CoNDeT.ui.TableComponent, toTableId);
        if (toTable == null) continue;
        var endPoint = toTable.entryPoint();

        connections.push({ id: table.id + "-" + row.row_id + "_" + toTableId, path: window.CoNDeT.core.getLinePoints(starPoint, endPoint) })
      }
    }
  }
  return connections;
};

window.CoNDeT.core.colorHash = function(inputString) {
  var sum = 0;

  for (var i in inputString) {
      sum += inputString.charCodeAt(i);
  }

  var r = ~~(('0.' + Math.sin(sum + 1).toString().substr(6)) * 210);
  var g = ~~(('0.' + Math.sin(sum + 2).toString().substr(6)) * 210);
  var b = ~~(('0.' + Math.sin(sum + 3).toString().substr(6)) * 210);

  var hex = "#";

  hex += ("00" + r.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + g.toString(16)).substr(-2, 2).toUpperCase();
  hex += ("00" + b.toString(16)).substr(-2, 2).toUpperCase();

  return hex;
};

window.CoNDeT.core.getLinePoints = function(startPoint, endPoint) {
  return [
    { x: startPoint.x, y: startPoint.y },
    { x: startPoint.x + 20, y: startPoint.y },
    { x: startPoint.x + 20, y: endPoint.y - 20 },
    { x: endPoint.x, y: endPoint.y - 20 },
    { x: endPoint.x, y: endPoint.y }
  ]
};

