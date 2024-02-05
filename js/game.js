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
    MV: {
        command: 'mv',
        args: 2,
        autocomplete: autocompleteItems,
    },
};

var locations = {
    Home: {
        moveMessage: languageVars.homeMoveMessage,
        locations: ["Garden", "Yard"],
        items: ["WelcomeLetter"],
    },
    Garden: {
        moveMessage: languageVars.gardenMoveMessage,
        locations: ["Greenhouse"],
        items: ["Grandma"],
    },
    Greenhouse: {
        moveMessage: languageVars.greenhouseMoveMessage,
        locations: ["Crate"],
        items: ["Grandpa", "Potato1", "Potato2", "Potato3"],
    },
    Yard: {
        moveMessage: languageVars.yardMoveMessage,
        locations: [],
        items: [],
    },
}

var items = {
    WelcomeLetter: {
        interactMessage: languageVars.welcomeLetter,
    },
    Grandma: {
        interactMessage: languageVars.grandmaInteractMessage,
    },
    Grandpa: {
        interactMessage: languageVars.grandmaInteractMessage,
    },
    Potato1: {
        interactMessage: languageVars.grandmaInteractMessage,
        isMovable: true,
    },
    Potato2: {
        interactMessage: languageVars.grandmaInteractMessage,
        isMovable: true,
    },
    Potato3: {
        interactMessage: languageVars.grandmaInteractMessage,
        isMovable: true,
    },
}

function interactWithItem(itemName) {
    if (locations[gameState.location].items.includes(itemName)) {
        displayMessage(items[itemName].interactMessage, "color2", 80);
    } else {
        displayMessage(languageVars.nothingInterestingString, "color2", 0);
    }
    textarea.focus();
}
// TODO: Implement handling for 'mv' command
function isItemMovable(itemName) {
    return items[itemName]?.isMovable || false;
}

function handleGameCommand(cmdArray) {
    var cmd = cmdArray[0].toLowerCase();

    switch (cmd) {
        case GAME_COMMANDS.LESS.command:
            if (cmdArray.length < 2) {
                displayMessage("<span class=\"inherit\">" + languageVars.noLessString + "</span>", "error", 100);
            } else {
                var itemName = cmdArray[1];
                if (locations[gameState.location].items.includes(itemName)) {
                    interactWithItem(itemName);
                } else {
                    displayMessage("<span class=\"inherit\">" + languageVars.noItemString + itemName + languageVars.hereString + ".</span>", "error", 100);
                }
            }
            break;
        case GAME_COMMANDS.PWD.command:
            displayMessage(languageVars.whereString + gameState.location + ".", "color2", 100);
            break;
        case GAME_COMMANDS.LS.command:
            ls();
            break;
        case GAME_COMMANDS.CD.command:
            if (cmdArray.length < 2) {
                gameState.location = "Home";
                displayMessage(languageVars.rootString, "color2", 100);
            } else {
                if (cmdArray[1] == "..") {
                    cdUp();
                } else if (cmdArray[1] == ".") {
                    displayMessage(locations[gameState.location].moveMessage, "color2", 100);
                } else if (cmdArray[1] == "~") {
                    gameState.location = "Home";
                    displayMessage(languageVars.rootString, "color2", 100);
                } else {
                    cd(cmdArray[1]);
                }
            }
            break;
        case GAME_COMMANDS.CLEAR.command:
            clearTerminal();
            break;
        case GAME_COMMANDS.MV.command:
            if (cmdArray.length < 3) {
                displayMessage("Нахуй идешь, очкарик");
            }
            break;
        default:
            displayMessage("<span class=\"inherit\">" + languageVars.commandString + " '<span class=\"command\">" + cmd + "</span>' " + languageVars.notFoundString + ".</span>", "error", 100);
            break;
    }
}

function changeLocation(newLocation) {
    if (isBox(newLocation)) {
        displayMessage(languageVars.youreTooBig, "color2", 100);
    } else {
        gameState.location = newLocation;
        displayMessage(locations[newLocation].moveMessage, "color2", 100);
    }
}

function isBox(locationName) {
    return locationName.toLowerCase().includes("crate");
}

function ls() {
    var locationsList = locations[gameState.location].locations;
    var itemsList = locations[gameState.location].items;

    displayMessage("&nbsp;" + languageVars.locationsString, "color2", 100);
    if (locationsList.length > 0) {
        for (var i = 0; i < locationsList.length; i++) {
            displayMessage(locationsList[i], "color2", 100 * (i + 1));
        }
    } else {
        displayMessage("<br>", "", 100);
    }

    displayMessage("&nbsp;" + languageVars.itemsString, "color2", 100 * (locationsList.length + 1));
    if (itemsList.length > 0) {
        for (var j = 0; j < itemsList.length; j++) {
            displayMessage(itemsList[j], "color2", 100 * (locationsList.length + j + 2));
        }
    } else {
        displayMessage("<br>", "", 100);
    }
}

function cd(newLocation) {
    if (locations[gameState.location].locations.includes(newLocation)) {
        changeLocation(newLocation);
    } else {
        displayMessage("<span class=\"inherit\">" + languageVars.noLocationString + newLocation + ".</span>", "error", 100);
    }
}

function cdUp() {
    if (gameState.location !== "Home") {
        var parentLocation = getParentLocation(gameState.location);
        changeLocation(parentLocation, true);
    } else {
        displayMessage(languageVars.firstRoomString, "color2", 100);
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