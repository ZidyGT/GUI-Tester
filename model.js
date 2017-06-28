var Error = function (line, assert, error) {
    this.line = line;
    this.assert = assert;
    this.error = error;
};

var Command = function (line, cmd) {
    this.line = line;
    this.command = cmd;
};

var Scenare = function (name) {
    this.id;
    this.groupId;
    this.name = name;
    this.lineCounter = 0;
    this.comment;
    this.commands = new Array();
    this.errors = new Array();
};

Scenare.prototype.Add = function (cmd) {
    cmd = new Command(this.lineCounter, cmd);
    this.lineCounter++;
    this.commands.push(cmd);
    
};

Scenare.prototype.AddError = function (cmd, error) {
    var _error = new Error(this.lineCounter - 1 ,cmd, error);
    this.errors.push(_error);
};

Scenare.prototype.pushCommands = function (cmds) {
    cmds.forEach(function (item) {
        this.Add(item);
    }.bind(this));
};

var ScenareGroup = function (name) {
    this.id;
    this.name = name;
    this.scenarios = new Array();
    this.comment;
};

var Model = function () {
    this.reference = new Array();
    this.actualItem;
    this.Items = new Array();
    this.count = 1;
    this.idScenare = 0;
    this.idGroup = 0;
    try {
        this.store = localStorage;
        this.store.clear();
        this.store.setItem("tests", JSON.stringify({tests: new Array()}));
    } catch (Exception) {
        console.error("localStorage is not supported");
    }
    console.log(this.store);
};


Model.prototype.InitScenario = function (name) {
    if (this.actualItem instanceof ScenareGroup) {
        this.InitScenarioFromGroup(name, this.actualItem.id);
    }
    else
    {
    this.actualItem = new Scenare(name);
    this.actualItem.id = this.idScenare;
    this.idScenare++;
    this.actualItem.pushCommands(this.reference);
    this.Items.push(this.actualItem);
    }
  
};

Model.prototype.InitScenarioFromGroup = function (name, idGroup) {
    var scenare = new Scenare(name);
    this.groupid = idGroup;
    scenare.id = this.idScenare;
    this.idScenare++;
    scenare.pushCommands(this.reference);
    this.actualItem.scenarios.push(scenare);
    this.actualItem = scenare;
};

Model.prototype.InitGroup = function (name) {
    this.actualItem = new ScenareGroup(name);
    this.actualItem.id = this.idGroup;
    this.idGroup++;
    this.Items.push(this.actualItem);
    console.log(this.actualItem);
};


Model.prototype.loadScenarios = function () {
    return this.Items;
};

Model.prototype.saveScenare = function (scenarioId) {
    if (typeof (this.actualItem.groupid) !== "undefined") {
        this.Items.forEach(function (item) {
            if (item.id === this.actualItem.groupid) {
                item.scenarios.forEach(function (scenare) {
                    if (scenare.id === scenarioId) {
                        scenare = this.actualItem;
                    }
                }.bind(this));
            }
        }.bind(this));
    } else {
        this.Items.forEach(function (item) {
            if (item instanceof Scenare && item.id === scenarioId)
                item = this.actualItem;
        }.bind(this));
    }
};

Model.prototype.loadScenare = function (scenarioId) {
    this.Items.forEach(function (item) {
        if (item instanceof Scenare && item.id === scenarioId)
            this.actualItem = item;
    }.bind(this));
};

Model.prototype.loadScenareFromGroup = function (scenarioId, scenareGroupId) {
    this.Items.forEach(function (item) {
        if (item instanceof ScenareGroup && item.id === scenareGroupId) {
            item.scenarios.forEach(function (scenario) {
                if (scenario.id === scenarioId) {
                    this.actualItem = scenario;
                }
            }.bind(this));
        }
    }.bind(this));
};

Model.prototype.saveScenareGroup = function (scenareGroupId) {
    this.Items.forEach(function (item) {
        if (item instanceof ScenareGroup && item.id === scenareGroupId)
            item = this.actualItem;
    }.bind(this));
};

Model.prototype.loadScenareGroup = function (scenareGroupId) {
    this.Items.forEach(function (item) {
        if (item instanceof ScenareGroup && item.id === scenareGroupId)
            this.actualItem = item;
    }.bind(this));
};

Model.prototype.saveDescriptionTest = function(comment, id){
    if(this.actualItem instanceof ScenareGroup){
        this.actualItem.scenarios.forEach(function(scenario){
            if(scenario.id === id){
                scenario.comment = comment;
            }
        }.bind(this));   
    }
    else{
        this.actualItem.comment = comment;
    }
};


Model.prototype.saveDescriptionGroup = function(comment){
    this.actualItem.comment = comment;
};

