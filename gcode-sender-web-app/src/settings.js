app.controller("settingsCtrl", function ($scope, settingsService) {
  $scope.settings = settingsService.settings;
  $scope.loadSettings = settingsService.load;
  $scope.saveSettings = settingsService.save;
  $scope.deviceHolder = {};

  if (navigator.serial && navigator.serial.getPorts) {
    navigator.serial.getPorts().then(function (ports) {
      var d = [];
      for (var i = 0; i < ports.length; i++) {
        d.push("Serial Port #" + (i + 1));
      }
      $scope.deviceHolder.devices = d;
      console.log(ports.length + " serial port(s) detected");
      $scope.$apply();
    });
  } else {
    $scope.deviceHolder.devices = [];
    console.log("Web Serial API not supported.");
  }
});

app.service("settingsService", function ($rootScope) {
  var settings = {
    workspace_width_mm: 150,
    workspace_depth_mm: 150,
    workspace_height_mm: 50,
    workspace_port: "",
    workspace_baud: 9600,
    workspace_show_estop: true,
    workspace_show_home: false,
    workspace_show_spindle: false,
    workspace_show_zero: false,
    workspace_jog_feedrate: 0,
    workspace_jog_rapid: false,
    gcode_preamble: "",
    gcode_postamble: "",
  };

  var loadSettings = function () {
    console.log("loading settings from localStorage.");
    var s = {};
    try {
      var raw = localStorage.getItem("settings");
      if (raw) s = JSON.parse(raw);
    } catch (e) {
      s = {};
    }
    if (s["workspace-width-mm"] !== undefined) {
      settings.workspace_width_mm = Number(s["workspace-width-mm"]);
    }
    if (s["workspace-depth-mm"] !== undefined) {
      settings.workspace_depth_mm = Number(s["workspace-depth-mm"]);
    }
    if (s["workspace-height-mm"] !== undefined) {
      settings.workspace_height_mm = Number(s["workspace-height-mm"]);
    }
    if (s["workspace-port"] !== undefined) {
      settings.workspace_port = s["workspace-port"];
    }
    if (s["workspace-baud"] !== undefined) {
      settings.workspace_baud = Number(s["workspace-baud"]);
    }
    if (s["workspace-show-estop"] !== undefined) {
      settings.workspace_show_estop = s["workspace-show-estop"];
    }
    if (s["workspace-show-home"] !== undefined) {
      settings.workspace_show_home = s["workspace-show-home"];
    }
    if (s["workspace-show-spindle"] !== undefined) {
      settings.workspace_show_spindle = s["workspace-show-spindle"];
    }
    if (s["workspace-show-zero"] !== undefined) {
      settings.workspace_show_zero = s["workspace-show-zero"];
    }
    if (s["workspace-jog-feedrate"] !== undefined) {
      settings.workspace_jog_feedrate = Number(s["workspace-jog-feedrate"]);
    }
    if (s["workspace-jog-rapid"] !== undefined) {
      settings.workspace_jog_rapid = s["workspace-jog-rapid"];
    }
    if (s["gcode-preamble"] !== undefined) {
      settings.gcode_preamble = s["gcode-preamble"];
    }
    if (s["gcode-postamble"] !== undefined) {
      settings.gcode_postamble = s["gcode-postamble"];
    }
    console.log(
      "settings loaded from localStorage.\n" + JSON.stringify(settings)
    );
    $rootScope.$apply();
  };

  var saveSettings = function () {
    var s = {};
    s["workspace-width-mm"] = settings.workspace_width_mm;
    s["workspace-depth-mm"] = settings.workspace_depth_mm;
    s["workspace-height-mm"] = settings.workspace_height_mm;
    s["workspace-port"] = settings.workspace_port;
    s["workspace-baud"] = settings.workspace_baud;
    s["workspace-show-estop"] = settings.workspace_show_estop;
    s["workspace-show-home"] = settings.workspace_show_home;
    s["workspace-show-spindle"] = settings.workspace_show_spindle;
    s["workspace-show-zero"] = settings.workspace_show_zero;
    s["workspace-jog-feedrate"] = settings.workspace_jog_feedrate;
    s["workspace-jog-rapid"] = settings.workspace_jog_rapid;
    s["gcode-preamble"] = settings.gcode_preamble;
    s["gcode-postamble"] = settings.gcode_postamble;
    try {
      localStorage.setItem("settings", JSON.stringify(s));
    } catch (e) {}
    console.log("settings saved.\n" + JSON.stringify(s));
  };

  return {
    settings: settings,
    load: loadSettings,
    save: saveSettings,
  };
});
