// script.js
const form = document.getElementById('generate-meme'); // used to get form element

const img = new Image(); // used to load image from <input> and draw to canvas
const inputImg = document.getElementById('image-input'); // used to get the uploaded image

const clear = document.getElementById("[type='reset']"); // used to get clear button
const read = document.getElementById("[type='button']"); // used to get read button

const topText = document.getElementById('text-top'); // used to get top text input
const bottomText = document.getElementById('text-bottom'); // used to get bottom text input

const voiceSelect = document.getElementById('voice-selection'); // used to get voice selection
const volumeGroup = document.getElementById('volume-group'); // used to get volume group
const volumeIcon = document.querySelector('img'); // used to get volume icon
const volumeLevel = document.querySelector("[type='range']"); // used to get volume level

const voices = synth.getVoices();

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  let canvas = document.getElementById('user-image');
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  let dimensions = getDimensions(canvas.width, canvas.height, img.width, img.height);

  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.drawImage(img, dimensions['startX'], dimensions['startY'], dimensions['width'], dimensions['height']);

  context.font = '32px Impact'; /////////
  context.fillStyle = 'white';
  context.textAllign = 'center';
  context.fillText(topText.value, canvas.width/2, 40, 40);
  context.fillText(bottomText.value, canvas.width / 2, canvas.height - 5, 40);
  clear.removeAttribute('disabled');
});

imgInput.addEventListener('change', (event)=> {
  img.src = URL.createObjectURL(event.target.files[0])
});

form.addEventListener('submit', (event)=> {
  event.preventDefault();

  let canvas = document.getElementById('user-image');
  let context = canvas.getContext('2d');
  let dimensions;
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  if (img.src) {
    dimensions = getDimensions(canvas.width, canvas.height, img.width, img.height);
    
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(img, dimensions['startX'], dimensions['startY'], dimensions['width'], dimensions['height']);
  }
  
  context.font = '32px Impact'; /////////
  context.fillStyle = 'white';
  context.textAllign = 'center';
  context.fillText(topText.value, canvas.width/2, 40, 40);
  context.fillText(bottomText.value, canvas.width / 2, canvas.height - 5, 40);
  
  clear.removeAttribute('disabled');
  read.removeAttribute('disabled');
  voiceSelect.removeAttribute('disabled');

  if (voiceSelect.options.length === 1) {
    populateVoices();
  }
})

const populateVoices = () => {
  for (let i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

clear.addEventListener('click', ()=> {
  let canvas = document.getElementById('user-image');
  let context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);

  clear.setAttribute('disabled', 'true');
  read.setAttribute('disabled', 'true');
  voiceSelect.setAttribute('disabled', 'true');

  topText.value = '';
  bottomText.value = '';
})

read.addEventListener('click', (event)=> {
  event.preventDefault();

  let input = topText.value + bottomText.value;
  let speach = new SpeechSynthesisUtterance(input);
  let option = voiceSelect.selectedOptions[0].getAttribute('data-name');

  for(let i = 0; i < voices.length ; i++) {
    if(voices[i].name === option) {
      speach.voice = voices[i];
    }
  }

  speach.pitch = 1;
  speach.volume = volumeLevel.value / 100;
  synth.speak(speach);
})

volumeGroup.addEventListener('change', (event)=> {
  const volumeLevel = event.target.value;

  if (volumeLevel >=67 && volumeLevel <= 100) {
    volumeLevelIcon.src = './icons/volume-level-3.svg';
  } else if (volumeLevel >= 34 && volumeLevel <= 66) {
    volumeLevelIcon.src = './icons/volume-level-2.svg';
  } else if (volumeLevel >= 1 && volumeLevel <= 33) {
    volumeLevelIcon.src = './icons/volume-level-1.svg';
  } else {
    volumeLevelIcon.src = './icons/volume-level-0.svg';
  }
})


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
