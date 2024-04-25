let serial;
let latestData = "waiting for data";
let data = []; //the list of data from arduino

let video;
let w = 640;
let h = 480;
let distance = 0;
let pboxsize = 10;
let pcolorMultiplier = 1;

let osc; //this is used to generate a sound frequency in p5


function setup() {
  createCanvas(w, h, WEBGL);
  video = createCapture(VIDEO);
  video.size(width,height);
  video.hide();
  noStroke()
  //frameRate(30)

 serial = new p5.SerialPort();

 serial.list();
 
//change this to your serial port 
 serial.open('/dev/tty.usbmodem21401'); 

 serial.on('connected', serverConnected);

 serial.on('list', gotList);

 serial.on('data', gotData);

 serial.on('error', gotError);

 serial.on('open', gotOpen);

 serial.on('close', gotClose);
  osc = new p5.Oscillator(300);
}

function serverConnected() {
 print("Connected to Server");
}

function gotList(thelist) {
 print("List of Serial Ports:");

 for (let i = 0; i < thelist.length; i++) {
  print(i + " " + thelist[i]);
 }
}

function gotOpen() {
 print("Serial Port is Open");
}

function gotClose(){
 print("Serial Port is Closed");
 latestData = "Serial Port is Closed";
}

function gotError(theerror) {
 print(theerror);
}

function gotData() {
 let currentString = serial.readLine();
  trim(currentString);
 if (!currentString) return;
 //console.log(currentString); //comment this out after you determine it is working, to speed up sketch
 latestData = currentString;
 data = split(latestData, ','); //splits the data into the array
  //for splitting the data, make sure you have the right number of data inputs in your array. start counting at 0
  distance = data[0]; //first element in array - first sensor from arduino
}

function draw() {
  background(0);
  pointLight(200, 225, 225, width/2, height/2, 700)
  ambientLight(255)
  video.loadPixels();
  //console.log (video.pixels.length,width*height*4);
  // console.log()
  
  let cboxSize = map(distance, 231, 4, 4, 26, true);
  //console.log(cboxSize)
  let boxSize = lerp(pboxsize, cboxSize, 0.1);

  let currentColorMultiplier = map(distance, 100, 5, .5, 2, true);
  let colorMultiplier = lerp(pcolorMultiplier, currentColorMultiplier, 0.1)
  // console.log(boxSize)

  push()
  //rotate(90)
  
  for (let y=0;y<video.height;y+=int(7)){
    for (let x=0; x<video.width; x+=int(7)){
      let index = (x +y*video.width)*4;
      let r = video.pixels[index];
      let g = video.pixels[index+1];
      let b = video.pixels[index+2];
      let a = video.pixels[index+3];
      let h = 1-r/255
      push()
      fill(r,g,b,a)
      translate(x-width/2,y-height/2,boxSize/2);
      rotate(h*TWO_PI)
      box(boxSize-2, boxSize-2, h*boxSize*20)
      pop()
    }
  }
  pop()
  pboxsize = boxSize;
  pcolorMultiplier = colorMultiplier;
}

function playOscillator() {
  osc.start();
  osc.amp(0.5);
  // start at 700Hz
  osc.freq(2*light);
}