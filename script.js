let audioContext = new(window.AudioContext || window.webkitAudioContext);
let oscList = [];
let masterGainNode = null;

let keyboard = document.querySelector('.keyboard');
let wavePicker = document.querySelector("select[name='waveform']");
let gainControl = document.querySelector("input[name='gain']");

let noteFreq = null;
let customWaveform = null;
let sineTerms = null;
let cosineTerms = null;


// Frequencies tuned to just scale
function createNoteTable() {
  let noteFreq = [];
  for (let i = 0; i < 9; i++) {
    noteFreq[i] = [];
  }

  noteFreq[0]['A'] = 27.253125;
  noteFreq[0]['A#'] = 29.433125;
  noteFreq[0]['B'] = 30.659375;

  noteFreq[1]['C'] = 32.70375;
  noteFreq[1]['C#'] = 34.0675;
  noteFreq[1]['D'] = 36.79125;
  noteFreq[1]['D#'] = 39.245;
  noteFreq[1]['E'] = 40.87875;
  noteFreq[1]['F'] = 43.60375;
  noteFreq[1]['F#'] = 45.99;
  noteFreq[1]['G'] = 49.055;
  noteFreq[1]['G#'] = 52.325;
  noteFreq[1]['A'] = 54.50625;
  noteFreq[1]['A#'] = 58.86625;
  noteFreq[1]['B'] = 61.31875;

  noteFreq[2]['C'] = 65.4075;
  noteFreq[2]['C#'] = 68.135;
  noteFreq[2]['D'] = 73.5825;
  noteFreq[2]['D#'] = 78.49;
  noteFreq[2]['E'] = 81.7575;
  noteFreq[2]['F'] = 87.2075;
  noteFreq[2]['F#'] = 91.98;
  noteFreq[2]['G'] = 98.11;
  noteFreq[2]['G#'] = 104.65;
  noteFreq[2]['A'] = 109.0125;
  noteFreq[2]['A#'] = 117.7325;
  noteFreq[2]['B'] = 122.6375;

  noteFreq[3]['C'] = 130.815;
  noteFreq[3]['C#'] = 136.27;
  noteFreq[3]['D'] = 147.165;
  noteFreq[3]['D#'] = 156.98;
  noteFreq[3]['E'] = 163.515;
  noteFreq[3]['F'] = 174.415;
  noteFreq[3]['F#'] = 183.96;
  noteFreq[3]['G'] = 196.22;
  noteFreq[3]['G#'] = 209.3;
  noteFreq[3]['A'] = 218.025;
  noteFreq[3]['A#'] = 235.465;
  noteFreq[3]['B'] = 245.275;

  noteFreq[4]['C'] = 261.63;
  noteFreq[4]['C#'] = 272.54;
  noteFreq[4]['D'] = 294.33;
  noteFreq[4]['D#'] = 313.96;
  noteFreq[4]['E'] = 327.03;
  noteFreq[4]['F'] = 348.83;
  noteFreq[4]['F#'] = 367.92;
  noteFreq[4]['G'] = 392.44;
  noteFreq[4]['G#'] = 418.60;
  noteFreq[4]['A'] = 436.05;
  noteFreq[4]['A#'] = 470.93;
  noteFreq[4]['B'] = 490.55;

  noteFreq[5]['C'] = 523.26;
  noteFreq[5]['C#'] = 545.08;
  noteFreq[5]['D'] = 588.66;
  noteFreq[5]['D#'] = 627.92;
  noteFreq[5]['E'] = 654.06;
  noteFreq[5]['F'] = 697.66;
  noteFreq[5]['F#'] = 735.84;
  noteFreq[5]['G'] = 744.88;
  noteFreq[5]['G#'] = 837.2;
  noteFreq[5]['A'] = 872.1;
  noteFreq[5]['A#'] = 941.86;
  noteFreq[5]['B'] = 981.1;

  noteFreq[6]['C'] = 1046.52;
  noteFreq[6]['C#'] = 1090.16;
  noteFreq[6]['D'] = 1177.32;
  noteFreq[6]['D#'] = 1255.84;
  noteFreq[6]['E'] = 1308.12;
  noteFreq[6]['F'] = 1395.32;
  noteFreq[6]['F#'] = 1471.68;
  noteFreq[6]['G'] = 1569.76;
  noteFreq[6]['G#'] = 1674.4;
  noteFreq[6]['A'] = 1744.2;
  noteFreq[6]['A#'] = 1883.72;
  noteFreq[6]['B'] = 1962.2;

  noteFreq[7]['C'] = 2093.04;
  noteFreq[7]['C#'] = 2180.32;
  noteFreq[7]['D'] = 2354.64;
  noteFreq[7]['D#'] = 2511.68;
  noteFreq[7]['E'] = 2616.24;
  noteFreq[7]['F'] = 2790.64;
  noteFreq[7]['F#'] = 2943.36;
  noteFreq[7]['G'] = 3139.52;
  noteFreq[7]['G#'] = 3348.8;
  noteFreq[7]['A'] = 3488.4;
  noteFreq[7]['A#'] = 3767.44;
  noteFreq[7]['B'] = 3924.4;

  noteFreq[8]['C'] = 4186.08;
  return noteFreq;
}

if (!Object.entries) {
  Object.entries = function entries(O) {
    return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [
      [k, O[k]]
    ] : []), []);
  };
}



// Building the keyboard
function setup() {
  noteFreq = createNoteTable();

  gainControl.addEventListener('change', changeGain, false);
  masterGainNode = audioContext.createGain();
  masterGainNode.connect(audioContext.destination);
  masterGainNode.gain.value = gainControl.value;

  // Create white keys

  noteFreq.forEach(function(keys, idx) {
    let keyList = Object.entries(keys);
    let octaveElem = document.createElement('div');
    octaveElem.className = 'octave';


    keyList.forEach(function(key) {
      if (key[0].length === 1) {
        octaveElem.appendChild(createKey(key[0], idx, key[1]));

      }
    });

    keyboard.appendChild(octaveElem);
  });

  // document.querySelector("div[data-note='B'[data-octave='5']").scrollIntoView(false);


  sineTerms = new Float32Array([0, 0, 1, 0, 1]);
  cosineTerms = new Float32Array(sineTerms.length);
  customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);

  for (i = 0; i < 9; i++) {
    oscList[i] = [];
  }
}

setup();


function createKey(note, octave, freq) {
  let keyElement = document.createElement('div');
  let labelElement = document.createElement('div');

  keyElement.className = 'key';
  keyElement.dataset['octave'] = octave;
  keyElement.dataset['note'] = note;
  keyElement.dataset['frequency'] = freq;

  labelElement.innerHTML = `${note} <sub> ${octave} </sub>`;
  keyElement.appendChild(labelElement);

  keyElement.addEventListener('mousedown', notePressed, false);
  keyElement.addEventListener('mouseup', noteReleased, false);
  keyElement.addEventListener('mouseover', notePressed, false);
  keyElement.addEventListener('mouseleave', noteReleased, false);

  return keyElement;
}


// Play the oscillator tone
function playTone(freq) {
  let osc = audioContext.createOscillator();
  osc.connect(masterGainNode);

  let type = wavePicker.options[wavePicker.selectedIndex].value;

  if (type == "custom") {
    osc.setPeriodicWave(customWaveform);
  } else {
    osc.type = type;
  }
  osc.frequency.value = freq;
  osc.start();

  return osc;
  
}



function notePressed(event) {  
  if (event.buttons & 1) {
    
    let dataset = event.target.dataset;

    if (!dataset["pressed"]) {
      oscList[dataset["octave"][dataset["note"]]] = playTone(dataset["frequency"]);
      dataset["pressed"] = "yes";
    }
  }
}

function noteReleased(event) {
  let dataset = event.target.dataset;

  if (dataset && dataset["pressed"]) {
    oscList[dataset["octave"][dataset["note"]]].stop();
    oscList[dataset["octave"][dataset["note"]]] = null;
    delete dataset["pressed"];
  }
}

function changeGain(event) {
  masterGainNode.gain.value = gainControl.value
}


// Web MIDI

if (navigator.requestMIDIAccess) {
  console.log('This browser supports WebMIDI!');
} else {
  console.log('WebMIDI is not supported in this browser.');
}

navigator.requestMIDIAccess()
  .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
  console.log(midiAccess);

  var inputs = midiAccess.inputs;
  var outputs = midiAccess.outputs;
}

function onMIDIFailure() {
  console.log('Could not access your MIDI devices.');
}

function onMIDISuccess(midiAccess) {
  for (var input of midiAccess.inputs.values())
    input.onmidimessage = getMIDIMessage;
}

let osc = audioContext.createOscillator();


let type = wavePicker.options[wavePicker.selectedIndex].value;

if (type == "custom") {
  osc.setPeriodicWave(customWaveform);
} else {
  osc.type = type;
}

osc.start();

function getMIDIMessage(message) {
  var command = message.data[0];
  var note = message.data[1];
  var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command

  
  

  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {    
        osc.frequency.value = note;
        osc.connect(masterGainNode);        
        return osc;
      } else {
        noteReleased(note);
      }
      break;
    case 128: // noteOff            
      osc.disconnect(masterGainNode);
      return osc;
      break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
  }
}


