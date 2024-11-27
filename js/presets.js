const PRESETS = [
    {
        'Ζεμπέκικο': {
            sequence: {
                'count': '100020003000400050006000700080009000',
                'closedHatlow': '101010101010101010101010101010101010',
                'openHat': '000000000000000000000000000000000001',
                'closedHat': '101000101000100010100010100010001000',
                'snare': '000000100000100000000010000010001000',
                'kick': '101000001000000010100000100000000000'
            }
        }
    }, {
        'Απτάλικο': {
            sequence: {
                'count': '100020003000400050006000700080009000',
                'closedHatlow': '101010101010101010101010101010101010',
                'openHat': '000000000001000000000000000000000000',
                'closedHat': '100010001000101000101000100010100010',
                'snare': '000000000000000000100000100000000010',
                'kick': '100010001000101000001000000010100000'
            }
        }
    }, {
        'Χασάπικο': {
            sequence: {
                'count': '1000200030004000',
                'hh2': '0000100000001000',
                'closedHat': '1000000010000000',
                'snare': '0000100000001000',
                'kick': '1000000010000000'
            }
        }
    }, {
        'Χασαποσέρβικο': {
            sequence: {
                'count': '1000200010002000',
                'closedHat2': '0010001000100010',
                'closedHat': '1000100010001000',
                'snare': '0010001000100010',
                'kick': '1000100010001000'
            }
        }
    }, {
        'Ρούμπα': {
            sequence: {
                'count': '1000200030004000',
                'hh2': '1010101010101000',
                'closedHat': '1000100010001000',
                'snare': '0001001000010010',
                'kick': '1000100010001000'
            }
        }
    }, {
        'Τσιφτετέλι': {
            sequence: {
                'count': '1000200030004000',
                'hh2': '1010100010001000',
                'closedHat': '1010001010001000',
                'snare': '0010001000001000',
                'kick': '1000000010000000'
            }
        }
    }, {
        'Καμηλιέρικο': {
            sequence: {
                'count': '102030405060708090',
                'closedHat': '101010101010101010',
                'snare2': '000100010001000010',
                'snare': '001000100010001000',
                'kick': '100010001000100000'
            }
        }
    }
]



const setPatternGrid = (pattern) => {
    const sequencerGrid = document.getElementById("sequencer-grid");
    sequencerGrid.innerHTML = "";
    let steps = sequencer.patternLength;
    document.getElementById('sequencer-grid').style.gridTemplateColumns = `100px repeat(${steps + 1}, 30px)`
    Object.keys(pattern.sequence).forEach((channel) => {
        //if (channel === 'count') return
        const onoff = pattern.sequence[channel].split("").map((v) => parseInt(v));

        const labelCell = document.createElement("div");
        labelCell.classList.add("label")
        labelCell.innerText = channel;
        sequencerGrid.appendChild(labelCell);
        for (let step = 0; step < steps; step++) {

            const cell = document.createElement("div");
            if (channel === 'count') {

                cell.innerHTML = `<div class='sequencer-cell-lb'>${onoff[step]}</div>`
            } else {
                if (onoff[step] === 1) {
                    cell.classList.add("active");
                }

                cell.addEventListener("click", () => {
                    if (cell.classList.contains("active")) {
                        cell.classList.remove("active");
                        onoff[step] = 0;
                    } else {
                        sampleBank.playSample(channel)
                        cell.classList.add("active");
                        onoff[step] = 1;
                    }
                    pattern.sequence[channel] = onoff.join("")

                    sequencer.setPattern(pattern);
                })
                cell.classList.add("sequencer-cell");
                cell.dataset.channel = channel;
                cell.dataset.step = step;
            }
            sequencerGrid.appendChild(cell);
        }
    });
}

const loadPreset = (preset) => {
    console.log("Loading preset...");
    const key = Object.keys(preset)[0];
    sequencer.setPattern(preset[key]);
    setPatternGrid(preset[key]);
}


const renderPresets = () => {
    console.log("Rendering presets...");
    const container = document.getElementById("preset-list");
    PRESETS.forEach((preset, index) => {
        const key = Object.keys(preset)[0];
        const button = document.createElement("button");
        button.innerText = key;
        button.addEventListener("click", () => {
            loadPreset(preset);

            //sequencer.setPattern(preset[key]);
        });
        container.appendChild(button);
    });
}