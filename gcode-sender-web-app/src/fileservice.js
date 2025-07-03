/**
 * A service for loading gcode files.
 */
app.service("fileService", function ($rootScope) {
  // The 'API' for this service.
  var api = {
    commandSequence: [],
  };

  var processFile = function (f) {
    api.fileName = f.name;
    api.fileLastModified = moment(f.lastModifiedDate).fromNow();

    // TODO: don't read binary files.

    console.log("processing file: " + f.name);
    console.time("readFile");
    var reader = new FileReader();
    reader.onloadend = function (evt) {
      if (evt.target.readyState == FileReader.DONE) {
        console.timeEnd("readFile");
        api.commandSequence = extractCommandSequence(evt.target.result);
        $rootScope.$broadcast("fileUpdated");
      }
    };
    reader.readAsText(f);
  };

  api.openFile = function () {
    // Create a hidden file input if it doesn't exist
    let fileInput = document.getElementById("gcode-file-input");
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".gcode,.nc,text/gcode,text/plain";
      fileInput.style.display = "none";
      fileInput.id = "gcode-file-input";
      document.body.appendChild(fileInput);
      fileInput.addEventListener("change", function (evt) {
        if (fileInput.files && fileInput.files.length > 0) {
          processFile(fileInput.files[0]);
        }
      });
    }
    fileInput.value = "";
    fileInput.click();
  };

  // This method is for handling drag-and-drop files.
  api.handleFileSelect = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files;
    if (evt.target.files) {
      files = evt.target.files; // FileList object
    } else if (evt.dataTransfer) {
      files = evt.dataTransfer.files; // FileList object.
    } else {
      console.log("unknown file input");
    }

    // only examine the first file.
    if (files.length > 0) {
      $rootScope.$apply(function () {
        processFile(files[0]);
      });
    } else {
      console.log("input file had no content.");
    }
  };

  return api;
});
