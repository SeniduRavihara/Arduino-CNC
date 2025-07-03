// author: Buck Clay (dev@buckclay.com)
// date: 2013-12-25

// Configure AngularJS.
var app = angular.module("gcodeSender", [
  "ui.router",
  "luegg.directives",
  "cfp.hotkeys",
]);

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state("about", { url: "/about", templateUrl: "about.html" })
    .state("settings", {
      url: "/settings",
      templateUrl: "settings.html",
      controller: "settingsCtrl",
    })
    .state("loadfile", {
      url: "/loadfile",
      templateUrl: "loadfile.html",
      controller: "loadFileCtrl",
    })
    .state("controlpanel", {
      url: "/controlpanel",
      templateUrl: "controlpanel.html",
      controller: "controlPanelCtrl",
    });
});

app.controller(
  "mainCtrl",
  function (
    $scope,
    $state,
    $window,
    hotkeys,
    settingsService,
    machineService,
    warningService,
    fileService
  ) {
    settingsService.load();
    $state.go("controlpanel");

    $scope.$state = $state;
    $scope.warningService = warningService;
    $scope.machineService = machineService;

    /**
     * Connect to the configured serial port.
     */
    $scope.connect = function () {
      // Always trigger the Web Serial API port picker dialog
      machineService.connect(
        undefined,
        settingsService.settings.workspace_baud
      );
    };
    $scope.disconnect = machineService.disconnect;

    // Setup the drag-and-drop listeners.
    document.body.addEventListener(
      "dragover",
      function (e) {
        e.stopPropagation();
        e.preventDefault();
        $state.go("loadfile");
      },
      false
    );

    // Setup resize events.
    $window.addEventListener("resize", function () {
      $scope.$broadcast("resize");
    });

    // Global keyboard commands.
    hotkeys.add({
      combo: "mod+o",
      description: "open file",
      callback: function () {
        $state.go("loadfile");
        fileService.openFile();
      },
    });
    hotkeys.add({
      combo: "mod+k",
      description: "connect/disconnect",
      callback: function () {
        if (machineService.isConnected) {
          $scope.disconnect();
        } else {
          $scope.connect();
        }
      },
    });
    hotkeys.add({
      combo: "mod+1",
      description: "show control panel",
      callback: function () {
        $state.go("controlpanel");
      },
    });
    hotkeys.add({
      combo: "mod+2",
      description: "show load file",
      callback: function () {
        $state.go("loadfile");
      },
    });
    hotkeys.add({
      combo: "mod+3",
      description: "show settings",
      callback: function () {
        $state.go("settings");
      },
    });
    hotkeys.add({
      combo: "mod+4",
      description: "show about",
      callback: function () {
        $state.go("about");
      },
    });
  }
);
