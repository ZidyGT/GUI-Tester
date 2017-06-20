var Error = function(){
   this.assert;
   this.error;  
};

var Scenare = function () {
    this.commands = new Array();
    this.errors = new Array();
};

Scenare.prototype.Add = function (cmd) {
    this.commands.push(cmd);
};

Scenare.prototype.pushCommands = function (cmds) {
    cmds.forEach(function (item) {
        this.commands.push(item);
    }.bind(this));
};

var ScenareGroup = function(){
    this.scenarios = new Array();
    };

var Model = function () {
    this.reference = new Array();
    this.groups = new ScenareGroup();
    this.count = 1;
    try {
        this.store = localStorage;
        this.store.clear();
    } catch (Exception) {
        console.error("localStorage is not supported");
    }
    console.log(this.store);
    this.InitScenarios();
};


Model.prototype.InitScenario = function () {
    this.scenario = new Scenare();
    this.scenario.pushCommands(this.reference);
};

Model.prototype.InitScenarios = function () {
    console.log("initScenarios");
    if (this.store.getItem("tests") === null) {
        this.store.setItem("tests", JSON.stringify({tests: new Array()}));
    }
};

Model.prototype.saveScenare = function (scenario) {
    var scenarios = JSON.parse(this.store.getItem("tests"));
    scenarios.tests.push(scenario);
    this.store.setItem("tests", JSON.stringify(scenarios));
    console.log(scenario);
    console.log(this.store);
};


