//Add your global variables here

//global variables

let pattern = [1, 3, 2, 4, 3, 1, 2, 4];
let progress = 0;
let gamePlaying = false;
let tonePlaying = false;
let volume = 0.5;
let clueHoldTime = 1000;
let guessCounter = 0;

const cluePauseTime = 333; //length of pause in between clues
const nextClueWaitTime = 1000; // wait time before playback begins

//storing the start and stop buttons
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");


// Add your functions here

function startGame() {
  //function body
  progress = 0;
  gamePlaying = true;
  guessCounter = 0;

  //swapping the start and stop buttons
  startBtn.classList.add("hidden");
  stopBtn.classList.remove("hidden");

  playClueSequence();
}

function stopGame() {
  gamePlaying = false;

  //swapping the start and stop buttons
  startBtn.classList.remove("hidden");
  stopBtn.classList.add("hidden");
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit")
}

function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit")
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  context.resume()
  let delay = nextClueWaitTime; //setting the delay to initial wait time
  guessCounter = 0;
  for (let i = 0; i <= progress; i++) { // for every clue revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue, delay, pattern[i]) // setting timeout to play that clue
    delay += clueHoldTime
    delay += cluePauseTime;
  }
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }

  if (btn === pattern[guessCounter]) {
    //correct guess
    guessCounter++;

    //move to the next one if sequence is finished
    if (guessCounter === progress + 1) {
      if (progress === pattern.length - 1) {
        winGame();
      } else {
        progress++;
        guessCounter = 0;
        setTimeout(playClueSequence, 1000);
        //playClueSequence();
      }
    }
  } else {
    //wrong guess
    loseGame();
  }
}

function loseGame() {
  stopGame();
  alert("Game Over! You lost😞");
}

function winGame() {
  stopGame();
  alert("Congratulations!🎉 You won the game.");
}

// Sound Synthesis Functions for Steps 6-8
// You do not need to edit the below code
const freqMap = {
  1: 261.6,
  2: 293.7,
  3: 329.6,
  4: 349.2
}
function playTone(btn, len) {
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
  context.resume()
  tonePlaying = true
  setTimeout(function() {
    stopTone()
  }, len)
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume()
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
    context.resume()
    tonePlaying = true
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
  tonePlaying = false
}

// Page Initialization
// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0, context.currentTime)
o.connect(g)
o.start(0)