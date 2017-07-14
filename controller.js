
var Controller = function (model, view, terminal) {
    this.model = model;
    this.view = view;
    this.record = false;
    this.editor = window.ace.edit("editor");
    this.LeftMenuBehaviour();
    this.MenuBehaviour();
    this.ContextBehaviour();
    this.TermInit(terminal);
    this.initEditor();
    this.ClearConsoleBehaviour();
    this.recordButtonBehaviour();

};

Controller.prototype.initEditor = function () {
    this.editor.$blockScrolling = Infinity;
    this.editor.setTheme("ace/theme/chrome");
    this.editor.getSession().setMode("ace/mode/javascript");
};

Controller.prototype.ClearConsoleBehaviour = function () {
    this.view.edit.find("#Clear_Cs").click(function () {
        this.terminal.clear();
    }.bind(this));
};

Controller.prototype.recordButtonBehaviour = function () {
    this.view.recordButton.click(function (event) {
        this.record = !this.record;
        if (this.record === true && this.model.actualItem instanceof window.Scenare) {
            this.view.renderOnRecord();
        } else {
            this.view.renderOffRecord();
            this.record = false;
        }
    }.bind(this));
};



Controller.prototype.MenuBehaviour = function () {
    this.view.menu.each(function (index, elem) {

        $(elem).click(function () {
            this.view.menu.each(function (index, elem) {
                $(elem).removeClass("active");
            });

            chrome.devtools.inspectedWindow.eval("window.guitest.clearListeners();");
            var item = $(elem).attr("id");
            $(elem).addClass("active");

            if (item === "reference") {
                chrome.devtools.inspectedWindow.eval("window.guitest.setListenerGetObject();");
            } else if (item === "action") {
                chrome.devtools.inspectedWindow.eval("window.guitest.setListenerUserAction();");
            } else if (item === "offset") {
                chrome.devtools.inspectedWindow.eval("window.guitest.OffsetOnMouseClick();");
            }
        }.bind(this));
    }.bind(this));
};

Controller.prototype.saveAndLoad = function (item) {
    this.model.actualItem.consoleView = this.terminal.export_view();

    if (this.model.actualItem instanceof window.ScenareGroup) {

        this.model.saveScenareGroup(this.model.actualItem.id);

    } else if (this.model.actualItem instanceof window.Scenare) {

        this.model.actualItem.editorView = this.editor.session.doc.getAllLines();
        this.model.saveScenare(this.model.actualItem.id);
    }
    if (item.hasClass("test-group")) {

        this.model.loadScenareGroup(parseInt(item.attr("id")));
        this.view.activeGroup(parseInt(item.attr("id")));

    } else if (item.hasClass("test-item")) {

        this.model.loadScenare(parseInt(item.attr("id")));
        this.view.activeScenario(parseInt(item.attr("id")));
        this.editor.removeLines(this.editor.selectAll());
        this.editor.session.doc.insertMergedLines({row: 0, column: 0}, this.model.actualItem.editorView);

    } else if (item.hasClass("test-group-item")) {

        var parent = item.parent().parent().parent().find(".test-group").attr("id");
        this.model.loadScenareFromGroup(parseInt(item.attr("id")), parseInt(parent));
        this.view.activeScenarioFromGroup(parseInt(item.attr("id")));
        this.editor.removeLines(this.editor.selectAll());
        this.editor.session.doc.insertMergedLines({row: 0, column: 0}, this.model.actualItem.editorView);

    }
    this.terminal.import_view(this.model.actualItem.consoleView);
};

Controller.prototype.listenerGroup = function (event) {
    var item = $(event.target);

    while (!item.hasClass("span-icon")) {
        item = item.parent();
    }
    var list = item.parent().parent();
    var icon = item.find(".glyphicon");

    if (icon.hasClass("glyphicon-folder-close")) {

        icon.removeClass("glyphicon-folder-close");
        icon.addClass("glyphicon-folder-open");
        list.find("ul").css({display: "block"});
        var sublist = list.find("ul").find(".test-group-item");

        sublist.each(function (index, item) {
            this.view.testProceedRender.find("#proceed-" + $(item).attr("id")).css({display: "block"});
            this.view.testCountRender.find("#count-" + $(item).attr("id")).css({display: "block"});
            this.view.testSelectionRender.find("#checkbox-" + $(item).attr("id")).css({display: "block"});
        }.bind(this));

    } else if (icon.hasClass("glyphicon-folder-open")) {

        icon.removeClass("glyphicon-folder-open");
        icon.addClass("glyphicon-folder-close");
        list.find("ul").css({display: "none"});
        var sublist = list.find("ul").find(".test-group-item");

        sublist.each(function (index, item) {
            this.view.testProceedRender.find("#proceed-" + $(item).attr("id")).css({display: "none"});
            this.view.testCountRender.find("#count-" + $(item).attr("id")).css({display: "none"});
            this.view.testSelectionRender.find("#checkbox-" + $(item).attr("id")).css({display: "none"});
        }.bind(this));
    }
};


Controller.prototype.listener = function (event) {
    this.view.testSheetRender.find(".list-item").each(
            function (index, elem) {
                $(elem).removeClass("active");
            }.bind(this));

    var item = $(event.target);
    while (!item.hasClass("list-item")) {
        item = item.parent();
    }
    item.addClass("active");

    this.saveAndLoad(item);

    if (this.model.actualItem instanceof window.Scenare && this.view.navbar.find(".active").attr("id") === "nav-description") {
        this.btnTestCommentBehaviour();
    } else if (this.model.actualItem instanceof window.ScenareGroup && this.view.navbar.find(".active").attr("id") === "nav-description") {
        this.btnTestCommentBehaviour();
        this.btnGroupCommentBehaviour();
    }
};

Controller.prototype.testSheetBehaviour = function () {

    var checkListener = function (event) {
        var item = $(event.target);
        while (!item.hasClass("check-div")) {
            item = item.parent();
        }
        var groupId = parseInt(item.attr("id").replace("checkbox-", ""));
        var group = this.model.getScenareGroup(groupId);
        var checkbox = item.find(".form-check-input");
        if (checkbox.prop("checked") === true) {
            group.scenarios.forEach(function (scenario) {
                var checkDiv = this.view.testSelectionRender.find(".check-div.group-item-check[id = checkbox-" + scenario.id + "]");
                var check = checkDiv.find(".form-check-input");
                check.prop({checked: true});
            }.bind(this));
        } 
    }.bind(this);

    var checks = this.view.testSelectionRender.find(".check-div.check-group");
    checks.each(function (index, elem) {
        $(elem).unbind("click", checkListener);
        $(elem).click(checkListener);
    }.bind(this));

    this.view.testSheetRender.find(".list-item").each(
            function (index, elem) {
                $(elem).unbind("click", this.listener);
                $(elem).click(this.listener.bind(this));
            }.bind(this));

    this.view.testSheetRender.find(".span-icon").each(
            function (index, elem) {
                $(elem).unbind("click", this.listenerGroup);
                $(elem).click(this.listenerGroup.bind(this));
            }.bind(this));
};


Controller.prototype.removeItems = function () {
    var Items = this.view.testSelectionRender.find(".form-check-input:checked");
    var TestItems = $();
    var GroupItems = $();
    var TestGroupItems = $();


    Items.each(function (index, elem) {
        var item = $(elem).parent();
        if (item.hasClass("check-test")) {
            TestItems.push(item);
        } else if (item.hasClass("check-group")) {
            GroupItems.push(item);
        } else if (item.hasClass("group-item-check")) {
            TestGroupItems.push(item);
        }
    }.bind(this));

    TestItems.each(function (index, elem) {
        var idTest = parseInt($(elem).attr("id").replace("checkbox-", ""));
        this.model.removeTest(idTest);
    }.bind(this));

    TestGroupItems.each(function (index, elem) {
        var _list_item = $(".list-item.test-group-item[id =" + $(elem).attr("id").replace("checkbox-", "") + "]");
        var group = _list_item.parent().parent().parent().find(".list-item.test-group");
        var idTest = parseInt($(elem).attr("id").replace("checkbox-", ""));
        var idGroup = parseInt($(group).attr("id").replace("checkbox-", ""));
        this.model.removeTestFromGroup(idTest, idGroup);
    }.bind(this));

    GroupItems.each(function (index, elem) {
        var idGroup = parseInt($(elem).attr("id").replace("checkbox-", ""));
        this.model.removeGroup(idGroup);
    }.bind(this));


    if (this.model.Items.length === 0) {
        this.view.leftMenuState = false;
        this.view.initLeftMenu();
        this.model.actualItem = "undefined";
        this.view.renderScenarios();
        this.view.renderContext("edit");
        this.view.edit.find(".edit-editor").css({display: "none"});
        this.view.navbarState = false;
        this.view.initNavbar();
    } else {



        this.view.renderScenarios();
        var historyActual;
        if (this.model.actualItem instanceof window.Scenare) {
            historyActual = this.view.testSheetRender.find(".list-item.test-item[id = " + this.model.actualItem.id + "]");
            if (historyActual.length === 0) {
                historyActual = this.view.testSheetRender.find(".list-item.test-group-item[id = " + this.model.actualItem.id + "]");
            }
        } else if (this.model.actualItem instanceof window.ScenareGroup) {
            historyActual = this.view.testSheetRender.find(".list-item.test-group[id = " + this.model.actualItem.id + "]");
        }
        if (historyActual.length === 0) {
            this.model.actualItem = this.model.Items[0];

            if (this.model.actualItem instanceof window.Scenare) {
                if (typeof this.model.actualItem.groupid === "undefined") {
                    this.view.activeScenario();
                } else {
                    this.view.activeScenarioFromGroup();
                }
            } else if (this.model.actualItem instanceof window.ScenareGroup) {
                this.view.activeGroup();
            }
        } else
        {
            if (this.model.actualItem instanceof window.Scenare) {
                if (typeof this.model.actualItem.id === "undefined") {
                    this.view.activeScenario();
                } else {
                    this.view.activeScenarioFromGroup();
                }
            } else if (this.model.actualItem instanceof window.ScenareGroup) {
                this.view.activeGroup();
            }
        }
        this.view.renderContent();
    }
    this.testSheetBehaviour();
};

Controller.prototype.LeftMenuBehaviour = function () {
    this.view.leftMenu.each(function (index, element) {

        $(element).click(function () {
            this.view.leftMenu.each(function (index, elem) {
                $(elem).removeClass("active");
            });

            var item = $(element).attr("id");
            $(element).addClass("active");
            if (item === "createG") {
                this.view.insertGroupSheet();
                this.testGroupBehaviour();

            } else if (item === "createS") {
                this.view.insertTestSheet();
                this.testItemBehaviour();

            } else if (item === "remove") {
                this.removeItems();

            } else if (item === "play") {



                this.view.lastProceedRender.empty();
                this.model.actualItem.consoleView = this.terminal.export_view();
                if (this.model.actualItem instanceof window.Scenare) {
                    this.model.actualItem.editorView = this.editor.session.doc.getAllLines();
                    this.model.saveScenare(this.model.actualItem.id);

                } else if (this.model.actualItem instanceof window.ScenareGroup)
                    this.model.saveScenareGroup(this.model.actualItem.id);

                var Checkboxes = this.view.testSelectionRender.find(".form-check-input:checked");
                var Items = $();
                Checkboxes.each(function (index, elem) {
                    var element = $(elem).parent();
                    if(!element.hasClass("check-group"))
                    Items.push(element);
                }.bind(this));

                Items.each(function (index, item) {
                    if ($(item).hasClass("check-test"))
                    {
                        var testId = parseInt($(item).attr("id").replace("checkbox-", ""));
                        this.proceedTest(testId);

                    } else if ($(item).hasClass("group-item-check")) {
                        var list_item = $(".list-item.test-group-item[id =" + $(item).attr("id").replace("checkbox-", "") + "]");
                        var parent = list_item.parent().parent().parent().find(".list-item.test-group").attr("id");
                        var groupId = parseInt(parent);
                        var scenarioId = parseInt($(item).attr("id").replace("checkbox-", ""));
                        this.proceedTestFromGroup(scenarioId, groupId);
                    }

                }.bind(this));

                this.view.renderContent();
            }
        }.bind(this));
    }.bind(this));
};

Controller.prototype.testItemBehaviour = function () {

    var element = this.view.getTestItem();
    var button = $(element).find("#actual-test-button");

    var tryInsert = function () {
        var name = $(element).find("#actual-test-input").val();
        if (name === "")
        {
            this.view.renderItemTestError();
        } else {
            var IsGroup = (this.model.actualItem instanceof window.ScenareGroup);
            if (this.model.actualItem instanceof window.Scenare) {
                this.model.actualItem.editorView = this.editor.session.doc.getAllLines();
            }
            if (typeof this.model.actualItem !== "undefined") {
                this.model.actualItem.consoleView = this.terminal.export_view();
                this.terminal.clear();
                this.terminal.exec(this.model.reference);
            }
            this.model.InitScenario(name);
            this.editor.getSession().setValue("");
            this.editor.insert(this.model.reference);
            this.view.removeItemTest();
            this.view.renderScenarios();
            this.testSheetBehaviour();
            if (IsGroup)
                this.view.activeScenarioFromGroup();
            else
                this.view.activeScenario();
            this.view.removeItemTest();
            button.unbind("click", tryInsert);
            $(document).unbind("keyup", pressKeyListener);
        }
    }.bind(this);

    var pressKeyListener = function (event) {
        if (event.keyCode === 13) {
            tryInsert();
        } else if (event.keyCode === 46)
        {
            this.view.removeItemTest();
            button.unbind("click", tryInsert);
            $(document).unbind("keyup", pressKeyListener);
        }
    }.bind(this);

    button.click(tryInsert);
    $(document).keyup(pressKeyListener);
    var ReturnButton = $(element).find("#actual-test-return-button");
    ReturnButton.click(function () {
        button.unbind("click", tryInsert);
        $(document).unbind("keyup", pressKeyListener);
        this.view.removeItemTest();
    }.bind(this));
};

Controller.prototype.testGroupBehaviour = function () {

    var element = this.view.getGroupItem();
    var button = $(element).find("#actual-testGroup-button");

    var pressKeyListener = function (event) {
        if (event.keyCode === 13) {
            tryInsert();
        } else if (event.keyCode === 46)
        {
            button.unbind("click", tryInsert);
            $(document).unbind("keyup", pressKeyListener);
            this.view.removeItemGroup();
        }
    }.bind(this);

    var tryInsert = function () {
        var name = $(element).find("#actual-testGroup-input").val();
        if (name === "")
        {
            this.view.renderItemGroupError();
        } else {
            if (this.model.actualItem instanceof window.Scenare) {
                this.model.actualItem.editorView = this.editor.session.doc.getAllLines();
            }

            if (typeof this.model.actualItem !== "undefined") {
                this.model.actualItem.consoleView = this.terminal.export_view();
                this.terminal.clear();
                this.terminal.exec(this.model.reference);
            }
            this.model.InitGroup(name);
            this.view.removeItemGroup();
            this.view.renderScenarios();
            this.testSheetBehaviour();
            this.view.activeGroup();
            this.record = false;
            this.view.removeItemGroup();
            button.unbind("click", tryInsert);
            $(document).unbind("keyup", pressKeyListener);

        }
    }.bind(this);

    button.click(tryInsert);
    $(document).keyup(pressKeyListener);

    var ReturnButton = $(element).find("#actual-group-return-button");

    ReturnButton.click(function () {
        button.unbind("click", tryInsert);
        $(document).unbind("keyup", pressKeyListener);
        this.view.removeItemGroup();
    }.bind(this));
};

Controller.prototype.ContextBehaviour = function () {
    var elem = this.view.navbarMenu;

    elem.each(function (index, element) {

        $(element).click(function () {
            this.view.clearNavBarMenu();
            $(element).addClass("active");
            this.view.renderContent();

            if ($(element).attr("id") === "nav-description") {
                if (this.model.actualItem instanceof window.Scenare) {
                    this.btnTestCommentBehaviour();
                } else if (this.model.actualItem instanceof window.ScenareGroup) {
                    this.btnTestCommentBehaviour();
                    this.btnGroupCommentBehaviour();
                }
            }

        }.bind(this));
    }.bind(this));
};





Controller.prototype.btnTestCommentBehaviour = function () {
    var listener = function (event) {
        var id = $(event.target).attr("id").replace("comment-button-", "");
        this.model.saveDescriptionTest($("#test-comment-" + id).val(), parseInt(id));
    }.bind(this);
    this.view.description.find(".btn-test-comment").each(
            function (index, elem) {
                $(elem).unbind("click", listener);
            });
    this.view.description.find(".btn-test-comment").each(
            function (index, elem) {
                $(elem).click(listener);
            });
};

Controller.prototype.btnGroupCommentBehaviour = function () {
    var listener = function (event) {
        var id = $(event.target).attr("id").replace("comment-button-", "");
        this.model.saveDescriptionGroup($("#group-comment-" + id).val());
    }.bind(this);
    this.view.description.find(".btn-group-comment").each(
            function (index, elem) {
                $(elem).unbind("click", listener);
            });
    this.view.description.find(".btn-group-comment").each(
            function (index, elem) {
                $(elem).click(listener);
            });
};


Controller.prototype.TermInit = function (cons) {
    $(function () {
        $("#" + cons).terminal(function (command) {
            if (command !== '') {
                try {
                    if (this.record === true) {

                        this.model.actualItem.Add(command);
                        var position = this.editor.session.doc.insertMergedLines(this.editor.getCursorPosition(), ['', '']);
                        position.column = 0;
                        this.editor.moveCursorToPosition(position);
                        this.editor.insert(command);

                    }
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
                                        console.error(exception.code);
                                }

                            }.bind(this));
                } catch (e) {
                    console.error(e);
                }
            } else {
                this.echo('');
            }
        }.bind(this), {
            greetings: false,
            height: '200',
            prompt: '>'
        });
        this.terminal = $("#" + cons).terminal();
    }.bind(this));
};

Controller.prototype.insertCommandObject = function () {
    var cmd = "var x" + this.model.count + " = window.ObjectOfCanvas;";
    this.model.count++;
    this.terminal.exec(cmd, false);
};

Controller.prototype.insertCommandCanvas = function () {
    var cmd = 'var x = window.MainCanvas;';
    this.terminal.exec(cmd, false);
    this.model.reference = cmd;
};

Controller.prototype.insertCommandOffset = function () {
    var cmd = "var x" + this.model.count + " = window.guitest.MouseOffset;";
    this.model.count++;
    this.terminal.exec(cmd, false);
};

Controller.prototype.insertUserCommand = function () {
    var cmd = "var x" + this.model.count + " = window.guitest.ObjectOfCanvas;";
    this.model.count++;
    this.terminal.exec(cmd, false);
    var _cmd = "window.guitest.doClick();";
    this.terminal.exec(cmd, false);
    this.terminal.echo(_cmd, false);
    if (this.record === true) {
        this.model.actualItem.Add(_cmd);
        var position = this.editor.session.doc.insertMergedLines(this.editor.getCursorPosition(), ['', '']);
        position.column = 0;
        this.editor.moveCursorToPosition(position);
        this.editor.insert(_cmd);
    }
};


Controller.prototype.active = function () {
    this.testSheetBehaviour();
    if (this.model.actualItem instanceof window.Scenare) {
        if (typeof this.model.actualItem.groupid === "undefined")
            this.view.activeScenario();
        else
            this.view.activeScenarioFromGroup();
    } else if (this.model.actualItem instanceof window.ScenareGroup) {
        this.view.activeGroup();
    }
};

Controller.prototype.proceedTest = function (scenareId) {
    var scenare = this.model.getScenare(scenareId);
    this.runTest(scenare);
    this.model.setScenare(scenare);
};

Controller.prototype.proceedTestFromGroup = function (scenareId, groupId) {
    var scenare = this.model.getScenareFromGroup(scenareId, groupId);
    var name = this.model.getGroupName(groupId);
    this.runTest(scenare, name);
    this.model.setScenare(scenare);
};


Controller.prototype.runTest = function (scenario, groupName) {
    var run = new window.Run(scenario.commands, this.model.genId());
    run.timestamp = new window.moment();
    this.play = true;
    run.commands.forEach(
            function (item, index) {
                if (this.play === true)
                    chrome.devtools.inspectedWindow.eval(item.command,
                            function (result, exception) {
                                if (typeof (exception) !== "undefined") {
                                    if (exception.isException === true  && typeof (run.error) === "undefined")
                                    {
                                        this.play = false;
                                        run.AddError(new window.Error(item.line, item.command, exception.value));
                                        this.play = false;
                                        
                                        if(typeof(groupName) === "undefined")
                                            this.view.renderTestSummary(run, scenario.name);
                                        else
                                          this.view.renderTestSummaryFromGroup(run, scenario.name, groupName);
                                      
                                        this.view.renderScenarios();
                                        this.active();
                                        if (this.view.navbar.find("#nav-summary").hasClass("active"))
                                            this.view.renderContext("summary");
                                    } else if (exception.isError === true)
                                        console.error(exception.code);
                                } else if(typeof (run.error) === "undefined" && (this.play = true)){
                                    if ((run.commands.length - 1) === index) {
                                        
                                        if((typeof(groupName) === "undefined") )
                                            this.view.renderTestSummary(run, scenario.name);
                                        else
                                          this.view.renderTestSummaryFromGroup(run, scenario.name, groupName);
                                      
                                        
                                        this.view.renderScenarios();
                                        this.active();
                                        if (this.view.navbar.find("#nav-summary").hasClass("active"))
                                            this.view.renderContext("summary");
                                    }
                                }
                            }.bind(this));
            }.bind(this));
    scenario.runs.push(run);
    this.play = false;
};



