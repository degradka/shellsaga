var before = document.getElementById("before");
var liner = document.getElementById("liner");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");

var currentLanguage = "en";
var languageVars = gamevars_en;

var git = 0;
var pw = false;
let pwd = false;
var commands = [];

function switchLanguage(newLanguage) {
    currentLanguage = newLanguage;
    if (currentLanguage === "en") {
        languageVars = gamevars_en;
    } else if (currentLanguage === "ru") {
        languageVars = gamevars_ru;
    }
}

setTimeout(function() {
    loopLines(languageVars.banner, "", 80);
    textarea.focus();
}, 100);

setTimeout(function() {
    interactWithItem("WelcomeLetter");
}, 1300)

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
        addLine("player@degradka.dev:~$ " + command.innerHTML, "no-animation", 0);
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
        handleGameCommandAutocompletion();
    }
});

function findMatchingCommand(prefix) {
    var availableCommands = Object.values(GAME_COMMANDS);

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
    handleGameCommand(cmdArray);
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

function displayMessage(message, style, time) {
    if (Array.isArray(message)) {
        loopLines(message, style, time);
    } else {
        addLine(message, style, time);
    }
}