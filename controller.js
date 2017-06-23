/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Controller = function (model, view, terminal) {
    this.model = model;
    this.view = view;
    this.record = false;
    this.terminal;
    this.LeftMenuBehaviour();
    this.MenuBehaviour();
    this.ContextBehaviour();
    this.TermInit(terminal);
};

Controller.prototype.MenuBehaviour = function () {
    this.view.menu.each(function (index, elem) {
        $(elem).click(function () {
            chrome.devtools.inspectedWindow.eval("window.clearListeners();");
            var item = $(elem).attr("id");
            if (item === "reference") {
                this.record = true;
                chrome.devtools.inspectedWindow.eval("window.setListenerGetObject();");
            } else if (item === "vyber") {
                chrome.devtools.inspectedWindow.eval("window.setListenerGetObject();");
                this.record = false;
            } else if (item === "offset") {
                chrome.devtools.inspectedWindow.eval("window.OffsetOnMouseClick();");
                this.record = false;
            }
        }.bind(this));
    }.bind(this));
};


Controller.prototype.LeftMenuBehaviour = function () {
    this.view.leftMenu.each(function (index, element) {
        $(element).click(function () {
            var item = $(element).attr("id");
            console.log(item);
            if (item === "createG") {
                this.view.insertTestSheet();
                this.testItemBehaviour();
            }
        }.bind(this));
    }.bind(this));
};

Controller.prototype.testItemBehaviour = function () {
    var element = this.view.getTestItem();
    var button = $(element).find("#actual-button");
    button.click(function () {
        var name = $(element).find("#actual-input").val();
        if (name === "")
        {
            this.view.renderItemTestError();
        } else {
            this.model.InitScenario(name);
            this.model.saveScenare(this.model.actualItem);
            this.view.removeItemTest();
            this.view.renderScenarios();
            this.view.activeScenario(this.model.actualItem.id);
        }

    }.bind(this));
};

Controller.prototype.ContextBehaviour = function () {
    var elem = this.view.navbar.find("li");
    elem.each(function (index, element) {
        $(element).click(function () {
            this.view.clearNavBarMenu();
            $(element).addClass("active");
            var elem = this.view.navbar.find('.nav-item.active');
            var item = $(element).attr("id");
            item = item.replace("nav-", "");
            this.view.renderContext(item);
        }.bind(this));
    }.bind(this));
};

Controller.prototype.Play = function () {
    var scenarios = JSON.parse(this.model.store.getItem("tests"));
    console.log("starting tests");
    var checkboxes = $("#table").find("input:checkbox");
    var tests = scenarios.tests;
    checkboxes.each(function (index) {
        if ($(checkboxes[index]).prop("checked") === true)
        {
            this.ExecTest(tests[index], index);
        }
    }.bind(this));
};

Controller.prototype.ExecTest = function (test, index) {
    test.commands.forEach(function (cmd) {
        if (cmd !== '')
            try {
                chrome.devtools.inspectedWindow.eval(cmd);
            } catch (e) {
                console.error(e);
            }
    });
};


/*Console plugin
 * method riding this plugin
 */
Controller.prototype.TermInit = function (cons) {
    $(function () {
        $("#" + cons).terminal(function (command) {
            if (command !== '') {
                try {
                    if (this.record === true)
                        this.model.actualItem.Add(command);
                    chrome.devtools.inspectedWindow.eval(command,
                            function (result, exception) {
                                if (typeof (result) !== "undefined") {
                                    if (typeof (result) === "boolean") {
                                        this.terminal.echo(result.toString());
                                    }
                                } else if (typeof (exception) !== "undefined") {
                                    if (exception.isException === true)
                                    {
                                        this.terminal.error(exception.value);
                                    } else if (exception.isError === true)
                                        console.error(new String(exception.code));
                                }
                            }.bind(this));
                } catch (e) {
                    console.error(new String(e));
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

Controller.prototype.insertCommandObject = function () {
    var cmd = "var x" + this.model.count + " = window.ObjectOfGlobal";
    this.model.count++;
    this.terminal.exec(cmd, false);
    console.log(cmd);
    if (this.record === true)
        this.model.reference.push(cmd);
};

Controller.prototype.insertCommandCanvas = function () {
    var cmd = 'var x = window.Global';
    this.terminal.exec(cmd, false);
    this.model.reference.push(cmd);
};

Controller.prototype.insertCommandOffset = function () {
    var cmd = "var x" + this.model.count + " = window.MouseOffset";
    this.model.count++;
    this.terminal.exec(cmd, false);
    console.log(cmd);
};

