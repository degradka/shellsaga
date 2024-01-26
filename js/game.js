var gameState = {
    location: "Home"
};
// TODO: Make so if user types gibberish, pass it as a command and output default string
const GAME_COMMANDS = {
    LESS: {
        command: 'less',
        args: 1,
        autocomplete: autocompleteItems,
    },
    PWD: {
        command: 'pwd',
        args: 0,
        autocomplete: null,
    },
    LS: {
        command: 'ls',
        args: 0,
        autocomplete: null,
    },
    CD: {
        command: 'cd',
        args: 1,
        autocomplete: autocompleteLocations,
    },
    CLEAR: {
        command: 'clear',
        args: 0,
        autocomplete: null,
    },
};

var locations = {
    Home: {
        moveMessage: languageVars.homeMoveMessage,
        locations: ["WesternForest", "NorthernMeadow"],
        items: ["WelcomeLetter"],
    },
    WesternForest: {
        moveMessage: languageVars.westernForestMoveMessage,
        locations: [],
        items: ["Sign", "BackSign"],
    },
    NorthernMeadow: {
        moveMessage: languageVars.northernMeadowMoveMessage,
        locations: [],
        items: [],
    },
}

var items = {
    WelcomeLetter: {
        interactMessage: languageVars.welcomeLetter,
    },
    Sign: {
        interactMessage: languageVars.signInteractMessage,
    },
    BackSign: {
        interactMessage: languageVars.backSignInteractMessage,
    },
}

function interactWithItem(itemName) {
    if (locations[gameState.location].items.includes(itemName)) {
        if (Array.isArray(items[itemName].interactMessage)) {
            loopLines(items[itemName].interactMessage, "color2", 80);
        } else {
            addLine(items[itemName].interactMessage, "color2", 80);
        }
    } else {
        addLine(languageVars.nothingInterestingString, "color2", 0);
    }
    textarea.focus();
}

function handleGameCommand(cmdArray) {
    var cmd = cmdArray[0].toLowerCase();

    switch (cmd) {
        case GAME_COMMANDS.LESS.command:
            if (cmdArray.length < 2) {
                addLine("<span class=\"inherit\">" + languageVars.noLessString + "</span>", "error", 100);
            } else {
                var itemName = cmdArray[1];
                if (locations[gameState.location].items.includes(itemName)) {
                    interactWithItem(itemName);
                } else {
                    addLine("<span class=\"inherit\">" + languageVars.noItemString + itemName + languageVars.hereString + ".</span>", "error", 100);
                }
            }
            break;
        case GAME_COMMANDS.PWD.command:
            addLine(languageVars.whereString + gameState.location + ".", "color2", 100);
            break;
        case GAME_COMMANDS.LS.command:
            ls();
            break;
        case GAME_COMMANDS.CD.command:
            if (cmdArray.length < 2) {
                gameState.location = "Home";
                addLine(languageVars.rootString, "color2", 100);
            } else {
                if (cmdArray[1] == "..") {
                    cdUp();
                } else if (cmdArray[1] == ".") {
                    addLine(locations[gameState.location].moveMessage, "color2", 100);
                } else if (cmdArray[1] == "~") {
                    gameState.location = "Home";
                    addLine(languageVars.rootString, "color2", 100);
                } else {
                    cd(cmdArray[1]);
                }
            }
            break;
        case GAME_COMMANDS.END_GAME.command:
            endGame();
            break;
        case GAME_COMMANDS.CLEAR.command:
            clearTerminal();
            break;
        default:
            addLine("<span class=\"inherit\">" + languageVars.commandString + " '<span class=\"command\">" + cmd + "</span>' " + languageVars.notFoundString + ".</span>", "error", 100);
            break;
    }
}

function changeLocation(newLocation) {
    gameState.location = newLocation;
    addLine(locations[newLocation].moveMessage, "color2", 100);
}

function ls() {
    var locationsList = locations[gameState.location].locations;
    var itemsList = locations[gameState.location].items;

    addLine("&nbsp;" + languageVars.locationsString, "color2", 100);
    if (locationsList.length > 0) {
        for (var i = 0; i < locationsList.length; i++) {
            addLine(locationsList[i], "color2", 100 * (i + 1));
        }
    } else {
        addLine("<br>", "", 100);
    }

    addLine("&nbsp;" + languageVars.itemsString, "color2", 100 * (locationsList.length + 1));
    if (itemsList.length > 0) {
        for (var j = 0; j < itemsList.length; j++) {
            addLine(itemsList[j], "color2", 100 * (locationsList.length + j + 2));
        }
    } else {
        addLine("<br>", "", 100);
    }
}

function cd(newLocation) {
    if (locations[gameState.location].locations.includes(newLocation)) {
        changeLocation(newLocation);
    } else {
        addLine("<span class=\"inherit\">" + languageVars.noLocationString + newLocation + ".</span>", "error", 100);
    }
}

function cdUp() {
    if (gameState.location !== "Home") {
        var parentLocation = getParentLocation(gameState.location);
        changeLocation(parentLocation, true);
    } else {
        addLine(languageVars.firstRoomString, "color2", 100);
    }
}

function getParentLocation(location) {
    for (var key in locations) {
        if (locations[key].locations.includes(location)) {
            return key;
        }
    }
    return null;
}

// I understand that this implementation will haunt me in my nightmares

function autocompleteLocations(prefix) {
    var allLocations = locations[gameState.location].locations;
    return allLocations.filter(location => location.startsWith(prefix));
}

function autocompleteItems(prefix) {
    var allItems = locations[gameState.location].items;
    return allItems.filter(item => item.startsWith(prefix));
}

function findMatchingGameCommand(prefix) {
    var availableCommands = Object.values(GAME_COMMANDS).map(cmd => cmd.command);
    return availableCommands.filter(command => command.startsWith(prefix));
}

function handleGameCommandAutocompletion() {
    var input = textarea.value.trim();
    var currentCommand = input.split(' ')[0];

    if (currentCommand !== '') {
        var gameCommand = Object.values(GAME_COMMANDS).find(cmd => cmd.command === currentCommand);

        if (gameCommand) {
            var args = input.split(' ').slice(1);
            
            if (gameCommand.autocomplete && args.length <= gameCommand.args) {
                var suggestions = gameCommand.autocomplete(args[args.length - 1]);

                if (suggestions.length === 1) {
                    var autocompletedArg = suggestions[0];
                    args[args.length - 1] = autocompletedArg;
                    var autocompletedCommand = gameCommand.command + ' ' + args.join(' ');
                    textarea.value = autocompletedCommand;
                }
            }
        }
    }
}