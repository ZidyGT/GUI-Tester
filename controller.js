/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Controller = function(model,view, terminal){
    this.model = model;
    this.view = view;
    this.record = false;
    this.terminal;
    this.MenuBehaviour();
        this.ContextBehaviour();
    this.TermInit(terminal);
};

Controller.prototype.MenuBehaviour = function(){   
            this.model.menu.click(
            function () {
                chrome.devtools.inspectedWindow.eval("window.clearListeners();");
                var element = $('.btn-group > .btn.active');
                var item = $(this).attr("id");
                if (item === "reference") {
                    this.record = true;
                    chrome.devtools.inspectedWindow.eval("window.setListenerGetObject();");
                } else if (item === "copy") {
                    this.record = true;
                    chrome.devtools.inspectedWindow.eval("window.setListenerGetObject();");
                }
                else if(item === "vyber"){
                        chrome.devtools.inspectedWindow.eval("window.setListenerGetObject();");
                        this.record = false;
                    }
            });
};

Controller.prototype.ContextBehaviour = function(){   
            this.model.navbar.click(
            function () {
                var element = this.model.navbar.find('.nav-item.active');
                var item = $(this).attr("id");
                this.view.renderContext(item);         
            });
};

Controller.prototype.Play = function () {
    console.log("starting tests");
    var checkboxes = $("#table").find("input:checkbox");
    var scenarios = JSON.parse(this.model.store.getItem("tests"));
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
                        this.model.scenario.Add(command);
                    chrome.devtools.inspectedWindow.eval(command,
                            function (result, exception) {
                                if (typeof (result) !== "undefined") {
                                    if (typeof (result) !== "object") {
                                        this.terminal.echo(result.toString());
                                    } else if (typeof (result) === "object") {
                                        this.terminal.echo(JSON.stringify(result));
                                    }
                                } else{
                                    if(exception.isException === true)
                                    {
                                        this.terminal.error(exception.value);
                                    }
                                    else if(exception.isError === true)
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
    var cmd = "var x" + this.model.count + " = window.ObjectOz";
    this.model.count++;
    this.terminal.exec(cmd, false);
    console.log(cmd);
    this.model.reference.push(cmd);
};

Controller.prototype.insertCommandCanvas = function () {
    var cmd = 'var x = window.Global';
    this.terminal.exec(cmd, false);
    this.model.reference.push(cmd);
};

