$(function() {
    $('#console').terminal(function(command) {
        if (command !== '') {
            try {
                 var result = chrome.devtools.inspectedWindow.eval(command);
                if (result !== null) {
                    this.echo(new String(result));
                    window.addCase(new String(result));
                }
            } catch(e) {
                this.error(new String(e));
            }
        } else {
           this.echo('');
        }
    },{
        greetings: false,
        height: '300',
        prompt: '> '
    });
    window.term= $('#console').terminal();
});