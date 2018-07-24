// var imageList= document.getElementsByTagName( "img" );
// img=

var curPlayers = {};


$(document).ready(function () {
    var availChars = $("#ROW1").children("div");
    var idValList = createIdList(availChars);
    var charsMap = createCharacterMap(availChars);

    $("#attackButton").hide();
    $("#finalHeader").hide();

    setHealthValue(availChars, charsMap);

    //When Selecting Images from Row1
    selectYourCharacter(availChars, charsMap);

    //Create Attack event
    createAttackEvent(charsMap);
});

function setHealthValue(availChars, charsMap) {
    $(availChars).each(function () {
        var colId = $(this).attr("id");
        var health = charsMap[colId]["health"];
        var paragraph = $(this).children("p");
        $(paragraph).text("Health:" + health);
    });
}

function selectYourCharacter(availChars, charsMap) {
    $(availChars).each(function () {
        $(this).on("click", function () {
            applyCharEvent(this, availChars, charsMap);
        })
    });
}

function applyCharEvent(divObj, availChars, charsMap) {
    var temp = $(divObj).children("img");
    $("#myChar").attr("src", $(temp[0]).attr("src"));
    curPlayers["myChar"] = $(divObj).attr("id");


    $(divObj).remove();

    $("#myCharHealth").text("Health: " + charsMap[$(divObj).attr("id")]["health"]);

    $("#R1Header").text("Enemies Available to Attack");

    $(availChars).each(function () {
        $(this).off("click");
    });

    var availEnemies = $("#ROW1").children("div");
    selectYourEnemy(availEnemies, charsMap);
}

function selectYourEnemy(availEnemies, charsMap) {
    $(availEnemies).each(function () {
        var temp = $(this).children("img");

        $(this).on("click", function () {
            $("#battleStatus").hide();
            $("#defender").attr("src", $(temp[0]).attr("src"));

            curPlayers["enemy"] = $(this).attr("id");

            $("#defenderHealth").text("Health: " + charsMap[$(this).attr("id")]["health"]);
            $(this).remove();

            console.log("total chars :" + $("#ROW1").children("div").length);

            if($("#ROW1").children("div").length == 0 ){
               $("#charHeader").hide();
               $("#finalHeader").show();
            }
            $(availEnemies).each(function () {
                $(this).off("click");
            });

            $("#attackButton").show();
        })
    });
}

function createCharacterMap(availChars) {
    var charsMap = {};
    var healthArray = [200, 175, 125, 100];
    var attackArray = [5, 10, 15, 20];
    var counterArray = [10, 15, 20, 25];

    var i = 0;
    $(availChars).each(function () {
        var idVal = $(this).attr("id");
        var healthAndAttack = {};
        healthAndAttack["health"] = healthArray[i];
        healthAndAttack["initialAttack"] = attackArray[i];
        healthAndAttack["attack"] = attackArray[i];
        healthAndAttack["counter"] = counterArray[i];

        charsMap[idVal] = healthAndAttack;
        i++;
    }
    );
    return charsMap;
}

function createIdList(availChars) {
    var idValList = [];
    $(availChars).each(function () {
        idValList.push($(this).attr("id"));
    });

    return idValList;
}

function createAttackEvent(charsMap) {

    $("#attackButton").on("click", function () {
        var myCharId = curPlayers["myChar"];
        var defenderId = curPlayers["enemy"];

        charsMap[myCharId]["health"] = charsMap[myCharId]["health"] - charsMap[defenderId]["counter"];
        charsMap[myCharId]["attack"] = charsMap[myCharId]["attack"] + charsMap[myCharId]["initialAttack"];
        charsMap[defenderId]["health"] = charsMap[defenderId]["health"] - charsMap[myCharId]["attack"];

        $("#myCharHealth").text("Health: " + charsMap[myCharId]["health"]);
        $("#defenderHealth").text("Health: " + charsMap[defenderId]["health"]);

        if ((charsMap[defenderId]["health"] <= 0 && charsMap[myCharId]["health"] > 0)
        || (charsMap[defenderId]["health"] < 0 && charsMap[myCharId]["health"] < 0 
                && charsMap[myCharId]["health"] > charsMap[defenderId]["health"] )
    ) {
            $("#attackButton").hide();
            var availChars = $("#ROW1").children("div");

            if (availChars.length > 0) {
                $("#battleStatus").text("" + myCharId + " defeats " + defenderId + "! Select a new Enemy.");
                selectYourEnemy(availChars, charsMap);
            } else {
                $("#battleStatus").text("" + myCharId + " WINS!!!! " + "GAME OVER!");
            }
            $("#battleStatus").show();
        } else if ((charsMap[defenderId]["health"] > 0 && charsMap[myCharId]["health"] <= 0)
        || (charsMap[defenderId]["health"] < 0 && charsMap[myCharId]["health"] < 0 
                && charsMap[defenderId]["health"] > charsMap[myCharId]["health"] )
    ) {
            $("#attackButton").hide();
            $("#battleStatus").text(" " + myCharId + " is Defeated by " + defenderId + "! GAME OVER!");
            $("#battleStatus").show();
        }
    });
}
