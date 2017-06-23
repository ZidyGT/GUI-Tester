var Error = function(){
   this.line;
   this.assert;
   this.error;  
};

var Command = function(){
   this.line;
   this.command;  
};

var Scenare = function (name) {
    this.id;
    this.name = name;
    this.lineCounter = 0;
    this.comment;
    this.commands = new Array();
    this.errors = new Array();
};

Scenare.prototype.Add = function (cmd) {
    cmd = new Command(this.lineCounter, cmd);
    this.commands.push(cmd);
    this.lineCounter++;
};

Scenare.prototype.pushCommands = function (cmds) {
    cmds.forEach(function (item) {
        this.Add(item);
    }.bind(this));
};

var ScenareGroup = function(){
    this.id;
    this.scenarios = new Array();
    this.comment;
    };

var Model = function () {
    this.reference = new Array();
    this.actualItem;
    this.count = 1;
    this.idScenare = 0;
    this.idGroup = 0;
    try {
        this.store = localStorage;
        this.store.clear();
        this.store.setItem("tests",JSON.stringify({tests: new Array()}));
    } catch (Exception) {
        console.error("localStorage is not supported");
    }
    console.log(this.store);
};


Model.prototype.InitScenario = function (name) {
    this.actualItem = new Scenare(name);
    this.actualItem.id = this.idScenare;
    this.idScenare++;
    this.actualItem.pushCommands(this.reference);
    console.log(this.actualItem);
};


Model.prototype.loadScenarios = function () {
    var scenarios = JSON.parse(this.store.getItem("tests"));
    return scenarios.tests;
};

Model.prototype.saveScenare = function (scenario) {
    var scenarios = JSON.parse(this.store.getItem("tests"));
    scenarios.tests.push(scenario);
    this.store.setItem("tests", JSON.stringify(scenarios));
    console.log(scenario);
};

Model.prototype.saveScenareGroup = function (scenareGroup) {
    var scenarios = JSON.parse(this.store.getItem("tests"));
    scenarios.tests.push(scenareGroup);
    this.store.setItem("tests", JSON.stringify(scenarios));
    console.log(scenario);
};


