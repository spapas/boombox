

//const dispatcher = new Dispatcher();
const AUDIO = new (window.AudioContext ?? window.webkitAudioContext)();
const sampleBank = new SampleBank(AUDIO);

const sequencer = new Sequencer(AUDIO, sampleBank);

sequencer.setTempo(125);

const examplePattern = {
  sequence: {
    'count': '1000200030004000',
    'hh2': '1010100010001000',
    'closedHat': '1010001010001000',
    'snare': '0010001000001000',
    'kick': '1000000010000000'
  }
};


sequencer.on("sequencer:step", (currentStep) => {

  document.querySelectorAll(".sequencer-cell").forEach((cell) => {
    cell.classList.remove("current-step");
  });

  document
    .querySelectorAll(`.sequencer-cell[data-step="${currentStep}"]`)
    .forEach((cell) => {
      cell.classList.add("current-step");
    });
});

const samples = {},
  sampleList = ['count', 'kick', 'kick2', 'snare', 'snare2', 'openHat', 'hh2', 'closedHat', 'closedHat2', 'closedHatlow'];

sampleList.forEach(function (id) {
  samples[id] = "samples/" + id + '.wav';
});

sampleBank.loadSamples(
  samples, () => {
    console.log("Samples loaded!");
  }
);



sequencer.on("sequencer:setpattern", (pattern) => {
  console.log("Pattern set", pattern);
  // set pattern element with pattern
  document.getElementById("pattern").innerHTML = JSON.stringify(pattern, null, 2);
});

const editPattern = (pattern) => {
  sequencer.setPattern(pattern);
  setPatternGrid(pattern);
}


document.addEventListener("DOMContentLoaded", function (event) {
  renderPresets();

  sequencer.setPattern(examplePattern);
  setPatternGrid(examplePattern)

})