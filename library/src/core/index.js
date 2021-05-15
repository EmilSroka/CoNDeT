window.CoNDeT.core = {
  toTableProps: function (tablesJSON) {
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
        id: tableProps.id,
        name: tableProps.name,
        class: tableProps.classType,
        coordinates: tableProps.coordinates,
        conditions: tableProps.columns.conditions,
        decisions: tableProps.columns.decisions,
        rows: rowsPrepared,
      });
    }

    return tablesList;
  },
  colorHash: function(inputString) {
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
  },
  getLinePoints: function(props) {
    var starPoint = props.startPoint;
    var endPoint = props.endPoint;
    var checkIfCanPlacePoint = props.freePlaceCallback;

    var deltaX = Math.abs(startPoint.x - endPoint.x);
    var deltaY = Math.abs(startPoint.y - endPoint.y);
    while (deltaX > 10 && deltaY > 10) {
      var path = constructPathFromLinesOfLength(deltaX, deltaY, starPoint, endPoint, 40);

      if (path != null) {
        var points = [];
        while (path.prev != null) {
          points.unshift({ x: path.x, y: path.y })
          path = path.prev;
        }
        return points;
      }

      deltaX /= 2;
      deltaY /= 2;
    }

    return [starPoint, endPoint];

    function constructPathFromLinesOfLength(verticalLength, horizontalLength, startPoint, endPoint, numberOfLinesLimiter) {
      // BFS algorithm
      var edges = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      var queue = [];
      var layer = 0;

      queue.push(startPoint);

      while(queue.length !== 0 && layer <= numberOfLinesLimiter){
        layer += 1;
        var size = queue.length;

        for (var i=0; i<size; i++){
          var currentPoint = queue.shift();

          if (currentPoint.x === endPoint.x && currentPoint.y === endPoint.y) {
            return currentPoint;
          }

          for (var j=0; j<edges.length; j++) {
            var edge = edges[j];
            if (checkIfCanPlaceLine(currentPoint, {x: currentPoint.x + horizontalLength * edge[0], y: currentPoint.y + verticalLength * edge[1]})) {
              queue.push({x: currentPoint.x + horizontalLength * edge[0], y: currentPoint.y + verticalLength * edge[1], prev: currentPoint});
            }
          }
        }
      }

      return null;
    }

    function checkIfCanPlaceLine(startPoint, endPoint) {
      var deltaX = startPoint.x - endPoint.x;
      var deltaY = startPoint.y - endPoint.y;

      var numberOfChecks = Math.round(Math.max(Math.abs(deltaX), Math.abs(deltaY)) / 10) || 1;

      for (var i=0; i<numberOfChecks; i++) {
        if (!checkIfCanPlacePoint({
          x: startPoint.x + deltaX/numberOfChecks * i,
          y: startPoint.y + deltaY/numberOfChecks * i,
        })) {
          return false;
        }
      }
      return true;
    }
  }
}