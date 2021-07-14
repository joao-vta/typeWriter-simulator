
var charMap = [
["0", "}", 0.764, 0.638],
["1", "1", 0.296, 0.635],
["2", "\"",0.349, 0.637],
["3", "#", 0.403, 0.640],
["4", "$", 0.453, 0.640],
["5", "%", 0.504, 0.635],
["6", "6", 0.552, 0.638],
["7", "&", 0.607, 0.642],
["8", "'", 0.659, 0.638],
["9", "{", 0.710, 0.640],
["a", "A", 0.333, 0.771],
["b", "B", 0.571, 0.829],
["c", "C", 0.464, 0.832],
["d", "D", 0.442, 0.771],
["e", "E", 0.422, 0.708],
["f", "F", 0.489, 0.771],
["g", "G", 0.541, 0.769],
["h", "H", 0.596, 0.771],
["i", "I", 0.682, 0.705],
["j", "J", 0.645, 0.771],
["k", "H", 0.695, 0.771],
["l", "L", 0.752, 0.777],
["m", "M", 0.675, 0.829],
["n", "N", 0.620, 0.832],
["o", "O", 0.739, 0.705],
["p", "P", 0.784, 0.711],
["q", "Q", 0.325, 0.711],
["r", "R", 0.476, 0.708],
["s", "S", 0.387, 0.777],
["t", "T", 0.531, 0.705],
["u", "U", 0.633, 0.700],
["v", "V", 0.516, 0.835],
["w", "W", 0.372, 0.711],
["x", "X", 0.414, 0.835],
["y", "Y", 0.578, 0.705],
["z", "Z", 0.360, 0.835],
["Enter", "Enter", 0.053, 0.312],
["Enter", "Enter", 0.038, 0.282],
["Enter", "Enter", 0.079, 0.269],
["&nbsp", "&nbsp", 0.906, 0.776],
[" ", " ", 0.392, 0.909],
[" ", " ", 0.444, 0.909],
[" ", " ", 0.491, 0.912],
[" ", " ", 0.535, 0.912],
[" ", " ", 0.594, 0.909],
[" ", " ", 0.640, 0.906],
[" ", " ", 0.705, 0.912],
[" ", " ", 0.746, 0.919],
[" ", " ", 0.801, 0.912],
[" ", " ", 0.851, 0.916],
[" ", " ", 0.380, 0.912],
[" ", " ", 0.671, 0.908],
[" ", " ", 0.565, 0.901],
[";", ":", 0.800, 0.769],
["¢", "@", 0.854, 0.765],
[",", ",", 0.721, 0.830],
[".", ".", 0.776, 0.830],
["/", "?", 0.826, 0.830],
["-", "*", 0.812, 0.635],
["=", "+", 0.866, 0.635],
["ShiftLock", "ShifLock", 0.286, 0.750],
["ShiftKey", "ShifKey", 0.296, 0.832],
["ShiftKey", "ShifKey", 0.893, 0.832]
];

const LETTER_DETEC_THRESHOLD = 0.00085;
const BELL_RING_WARNING = 0.75;
const LEFT_MARGIN = "&nbsp&nbsp";

const KEY_PRESS_SOUND_PATH = "resources/audio1_2.wav";
const CARRIAGE_SOUND_PATH = "resources/car_back.wav";
const BELL_SOUND_PATH = "resources/bell2.mp3";
const PAPER_FLIP_PATH = "resources/paper.wav";

var imgMachine;
var pagina;

var pastLines = [];
var line = "";

var playedBell = false;
var isShift = false;
var isShiftLock = false;

function playSound(soundPath){
    var sound = new Audio(soundPath);
    sound.play();	
}

function addLetterToLine(letter) {
        var linePos = document.getElementById("line").offsetWidth / pagina.offsetWidth;

        if (letter == "Enter") {
            pastLines.push(LEFT_MARGIN + line);
            line = "";
            linePos = 0;
            playedBell = false;
            document.getElementById("arrow").style.visibility = "hidden";
        }
        else if (linePos + 30/pagina.offsetWidth <= 1) line += letter;

        pagina.innerHTML = "Texto: " + "<br>";
        pastLines.forEach(function (pastLine, index) {
            pagina.innerHTML += pastLine + "<br>";
        });
        pagina.innerHTML += "<span id='line'>" + LEFT_MARGIN  + line + "</span>";

        if ((linePos > BELL_RING_WARNING) && (playedBell == false)) {
            playSound(BELL_SOUND_PATH);
            document.getElementById("arrow").style.visibility = "visible";
            playedBell = true;
        }
}

function checkIfClickIsOnLetter(event) {
    var relX = (event.clientX - imgMachine.offsetLeft)/ imgMachine.width;
    var relY = (event.clientY - imgMachine.offsetTop) / imgMachine.height;

    document.getElementById("demo").innerHTML = "Clique em uma letra: ";
    
    var foundLetter = null;
    charMap.forEach(function (letter, index) {
        if (((Math.pow(relX - letter[2], 2) + Math.pow(relY - letter[3], 2)) < LETTER_DETEC_THRESHOLD)
                && !foundLetter) {
            console.log("clicked on letter " + letter[0]);

            if(letter[0] != 'Enter') playSound(KEY_PRESS_SOUND_PATH)
            else 					 playSound(CARRIAGE_SOUND_PATH);
            
            if      (letter[0] == "ShiftKey")  isShift = true;
            else if (letter[0] == "ShiftLock") isShiftLock = !isShiftLock;
            else if (isShift || isShiftLock)   foundLetter = letter[1];
            else   							   foundLetter = letter[0];
        }
    });
    
    if(foundLetter != null) {
        addLetterToLine(foundLetter);
        if(isShift) isShift = false;
    }
}

function changeMouseToPointerOnLetter(event) {
    var relX = (event.clientX - imgMachine.offsetLeft)/ imgMachine.width;
    var relY = (event.clientY - imgMachine.offsetTop) / imgMachine.height;

    imgMachine.style.cursor='auto';
    charMap.forEach(function (letter, index) {
        if (((Math.pow(relX - letter[2], 2) + Math.pow(relY - letter[3], 2)) < LETTER_DETEC_THRESHOLD)) {
            imgMachine.style.cursor='pointer';
        }
    });
}

function clearPage() {
    pastLines = [];
    line = "";
    pagina.innerHTML = "Texto: " + "<br>" + "<span id='line'></span>";
    playedBell = false;
    playSound(PAPER_FLIP_PATH);
}

function checkIfKeyIsValid(event) {
    var foundLetter = null;
    charMap.forEach(function (letter, index) {
        if((event.key == letter[0] || event.key == letter[1]) && !foundLetter) {
            if(letter[0] != 'Enter') playSound(KEY_PRESS_SOUND_PATH);
            else 					 playSound(CARRIAGE_SOUND_PATH);
            foundLetter = event.key;
        }
    });
    if(foundLetter != null) {
        addLetterToLine(foundLetter);
    }
}

window.onload = function() {
    imgMachine = document.getElementById("imageMachine");
    pagina = document.getElementById("pagina");

    imgMachine.addEventListener("click", checkIfClickIsOnLetter);
    document.addEventListener('keydown', checkIfKeyIsValid);
    imgMachine.onmousemove = changeMouseToPointerOnLetter;
    document.getElementById("demo").innerHTML = "Clique em uma letra:";
};