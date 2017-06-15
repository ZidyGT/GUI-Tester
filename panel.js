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

var GuiPanel = function (terminal) {
    this.reference = new Array();
    this.scenario;
    this.record = false;
    this.count = 1;
    this.terminal;
    try {
        this.store = localStorage;
        this.store.clear();
    } catch (Exception) {
        console.error("localStorage is not supported");
    }
    console.log(this.store);
    this.TermInit(terminal);
    this.InitScenarios();
};


GuiPanel.prototype.Play = function () {
    console.log("starting tests");
    var checkboxes = $("#table").find("input:checkbox");
    var scenarios = JSON.parse(this.store.getItem("tests"));
    var tests = scenarios.tests;
    var log = $("<span><b>Start testing</b></span></br>");
    $("#log").append(log);
    checkboxes.each(function(index) {
        if ($(checkboxes[index]).prop("checked") === true)
        {
            this.ExecTest(tests[index], index);
        }
    }.bind(this));
    log = $("<span><b>End testing</b></span></br>");
    $("#log").append(log);
};

GuiPanel.prototype.ExecTest = function (test, index) {
    var log = $("<span><b><i>Start test " + (index + 1) + "</i></b></span></br>");
    $("#log").append(log);
    test.commands.forEach(function(cmd) {
        if (typeof (cmd) !== "boolean")
        {
            if(cmd !=='')
                try{
                    chrome.devtools.inspectedWindow.eval(cmd,function(result){
                        if(typeof (result) !== "undefined" && typeof (result) === "boolean"){
                            
                        log = ("<span>Result of " + cmd + " is " + test.commands[test.commands.indexOf(cmd)+1].toString() + "</span></br>");
                        $("#log").append(log);
                        }
                    }.bind(this));
                }catch(e){
                console.error(e);
                }
            log = $("<span class='exe'>Execute " + cmd.toString() + "</span></br>");
            $("#log").append(log);
        } 
        else if (typeof (cmd) === "boolean"){
            if (cmd === true) {
                log = $("<span class='Boolean_true'>" + cmd.toString() + "</span></br>");
            } else
            {
                log = $("<span class='Boolean_false'>" + cmd.toString() + "</span></br>");
            }
            $("#log").append(log);
        }
    }.bind(this));
    log = $("<span><b><i>End test " + (index + 1) + "</i><b></span></br>");
    $("#log").append(log);
    console.log(this.cache);
};


/*Console plugin
 * method riding this plugin
 */
GuiPanel.prototype.TermInit = function (cons) {
    $(function () {
        $("#" + cons).terminal(function (command) {
            if (command !== '') {
                try {
                    chrome.devtools.inspectedWindow.eval(command,
                            function (result) {
                                if (typeof (result) !== "undefined" && typeof (result) === "boolean") {
                                    this.terminal.echo(result.toString());
                                    if (this.record === true)
                                        this.scenario.Add(result);
                                }
                            }.bind(this));
                    if (this.record === true)
                        this.scenario.Add(command);
                } catch (e) {
                    this.error(new String(e));
                }
            } else {
                this.echo('');
            }
        }.bind(this), {
            greetings: false,
            height: '200',
            prompt: '> '
        });
        this.terminal = $("#" + cons).terminal();
    }.bind(this));
};

GuiPanel.prototype.insertCommand = function (msg) {
    var obj = msg.obj;
    var cmd = "var x" + this.count + " = new " + msg.type + "(" +
            obj.x + "," + obj.y + "," + obj.width + "," + obj.height + ",'" +
            obj.fillColor + "'," + obj.lineWidth + ",'" + obj.lineColor + "');";
    this.count++;
    this.terminal.exec(cmd, false);
    console.log(cmd);
    this.reference.push(cmd);
};

GuiPanel.prototype.insertCommandCanvas = function () {
    var cmd = 'var x = window.GlobalCanvas;';
    this.terminal.exec(cmd, false);
    this.reference.push(cmd);
};


GuiPanel.prototype.InitScenario = function () {
    this.scenario = new Scenare();
    this.scenario.pushCommands(this.reference);
};

GuiPanel.prototype.InitScenarios = function () {
    console.log("initScenarios");
    if (this.store.getItem("tests") === null) {
        this.store.setItem("tests", JSON.stringify({tests: new Array()}));
    }
};

GuiPanel.prototype.saveScenare = function (scenario) {
    var scenarios = JSON.parse(this.store.getItem("tests"));
    scenarios.tests.push(scenario);
    this.store.setItem("tests", JSON.stringify(scenarios));
    console.log(scenario);
    console.log(this.store);
};

GuiPanel.prototype.loadTests = function () {
    var scenarios = JSON.parse(this.store.getItem("tests"));
    $("#table").empty();
    scenarios.tests.forEach(function (item) {
        console.log(item);
        var row = $("<tr></tr>");
        var fir_cell = $("<td></td>");
        fir_cell.append("<div class='form-check'> " +
                "<label class='form-check-label'>" +
                "<input id='" + scenarios.tests.indexOf(item) +
                "' class='form-check-input' type='checkbox' value=''>" +
                "</label></div>");
        var sec_cell = $("<td></td>");
        var it = $("<kbd></kbd>");
        it.text("test " + (scenarios.tests.indexOf(item) + 1));
        sec_cell.append(it);
        "' class='form-check-input' type='checkbox' value=''>" +
                row.append(fir_cell);
        row.append(sec_cell);
        $("#table").append(row);
        if (item.errors.length !== 0) {
            item.errors.forEach(function () {
                var thi_cell = $("<td></td>");
            });
        }
    });
};


var panel = new GuiPanel("console");

$(document).ready(function (event) {
    $("#stop").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#startTest").prop("disabled", true);
    $("#start").click(function () {
        $("#stop").prop("disabled", false);
        $("#start").prop("disabled", true);
        panel.InitScenario();
        panel.record = true;
    });
    $("#stop").click(function () {
        $("#save").prop("disabled", false);
        $("#start").prop("disabled", false);
        panel.record = false;
    });
    $("#save").click(function () {
        $("#save").prop("disabled", true);
        panel.saveScenare(panel.scenario);
        panel.loadTests();
    });
    $("#startTests").click(function () {
        panel.Play();
    });
});









