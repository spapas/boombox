class Sequencer {
  constructor(audioContext, sampleBank, tempo = 125) {
    this.audioContext = audioContext;
    this.sampleBank = sampleBank;
    this.tempo = tempo;
    this.isPlaying = false;
    this.currentStep = 0;
    this.noteTime = 0.0;
    this.startTime = 0.0;
    this.tic = 60 / (this.tempo * 4); // 16th note duration
    this.pattern = null;
    this.patternLength = 0;
    this.channelStatus = {};
    this.eventListeners = {};
    this.schedulerInterval = null;
  }

  /******************* EVENT SYSTEM *******************/
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  trigger(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  /******************* TRANSPORT *******************/
  setTempo(newTempo) {
    this.tempo = newTempo;
    this.tic = (60 / this.tempo) / 4; // 16th note duration
    this.currentStep = 0;
  }

  start() {
    if (!this.pattern) {
      console.error("No pattern set. Cannot start sequencer.");
      return;
    }
    if (this.isPlaying) {
      console.log("Sequencer not starting: already playing.");
      return;
    }


    this.isPlaying = true;
    this.currentStep = 0; // Start at the first step
    this.noteTime = 0.0;  // Reset note time
    this.startTime = this.audioContext.currentTime + 0.005; // Small delay to sync with audio context

    this.schedulerInterval = setInterval(() => this.scheduleNote(), 25); // Schedule at fixed intervals

  }

  stop() {
    if (!this.isPlaying) return;


    // Reset step and timing
    this.currentStep = 0;
    this.noteTime = 0.0;
    this.isPlaying = false;


    if (this.schedulerInterval) clearInterval(this.schedulerInterval); // Clear the scheduler interval
    this.schedulerInterval = null;
    console.log("Sequencer stopped.");
    // Trigger stop event for external listeners
    this.trigger("sequencer:stop");
  }

  /******************* SCHEDULING *******************/
  scheduleNote() {

    if (!this.isPlaying) {
      console.log("Sequencer stopped. Exiting scheduler.");
      return;
    }

    const currentTime = this.audioContext.currentTime;
    const playTime = this.noteTime + this.startTime;

    if (playTime <= currentTime + 0.1) {
      this.playPatternStepAtTime(playTime);
      this.nextNote();
    }
  }

  nextNote() {
    this.currentStep = (this.currentStep + 1) % this.patternLength;
    this.noteTime += this.tic;
    console.log(`Current step: ${this.currentStep}, Next note in ${this.tic} seconds`);
  }

  playPatternStepAtTime(playTime) {
    if (!this.pattern) return;
    console.log("Playing pattern step at time: " + playTime);

    Object.entries(this.pattern).forEach(([channel, steps]) => {
      if (steps[this.currentStep] === "1") {
        this.sampleBank.playSample(channel, playTime);
      }
    });

    this.trigger("sequencer:step", this.currentStep);
  }

  /******************* PATTERN HANDLING *******************/
  setPattern(pattern) {
    this.pattern = {};
    Object.entries(pattern.sequence).forEach(([channel, line]) => {
      this.pattern[channel] = this.parseLine(line);
    });
    this.patternLength = pattern.sequence[Object.keys(pattern.sequence)[0]].length;
    console.log("Pattern set successfully.");
    this.trigger("sequencer:setpattern", pattern);
  }

  parseLine(line) {
    return line.split("");
  }
}
