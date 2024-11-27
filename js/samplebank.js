
class SampleBank {
    constructor(audioContext) {
        this.audioContext = audioContext;
        this.bank = {};
        this.loadCount = 0;
        this.totalCount = 0;
    }

    // Loads and maintains sound sources
    async loadSamples(srcObj, callback) {
        this.totalCount = Object.keys(srcObj).length;

        const promises = Object.entries(srcObj).map(async ([key, url]) => {
            const buffer = await this._loadSample(url);
            this.bank[key] = buffer;
        });

        await Promise.all(promises);
        if (callback) callback();
    }

    async _loadSample(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return this.audioContext.decodeAudioData(arrayBuffer);
    }

    // Plays a sound
    playSample(id, when = 0) {
        const buffer = this.bank[id];
        if (!buffer) {
            console.error(`Sample "${id}" not found in the bank.`);
            return;
        }
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        //source.start(this.audioContext.currentTime + when);
        source.start(when);
    }
}