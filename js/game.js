var gameState = {
    playing: false,
    location: "Home"
};

const GAME_COMMANDS = {
    LESS: 'less',
    PWD: 'pwd',
    LS: 'ls',
    CD: 'cd',
    END_GAME: 'endgame',
    CLEAR: 'clear',
};

var locations = {
    Home: {
        name: "Home",
        moveMessage: "You have moved to Home. You are in the comfort of your own home.",
        locations: ["WesternForest", "NorthernMeadow"],
        items: ["WelcomeLetter"],
    },
    WesternForest: {
        name: "Western Forest",
        moveMessage: "You step into the mysterious Western Forest.",
        locations: [],
        items: [],
    },
    NorthernMeadow: {
        name: "Northern Meadow",
        moveMessage: "The serene Northern Meadow welcomes you.",
        locations: [],
        items: [],
    },
}

function interactWithItem(itemName) {
    switch (itemName) {
        case "WelcomeLetter":
            loopLines(welcomeLetter, "color2", 80);
            break;
        // Add more cases for other items
        default:
            addLine("Nothing interesting happens.", "color2", 0);
            break;
    }
}

function startGame() {
    gameState.playing = true;
    clearTerminal();
    setTimeout(function() {
        interactWithItem("WelcomeLetter");
    }, 100);
    
}

function endGame() {
    gameState.playing = false;
    clearTerminal();
    setTimeout(function() {
        loopLines(banner, "", 80);
    }, 100);
}

function handleGameCommand(cmdArray) {
    var cmd = cmdArray[0].toLowerCase();

    switch (cmd) {
        case GAME_COMMANDS.LESS:
            if (cmdArray.length < 2) {
                addLine("<span class=\"inherit\">Pick a different item to less.</span>", "error", 100);
            } else {
                var itemName = cmdArray[1];
                if (locations[gameState.location].items.includes(itemName)) {
                    interactWithItem(itemName);
                } else {
                    addLine("<span class=\"inherit\">There is no " + itemName + " here.</span>", "error", 100);
                }
            }
            break;
        case GAME_COMMANDS.PWD:
            addLine("You are in " + gameState.location + ".", "color2", 100);
            break;
        case GAME_COMMANDS.LS:
            ls();
            break;
        case GAME_COMMANDS.CD:
            if (cmdArray.length < 2) {
                gameState.location = "Home";
                addLine("You have come Home!", "color2", 100);
            } else {
                if (cmdArray[1] == "..") {
                    cdUp();
                } else if (cmdArray[1] == ".") {
                    addLine(locations[gameState.location].moveMessage, "color2", 100);
                } else {
                    cd(cmdArray[1]);
                }
            }
            break;
        case GAME_COMMANDS.END_GAME:
            endGame();
            break;
        case GAME_COMMANDS.CLEAR:
            clearTerminal();
            break;
        default:
            addLine("<span class=\"inherit\">Command '<span class=\"command\">" + cmd + "</span>' not found.</span>", "error", 100);
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

    addLine("&nbsp;" + "Locations:", "color2", 100);
    if (locationsList.length > 0) {
        for (var i = 0; i < locationsList.length; i++) {
            addLine(locationsList[i], "color2", 100 * (i + 1));
        }
    } else {
        addLine("<br>", "", 100);
    }

    addLine("&nbsp;" + "Items:", "color2", 100 * (locationsList.length + 1));
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
        addLine("<span class=\"inherit\">There is no place called " + newLocation + ".</span>", "error", 100);
    }
}

function cdUp() {
    if (gameState.location !== "Home") {
        var parentLocation = getParentLocation(gameState.location);
        changeLocation(parentLocation, true);
    } else {
        addLine("You are at the first room. ", "color2", 100);
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