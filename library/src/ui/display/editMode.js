window.CoNDeT.ui.DisplayEditMode = (function () {
  function constructor() {}

  constructor.prototype = Object.create(window.CoNDeT.ui.StrategyCommon);

  constructor.prototype.onInit = function (display) {
    this.display = display;
    this.addTableElement(this.display);
  };

  constructor.prototype.addTableElement = function (disp) {
    var form = document.createElement("form");
    form.appendChild(addInput("text", "TableID", "table-id"));
    form.appendChild(addInput("text", "Table Name", "name"));
    form.appendChild(addInput("text", "Class", "table-class"));
    form.appendChild(addInput("text", "Coordinates", "coordinates"));
    form.appendChild(addInput("text", "Conditions", "conditions"));
    form.appendChild(addInput("text", "Decision", "decisions"));
    form.appendChild(addInput("text", "Number of Rows", "rows"));
    var button = document.createElement("button");
    button.innerHTML = "Create Table";
    form.className = "add-table-form";

    button.addEventListener("mousedown", function () {
      prepareObject(disp);
    });

    document.getElementsByTagName("body")[0].appendChild(form);
    document.getElementsByTagName("body")[0].appendChild(button);
  };

  prepareObject = function (display) {
    var tableObj = {};
    tableObj.id = document.getElementById("table-id").value;
    tableObj.name = document.getElementById("name").value;
    tableObj.class = document.getElementById("table-class").value;
    var coords = document.getElementById("coordinates").value.split(", ");
    tableObj.coordinates = {};
    tableObj.coordinates.x = parseInt(coords[0]);
    tableObj.coordinates.y = parseInt(coords[1]);
    tableObj.columns = {};
    tableObj.columns.conditions = document
      .getElementById("conditions")
      .value.split(", ");
    tableObj.columns.decisions = document
      .getElementById("decisions")
      .value.split(", ");
    var rowTab = [];
    for (var i = 0; i < document.getElementById("rows").value; i++) {
      rowTab.push({
        conditions: [],
        decisions: [],
        connections: [],
        row_id: document.getElementById("table-id").value + "_row_" + i,
      });
    }
    tableObj.rows = rowTab;

    clearForm();
    display.common.stateModifier.createTable(tableObj);
  };

  addInput = function (type, text, id) {
    var div = document.createElement("div");
    var elem = document.createElement("input");
    elem.setAttribute("type", type);
    elem.setAttribute("placeholder", text);
    elem.setAttribute("id", id);
    var br = document.createElement("br");
    div.appendChild(elem);
    div.appendChild(br);
    return div;
  };

  clearForm = function () {
    document.getElementById("table-id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("table-class").value = "";
    document.getElementById("coordinates").value = "";
    document.getElementById("conditions").value = "";
    document.getElementById("decisions").value = "";
    document.getElementById("rows").value = "";
  };

  return constructor;
})();
