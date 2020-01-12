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

const note1 = document.querySelector('#note1');
const note2 = document.querySelector('#note2');
const note3 = document.querySelector('#note3');
const note4 = document.querySelector('#note4');
const note5 = document.querySelector('#note5');
const note6 = document.querySelector('#note6');
const note7 = document.querySelector('#note7');
const note8 = document.querySelector('#note8');
const note9 = document.querySelector('#note9');
const note10 = document.querySelector('#note10');
const note11 = document.querySelector('#note11');
const note12 = document.querySelector('#note12');
const note13 = document.querySelector('#note13');
const note14 = document.querySelector('#note14');
const note15 = document.querySelector('#note15');


// Frequencies tuned to just scale
function createNoteTable() {
  let noteFreq = [];
  for (let i = 0; i < 9; i++) {
    noteFreq[i] = [];
  }

  // noteFreq[0]['A'] = 27.253125;
  // noteFreq[0]['A#'] = 29.433125;
  // noteFreq[0]['B'] = 30.659375;

  noteFreq[1]['C'] = note1.value;
  // noteFreq[1]['C#'] = 34.0675;
  noteFreq[1]['D'] = note2.value;
  // noteFreq[1]['D#'] = 39.245;
  noteFreq[1]['E'] = note3.value;
  noteFreq[1]['F'] = note4.value;
  // noteFreq[1]['F#'] = 45.99;
  noteFreq[1]['G'] = note5.value;
  // noteFreq[1]['G#'] = 52.325;
  noteFreq[1]['A'] = note6.value;
  // noteFreq[1]['A#'] = 58.86625;
  noteFreq[1]['B'] = note7.value;

  noteFreq[2]['C'] = note8.value;
  // noteFreq[2]['C#'] = 68.13
  noteFreq[2]['D'] = note9.value;
  // noteFreq[2]['D#'] = 78.49;
  noteFreq[2]['E'] = note10.value;
  noteFreq[2]['F'] = note11.value;
  // noteFreq[2]['F#'] = 91.98;
  noteFreq[2]['G'] = note12.value;
  // noteFreq[2]['G#'] = 104.65;
  noteFreq[2]['A'] = note13.value;
  // noteFreq[2]['A#'] = 117.7325;
  noteFreq[2]['B'] = note14.value;

  noteFreq[3]['C'] = note15.value;
  // noteFreq[3]['C#'] = 136.27;
  // noteFreq[3]['D'] = 147.165;
  // noteFreq[3]['D#'] = 156.98;
  // noteFreq[3]['E'] = 163.515;
  // noteFreq[3]['F'] = 174.415;
  // noteFreq[3]['F#'] = 183.96;
  // noteFreq[3]['G'] = 196.22;
  // noteFreq[3]['G#'] = 209.3;
  // noteFreq[3]['A'] = 218.025;
  // noteFreq[3]['A#'] = 235.465;
  // noteFreq[3]['B'] = 245.275;

  // noteFreq[4]['C'] = 261.63;
  // noteFreq[4]['C#'] = 272.54;
  // noteFreq[4]['D'] = 294.33;
  // noteFreq[4]['D#'] = 313.96;
  // noteFreq[4]['E'] = 327.03;
  // noteFreq[4]['F'] = 348.83;
  // noteFreq[4]['F#'] = 367.92;
  // noteFreq[4]['G'] = 392.44;
  // noteFreq[4]['G#'] = 418.60;
  // noteFreq[4]['A'] = 436.05;
  // noteFreq[4]['A#'] = 470.93;
  // noteFreq[4]['B'] = 490.55;

  // noteFreq[5]['C'] = 523.26;
  // noteFreq[5]['C#'] = 545.08;
  // noteFreq[5]['D'] = 588.66;
  // noteFreq[5]['D#'] = 627.92;
  // noteFreq[5]['E'] = 654.06;
  // noteFreq[5]['F'] = 697.66;
  // noteFreq[5]['F#'] = 735.84;
  // noteFreq[5]['G'] = 744.88;
  // noteFreq[5]['G#'] = 837.2;
  // noteFreq[5]['A'] = 872.1;
  // noteFreq[5]['A#'] = 941.86;
  // noteFreq[5]['B'] = 981.1;

  // noteFreq[6]['C'] = 1046.52;
  // noteFreq[6]['C#'] = 1090.16;
  // noteFreq[6]['D'] = 1177.32;
  // noteFreq[6]['D#'] = 1255.84;
  // noteFreq[6]['E'] = 1308.12;
  // noteFreq[6]['F'] = 1395.32;
  // noteFreq[6]['F#'] = 1471.68;
  // noteFreq[6]['G'] = 1569.76;
  // noteFreq[6]['G#'] = 1674.4;
  // noteFreq[6]['A'] = 1744.2;
  // noteFreq[6]['A#'] = 1883.72;
  // noteFreq[6]['B'] = 1962.2;

  // noteFreq[7]['C'] = 2093.04;
  // noteFreq[7]['C#'] = 2180.32;
  // noteFreq[7]['D'] = 2354.64;
  // noteFreq[7]['D#'] = 2511.68;
  // noteFreq[7]['E'] = 2616.24;
  // noteFreq[7]['F'] = 2790.64;
  // noteFreq[7]['F#'] = 2943.36;
  // noteFreq[7]['G'] = 3139.52;
  // noteFreq[7]['G#'] = 3348.8;
  // noteFreq[7]['A'] = 3488.4;
  // noteFreq[7]['A#'] = 3767.44;
  // noteFreq[7]['B'] = 3924.4;

  // noteFreq[8]['C'] = 4186.08;
  return noteFreq;
}

if (!Object.entries) {
  Object.entries = function entries(O) {
    return reduce(keys(O), (e, k) => concat(e, typeof k === 'string' && isEnumerable(O, k) ? [
      [k, O[k]]
    ] : []), []);
  };
}


let buildCount = 0;
// Building the keyboard
function setup(note1, note2, note3, note4, note5, note6, note7, note8, note9, note10, note11, note12, note13, note14, note15) {

  // prevents multiple keyboards being built
  if (buildCount >= 1) {
    console.log('Keyboard already built!');

  } else {
    buildCount++;
    noteFreq = createNoteTable(note1, note2, note3, note4, note5, note6, note7, note8, note9, note10, note11, note12, note13, note14, note15);

    gainControl.addEventListener('change', changeGain, false);
    masterGainNode = audioContext.createGain();
    masterGainNode.connect(audioContext.destination);
    masterGainNode.gain.value = gainControl.value;

    // Create white keys

    noteFreq.forEach(function (keys, idx) {

      let keyList = Object.entries(keys);
      let octaveElem = document.createElement('div');
      octaveElem.className = 'octave';

      keyList.forEach(function (key) {
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
}

// setup();

let keyCount = 48
function createKey(note, octave, freq) {
  let keyElement = document.createElement('div');
  let labelElement = document.createElement('div');

  keyElement.className = 'key';
  keyElement.dataset['octave'] = octave;
  keyElement.dataset['note'] = note;
  keyElement.dataset['frequency'] = freq;

  labelElement.innerHTML = `${keyCount} <sub>`;
  keyElement.appendChild(labelElement);

  keyCount++;

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

function changeGain() {
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


let osc1 = audioContext.createOscillator();
let osc2 = audioContext.createOscillator();
let osc3 = audioContext.createOscillator();
let osc4 = audioContext.createOscillator();
let osc5 = audioContext.createOscillator();
let osc6 = audioContext.createOscillator();
let osc7 = audioContext.createOscillator();
let osc8 = audioContext.createOscillator();
let osc9 = audioContext.createOscillator();
let osc10 = audioContext.createOscillator();
let osc11 = audioContext.createOscillator();
let osc12 = audioContext.createOscillator();
let osc13 = audioContext.createOscillator();
let osc14 = audioContext.createOscillator();
let osc15 = audioContext.createOscillator();

osc1.type = 'triangle';
osc2.type = 'triangle';
osc3.type = 'triangle';
osc4.type = 'triangle';
osc5.type = 'triangle';
osc6.type = 'triangle';
osc7.type = 'triangle';
osc8.type = 'triangle';
osc9.type = 'triangle';
osc10.type = 'triangle';
osc11.type = 'triangle';
osc12.type = 'triangle';
osc13.type = 'triangle';
osc14.type = 'triangle';
osc15.type = 'triangle';


osc1.start();
osc2.start();
osc3.start();
osc4.start();
osc5.start();
osc6.start();
osc7.start();
osc8.start();
osc9.start();
osc10.start();
osc11.start();
osc12.start();
osc13.start();
osc14.start();
osc15.start();








function getMIDIMessage(message) {
  let command = message.data[0];
  let note = message.data[1];
  let velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command


  switch (command) {
    case 144: // noteOn
      if (velocity > 0) {
        switch (note) {
          case 48:
            osc1.frequency.value = note1.value;
            osc1.connect(masterGainNode);
            return osc1;
            break;
          case 49:
            osc2.frequency.value = note2.value;
            osc2.connect(masterGainNode);
            return osc2;
            break;
          case 50:
            osc3.frequency.value = note3.value;
            osc3.connect(masterGainNode);
            return osc3;
            break;
          case 51:
            osc4.frequency.value = note4.value;
            osc4.connect(masterGainNode);
            return osc4;
            break;
          case 52:
            osc5.frequency.value = note5.value;
            osc5.connect(masterGainNode);
            return osc5;
            break;
          case 53:
            osc6.frequency.value = note6.value;
            osc6.connect(masterGainNode);
            return osc6;
            break;
          case 54:
            osc7.frequency.value = note7.value;
            osc7.connect(masterGainNode);
            return osc7;
            break;
          case 55:
            osc8.frequency.value = note8.value;
            osc8.connect(masterGainNode);
            return osc8;
            break;
          case 56:
            osc9.frequency.value = note9.value;
            osc9.connect(masterGainNode);
            return osc9;
            break;
          case 57:
            osc10.frequency.value = note10.value;
            osc10.connect(masterGainNode);
            return osc10;
            break;
          case 58:
            osc11.frequency.value = note11.value;
            osc11.connect(masterGainNode);
            return osc11;
            break;
          case 59:
            osc12.frequency.value = note12.value;
            osc12.connect(masterGainNode);
            return osc12;
            break;
          case 60:
            osc13.frequency.value = note13.value;
            osc13.connect(masterGainNode);
            return osc13;
            break;
          case 61:
            osc14.frequency.value = note14.value;
            osc14.connect(masterGainNode);
            return osc14;
            break;
          case 62:
            osc15.frequency.value = note15.value;
            osc15.connect(masterGainNode);
            return osc15;
            break;
          default:
            console.log('Not a valid note');
        }


        // osc.frequency.value = note;
        // osc.connect(masterGainNode);
        // return osc;
      } else {
        noteReleased(note);
      }
      break;
    case 128: // noteOff 
      switch (note) {
        case 48:
          osc1.disconnect(masterGainNode);
          return osc1;
          break;
        case 49:
          osc2.disconnect(masterGainNode);
          return osc2;
          break;
        case 50:        
          osc3.disconnect(masterGainNode);
          return osc3;
          break;
        case 51:          
          osc4.disconnect(masterGainNode);
          return osc4;
          break;
        case 52:          
          osc5.disconnect(masterGainNode);
          return osc5;
          break;
        case 53:          
          osc6.disconnect(masterGainNode);
          return osc6;
          break;
        case 54:          
          osc7.disconnect(masterGainNode);
          return osc7;
          break;
        case 55:          
          osc8.disconnect(masterGainNode);
          return osc8;
          break;
        case 56:          
          osc9.disconnect(masterGainNode);
          return osc9;
          break;
        case 57:          
          osc10.disconnect(masterGainNode);
          return osc10;
          break;
        case 58:          
          osc11.disconnect(masterGainNode);
          return osc11;
          break;
        case 59:          
          osc12.disconnect(masterGainNode);
          return osc12;
          break;
        case 60:          
          osc13.disconnect(masterGainNode);
          return osc13;
          break;
        case 61:          
          osc14.disconnect(masterGainNode);
          return osc14;
          break;
        case 62:          
          osc15.disconnect(masterGainNode);
          return osc15;
          break;
        default:
          console.log('Not a valid note');
      }



      break;
      // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
  }
}
