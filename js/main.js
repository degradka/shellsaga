var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");

const COMMANDS = {
    WHOIS: 'whois',
    WHOAMI: 'whoami',
    SOCIAL: 'social',
    HISTORY: 'history',
    HELP: 'help',
    EMAIL: 'email',
    CLEAR: 'clear',
    BANNER: 'banner',
    GAME: 'game',
};

var git = 0;
var pw = false;
let pwd = false;
var commands = [];

setTimeout(function() {
    loopLines(banner, "", 80);
    textarea.focus();
}, 100);

window.addEventListener("keyup", enterKey);

//init
textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
    if (e.keyCode == 181) {
        document.location.reload(true);
    }
    if (e.keyCode == 13) {
        commands.push(command.innerHTML);

        var cmdArray = command.innerHTML.split(' ');

        git = commands.length;
        addLine("guest@degradka.dev:~$ " + command.innerHTML, "no-animation", 0);
        commander(cmdArray)
        command.innerHTML = "";
        textarea.value = "";
    }
    if (e.keyCode == 38 && git != 0) {
        git -= 1;
        textarea.value = commands[git];
        command.innerHTML = textarea.value;
    }
    if (e.keyCode == 40 && git != commands.length) {
        git += 1;
        if (commands[git] === undefined) {
            textarea.value = "";
        } else {
            textarea.value = commands[git];
        }
            command.innerHTML = textarea.value;
    }
}

textarea.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
        event.preventDefault();
        if (gameState.playing !== true) {
            var currentCommand = textarea.value.trim();
            
            if (currentCommand !== '') {
                var matchingCommand = findMatchingCommand(currentCommand);
    
                if (matchingCommand !== null) {
                    textarea.value = matchingCommand;
                }
            }
        }
    }
});

function findMatchingCommand(prefix) {
    var availableCommands = gameState.playing ? Object.values(GAME_COMMANDS) : Object.values(COMMANDS);

    var matchingCommands = availableCommands.filter(function (command) {
        return command.startsWith(prefix);
    });

    if (matchingCommands.length === 1) {
        return matchingCommands[0];
    }

    return null;
}

function findCommonPrefix(strings) {
    if (strings.length === 0) {
        return '';
    }

    var sortedStrings = strings.slice().sort();
    var firstString = sortedStrings[0];
    var lastString = sortedStrings[sortedStrings.length - 1]
    var i = 0;
    while (i < firstString.length && firstString.charAt(i) === lastString.charAt(i)) {
        i++;
    }
    return firstString.slice(0, i);
}

function clearTerminal() {
    setTimeout(function() {
        terminal.innerHTML = '<a id="before"></a>';
        before = document.getElementById("before");
    }, 1);
}

function commander(cmdArray) {
    var cmd = cmdArray[0].toLowerCase();
    if (gameState.playing == false) {
        switch (cmd) {
            case "help":
                loopLines(help, "color2 margin", 80);
                break;
            case "whois":
                loopLines(whois, "color2 margin", 80);
                break;
            case "whoami":
                loopLines(whoami, "color2 margin", 80);
                break;
            case "sudo":
                addLine("Oh no, what have you done...", "color2", 80);
                setTimeout(function() {
                    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                }, 1000);
                break;
            case "social":
                loopLines(social, "color2 margin", 80);
                break;
            case "projects":
                loopLines(projects, "color2 margin", 80);
                break;
            case "history":
                addLine("<br>", "", 0);
                loopLines(commands, "color2", 80);
                addLine("<br>", "command", 80 * commands.length + 50);
                break;
            case "email":
                addLine('Opening mailto:<a href="mailto:degradka@gmail.com">degradka@gmail.com</a>...', "color2", 80);
                newTab(email);
                break;
            case "clear":
                clearTerminal();
                break;
            case "banner":
                loopLines(banner, "", 80);
                break;
            case "github":
                addLine("Opening GitHub...", "color2", 0);
                newTab(github);
                break;
            case "game":
                startGame();
                break;
            default:
                addLine("<span class=\"inherit\">Command not found. For a list of commands, type <span class=\"command\">'help'</span>.</span>", "error", 100);
                break;
        }
    } else {
        handleGameCommand(cmdArray);
    }
}

function newTab(link) {
    setTimeout(function() {
        window.open(link, "_blank");
    }, 500);
}

function addLine(text, style, time, addBreak = false) {
    var t = "";
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
            t += "&nbsp;&nbsp;";
            i++;
        } else {
            t += text.charAt(i);
        }
    }
    setTimeout(function() {
        var next = document.createElement("p");
        next.innerHTML = t;
        next.className = style;

        before.parentNode.insertBefore(next, before);

        if (addBreak) {
            addLine("<br>", "", 0)
        }

        window.scrollTo(0, document.body.offsetHeight);
    }, time);
}

function loopLines(name, style, time) {
    name.forEach(function(item, index) {
        addLine(item, style, index * time);
    });
}