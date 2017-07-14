    var Error = function (line, assert, error) {
    this.line = line;
    this.assert = assert;
    this.error = error;
};

var Command = function (line, cmd) {
    this.line = line;
    this.command = cmd;
};

var Run = function (commands, id){
    this.id = id;
    this.commands = commands;
    this.result = true;
};

Run.prototype.AddError = function(error){
  this.result = false;
  this.error = error;
};

var Scenare = function (name) {
    this.name = name;
    this.lineCounter = 0;
    this.commands = new Array();
    this.runs = new Array();
    
};

Scenare.prototype.Add = function (cmd) {
    cmd = new Command(this.lineCounter, cmd);
    this.lineCounter++;
    this.commands.push(cmd);
    
};

Scenare.prototype.pushCommands = function (cmds) {
    cmds.forEach(function (item) {
        if(item !== "")
            this.Add(item);
    }.bind(this));
};

Scenare.prototype.getStringArray = function (){
  var Strings = new Array();
  this.commands.forEach(function(command){
      Strings.push(command.commmand);
  });
  return Strings;
};

var ScenareGroup = function (name) {
    this.name = name;
    this.scenarios = new Array();
    this.comment;
    this.consoleView;
};

var Model = function () {
    this.reference;
    this.actualItem;
    this.Items = new Array();
    this.count = 1;
    var id = 0;
    this.genId = function(){
        return id++;
    };

};


Model.prototype.InitScenario = function (name) {
    if (this.actualItem instanceof ScenareGroup) {
        this.InitScenarioFromGroup(name, this.actualItem.id);
    }
    else
    {
    this.actualItem = new Scenare(name);
    this.actualItem.id = this.genId();
    this.actualItem.Add(this.reference);
    this.Items.push(this.actualItem);
    }
  
};

Model.prototype.InitScenarioFromGroup = function (name, idGroup) {
    var scenare = new Scenare(name);
    scenare.groupid = idGroup;
    scenare.id = this.genId();
    scenare.Add(this.reference);
    this.actualItem.scenarios.push(scenare);
    this.actualItem = scenare;
};

Model.prototype.InitGroup = function (name) {
    this.actualItem = new ScenareGroup(name);
    this.actualItem.id = this.genId();
    this.Items.push(this.actualItem);
};


Model.prototype.loadScenarios = function () {
    return this.Items;
};

Model.prototype.saveScenare = function (scenarioId) {
    if (typeof (this.actualItem.groupid) !== "undefined") {
        this.Items.forEach(function (item) {
            if (item instanceof ScenareGroup && item.id === this.actualItem.groupid) {
                item.scenarios.forEach(function (scenare) {
                    if (scenare.id === scenarioId) {
                        this.actualItem.lineCounter = 0;
                        this.actualItem.commands = new Array();
                        this.actualItem.pushCommands(this.actualItem.editorView);
                        scenare = this.actualItem;
                    }
                }.bind(this));
            }
        }.bind(this));
    } else {
        this.Items.forEach(function (item) {
            if (item instanceof Scenare && item.id === scenarioId){
                        this.actualItem.lineCounter = 0;
                        this.actualItem.commands = new Array();
                        this.actualItem.pushCommands(this.actualItem.editorView);
                        item = this.actualItem;
            }
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

Model.prototype.removeTest = function(scenarioId) {
    var scenarioIndex;
    this.Items.forEach(function (item, index) {
        if (item instanceof Scenare && item.id === scenarioId)
            scenarioIndex = index;
    }.bind(this));
    this.Items.splice(scenarioIndex, 1);
};


Model.prototype.removeTestFromGroup = function(scenarioId, groupId) {
    var scenarioIndex;
        this.Items.forEach(function (item) {
        if (item instanceof ScenareGroup && item.id === groupId)
        {
            item.scenarios.forEach(function(scenario, index){
                 if(scenario.id === scenarioId){
                     scenarioIndex = index;
                 }
             });
             item.scenarios.splice(scenarioIndex, 1);
        }
    }.bind(this));
};

Model.prototype.removeGroup = function(groupId) {
    var groupIndex;
    this.Items.forEach(function (item, index) {
        if (item instanceof ScenareGroup && item.id === groupId)
            groupIndex = index;
    });
    this.Items.splice(groupIndex, 1);
};

Model.prototype.getScenare = function (scenareId) {
    var scenare;
    this.Items.forEach(function (item) {
        if (item instanceof Scenare && item.id === scenareId)
            scenare = item;
    }.bind(this));
    return scenare;
};

Model.prototype.getScenareGroup = function (scenareGroupId) {
    var group;
    this.Items.forEach(function (item) {
        if (item instanceof ScenareGroup && item.id === scenareGroupId)
            group = item;
    }.bind(this));
    return group;
};

Model.prototype.getGroupName = function (scenareGroupId) {
    var name;
    this.Items.forEach(function (item) {
        if (item instanceof ScenareGroup && item.id === scenareGroupId)
            name = item.name;
    }.bind(this));
    return name;
};




Model.prototype.getScenareFromGroup = function (scenareId, groupId) {
    var scenare;
    this.Items.forEach(function (item) {
        if (item instanceof ScenareGroup && item.id === groupId)
        {
            item.scenarios.forEach(function(scenario){
                if(scenario.id === scenareId){
                    scenare = scenario;
                }
            });      
        }
    }.bind(this));
    return scenare;
};


Model.prototype.setScenareGroup = function (group) {
    this.Items.forEach(function (item) {
        if (item instanceof ScenareGroup && item.id === group.id)
            item = group;
    }.bind(this));
};

Model.prototype.setScenare = function (scenare) {
    this.Items.forEach(function (item) {
        if (item instanceof Scenare && item.id === scenare.id)
            item = scenare;
    }.bind(this));
};

Model.prototype.setScenareFromGroup = function (scenare) {
    this.Items.forEach(function (item) {
        if (item instanceof ScenareGroup && item.id === scenare.groupid)
            item.forEach(function(scenario){
                if(scenario.id === scenare.id)
                    scenario = scenare;
            });
    }.bind(this));
};