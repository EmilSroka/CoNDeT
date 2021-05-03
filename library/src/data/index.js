window.CoNDeT.data = {
  FileReaderWriter:{
  

  readFromFile =function (cb) {
    var element = document.createElement('input');
    element.setAttribute('type','file');
    element.setAttribute('accept','.json');
    element.addEventListener('change',function(event) {
     var file = event.target.files[0];
     console.log(file);
     var fileReader = new FileReader();

     fileReader.onload = function(e){
       cb(JSON.parse(e.target.result));
       element.remove();
     };
     fileReader.readAsText(file);
    });
    element.click();
    },
    saveToFile = function (FileName, Data) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename + ".json");

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      element.remove();
    }
  },
};
