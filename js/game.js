var gameState = {
    location: "Home"
};

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
        autocomplete: autocompleteMv,
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
    Crate: {
        items: [""],
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
        interactMessage: languageVars.grandpaInteractMessageTask,
        task: "potatoCrateTask",
    },
    Potato1: {
        interactMessage: languageVars.potatoMessage,
        isMovable: true,
    },
    Potato2: {
        interactMessage: languageVars.potatoMessage,
        isMovable: true,
    },
    Potato3: {
        interactMessage: languageVars.potatoMessage,
        isMovable: true,
    },
}

function interactWithItem(itemName) {
    if (locations[gameState.location].items.includes(itemName)) {
        if (items[itemName].task) {
            handleTask(items[itemName].task);
        } else {
            displayMessage(items[itemName].interactMessage, "color2", 80);
        }
    } else {
        displayMessage(languageVars.nothingInterestingString, "color2", 0);
    }
    textarea.focus();
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
                displayMessage("<span class=\"inherit\">" + languageVars.moveErrorString + "</span>", "error", 100);
            } else {
                var itemName = cmdArray[1];
                var locationName = cmdArray[2];
                if (locations[gameState.location].items.includes(itemName) && locations[gameState.location].locations.includes(locationName)) {
                    if (isItemMovable(itemName)) {
                        moveItem(itemName, locationName);
                        break;
                    } else {
                        displayMessage("<span class=\"inherit\">" + languageVars.mustBeValidString + "</span>", "error", 100);
                    }
                } else {
                    displayMessage("<span class=\"inherit\">" + languageVars.mustBeValidString + "</span>", "error", 100);
                }
            }
            break;
        default:
            displayMessage("<span class=\"inherit\">" + languageVars.commandString + " '<span class=\"command\">" + cmd + "</span>' " + languageVars.notFoundString + ".</span>", "error", 100);
            break;
    }
}

function moveItem(itemName, locationName) {
    locations[gameState.location].items = locations[gameState.location].items.filter(item => item !== itemName);
    locations[locationName].items.push(itemName);
    displayMessage(languageVars.moveString + itemName + languageVars.toString + locationName + ".", "color2", 100);
}

function changeLocation(newLocation) {
    if (isTooSmall(newLocation)) {
        displayMessage(languageVars.youreTooBig, "color2", 100);
    } else {
        gameState.location = newLocation;
        displayMessage(locations[newLocation].moveMessage, "color2", 100);
        hideImage();
    }
}

function isTooSmall(locationName) {
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

    updateImage();
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

function findCommonPrefix(items) {
    var commonPrefix = '';
    var minLength = Math.min(...items.map(item => item.length));

    for (var i = 0; i < minLength; i++) {
        if (items.every(item => item[i] === items[0][i])) {
            commonPrefix += items[0][i];
        } else {
            break;
        }
    }

    return commonPrefix;
}

function autocompleteLocations(prefix) {
    var allLocations = locations[gameState.location].locations;
    var matchingLocations = allLocations.filter(location => location.startsWith(prefix));

    if (matchingLocations.length > 1) {
        var commonPrefix = findCommonPrefix(matchingLocations);
        return [commonPrefix];
    }

    return matchingLocations;
}

function autocompleteItems(prefix) {
    var allItems = locations[gameState.location].items;
    var matchingItems = allItems.filter(item => item.startsWith(prefix));

    if (matchingItems.length > 1) {
        var commonPrefix = findCommonPrefix(matchingItems);
        return [commonPrefix];
    }

    return matchingItems;
}

function autocompleteMv(prefix) {
    var itemSuggestions = autocompleteItems(prefix);
    var locationSuggestions = autocompleteLocations(prefix);

    return itemSuggestions.concat(locationSuggestions);
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


function isItemMovable(itemName) {
    return items[itemName]?.isMovable || false;
}

function handleTask(taskName) {
    switch (taskName) {
        case "potatoCrateTask":
            handlePotatoCrateTask();
            break;
        default:
            break;
    }
}

function handlePotatoCrateTask() {
    if (!gameState.tasks || !gameState.tasks.potatoCrateTask) {
        displayMessage(languageVars.grandpaInteractMessageTask, "color2", 100);
        gameState.tasks = { ...gameState.tasks, potatoCrateTask: "started" };
    } else {
        if (
            locations["Crate"].items.includes("Potato1") &&
            locations["Crate"].items.includes("Potato2") &&
            locations["Crate"].items.includes("Potato3")
        ) {
            if (!gameState.tasks.potatoCrateTaskCompleted) {
                displayMessage(languageVars.grandpaInteractMessageThanks, "color2", 100);
                gameState.tasks = { ...gameState.tasks, potatoCrateTask: "completed", potatoCrateTaskCompleted: true };
            } else {
                displayMessage(languageVars.grandpaInteractMessageDone, "color2", 100);
            }
        } else {
            displayMessage(languageVars.grandpaInteractMessageReminder, "color2", 100);
        }
    }
}