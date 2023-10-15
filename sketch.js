let c; 
let b; 
let i = 0; 
let dim=64;
let num = [];
let eVal = [];
let filtered;
let pooled;
let ready = true; // change to false later
let stride = 8;
let epochs = 1000;
let numData = [];
let filteredData = [];
let pooledData = [];
let error = 0;
let images = 100;
let clas = Array(images);
let clasError = Array(images);
let target;
let numDataTarget;
let filteredDataTarget;
let pooledDataTarget;
let a=0.0000000005*30*8/(0.25*64);

let weights = Array(10);

let filter = [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1]
];

function preload(){
    for (let i=0; i<images; i++) {
        num.push(loadImage('images/myCanvas0 (' + i + ').jpg'));
    }

    eVal.push(2);
    eVal.push(0);
    eVal.push(2);
    eVal.push(4);
    eVal.push(8);
    eVal.push(3);
    eVal.push(7);
    eVal.push(0);
    eVal.push(1);
    eVal.push(4);
    eVal.push(1);
    eVal.push(5);
    eVal.push(9);
    eVal.push(8);
    eVal.push(6);
    eVal.push(5);
    eVal.push(6);
    eVal.push(9);
    eVal.push(3);
    eVal.push(7);
    eVal.push(5);
    eVal.push(7);
    eVal.push(3);
    eVal.push(2);
    eVal.push(4);
    eVal.push(4);
    eVal.push(3);
    eVal.push(4);
    eVal.push(8);
    eVal.push(9);
    eVal.push(0);
    eVal.push(7);
    eVal.push(5);
    eVal.push(1);
    eVal.push(0);
    eVal.push(1);
    eVal.push(1);
    eVal.push(0);
    eVal.push(3);
    eVal.push(6);
    eVal.push(6);
    eVal.push(5);
    eVal.push(7);
    eVal.push(6);
    eVal.push(9);
    eVal.push(8);
    eVal.push(9);
    eVal.push(2);
    eVal.push(2);
    eVal.push(8);

    for (let i=0; i<10; i++) {
        eVal.push(i);
        eVal.push(i);
        eVal.push(i);
        eVal.push(i);
        eVal.push(i);
    }

    // edit here for target
    target = loadImage('images/myFavoriteNumber.jpg');
}

function setup(){

    /*
    if (ready){
        process();
    }
    */

    // training stage
    for (let i=0; i<images; i++) {
        process(i);
    }
    for (let x=0; x < epochs; x++) {
        cycle();
    }

    // testing
    c = createCanvas(dim,dim); 
    background(0); 
    b = createButton('Click to Save');

    console.log("Your number was supposed to be 5. Your result was: " + test());
} 

function process(numInd) {

    for (let i=0; i<10; i++) {
        let arr = Array(49);
        for (let j=0; j<49; j++) {
            arr[j] = 0.1/(4100*49);
        }
        weights[i] = arr;
    }

    num[numInd].loadPixels();
    numData.push(Array(dim*dim));
    filteredData.push(Array((dim-stride)*(dim-stride)));
    pooledData.push(Array(((dim-stride)/stride)*((dim-stride)/stride)));

    for (let x=0; x<num[numInd].pixels.length; x+=4) { 
        numData[numInd][x/4] = num[numInd].pixels[x];
    }

    console.log("OGPix length: " + numData[numInd].length);
    let someList = "OGPix: ";
    for (let x=0; x<numData[numInd].length; x++) {
        someList += numData[numInd][x] + ", ";
    }
    console.log(someList);

    for (let x = stride/2; x < dim - (stride/2); x++) {
        for (let y = stride/2; y < dim - (stride/2); y++) {
            let newData = convolutionData(numData[numInd], x, y, filter);
            let pix = indexData(x-(stride/2), y-(stride/2), (dim-stride));
            filteredData[numInd][pix] = newData;
        }
    }

    console.log("FilteredPix length: " + filteredData[numInd].length);
    let someList2 = "FilteredPix: ";
    for (let x=0; x<filteredData[numInd].length; x++) {
        someList2 += filteredData[numInd][x] + ", ";
    }
    console.log(someList2);

    for (let x = 0; x < dim - stride; x += stride) {
        for (let y = 0; y < dim - stride; y += stride) {
            let newData = poolingData(filteredData[numInd], x, y);
            let px = x / stride;
            let py = y / stride;
            let pix = indexData(px, py, (dim-stride)/stride);
            pooledData[numInd][pix] = newData;
        }
    }

    console.log("input length: " + pooledData[numInd].length);
    let inputx = "inputs: ";
    for (let x=0; x < pooledData[numInd].length; x++) {
        inputx += pooledData[numInd][x] + ", ";
    }
    console.log(inputx);
}

function processTest() {

    target.loadPixels();
    numDataTarget = (Array(dim*dim));
    filteredDataTarget = (Array((dim-stride)*(dim-stride)));
    pooledDataTarget = (Array(((dim-stride)/stride)*((dim-stride)/stride)));

    for (let x=0; x<target.pixels.length; x+=4) { 
        numDataTarget[x/4] = target.pixels[x];
    }

    console.log("OGPix length: " + numDataTarget.length);
    let someList = "OGPix: ";
    for (let x=0; x<numDataTarget.length; x++) {
        someList += numDataTarget[x] + ", ";
    }
    console.log(someList);

    for (let x = stride/2; x < dim - (stride/2); x++) {
        for (let y = stride/2; y < dim - (stride/2); y++) {
            let newData = convolutionData(numDataTarget, x, y, filter);
            let pix = indexData(x-(stride/2), y-(stride/2), (dim-stride));
            filteredDataTarget[pix] = newData;
        }
    }

    // console.log(-1*0 + 1*0 + 0*0);

    console.log("FilteredPix length: " + filteredDataTarget.length);
    let someList2 = "FilteredPix: ";
    for (let x=0; x<filteredDataTarget.length; x++) {
        someList2 += filteredDataTarget[x] + ", ";
    }
    console.log(someList2);

    for (let x = 0; x < dim - stride; x += stride) {
        for (let y = 0; y < dim - stride; y += stride) {
            let newData = poolingData(filteredDataTarget, x, y);
            let px = x / stride;
            let py = y / stride;
            let pix = indexData(px, py, (dim-stride)/stride);
            pooledDataTarget[pix] = newData;
        }
    }

    console.log("input length: " + pooledDataTarget.length);
    let inputx = "inputs: ";
    for (let x=0; x < pooledDataTarget.length; x++) {
        inputx += pooledDataTarget[x] + ", ";
    }
    console.log(inputx);
}

 function draw(){
    fill(255); 
    stroke(255); 
    strokeWeight(8); 
    if(mouseIsPressed){
        point(mouseX, mouseY); 
    }
    b.mousePressed(saveImage);
    ready = true;
}

 function saveImage(){
    saveCanvas(c, `myCanvas${i}`, 'jpg');
    moveImage(i); 
    i++; 
} 

 function moveImage(ind){
    let fs=Server.CreateObject("Scripting.FileSystemObject")
    var file = fs.GetFile(`~/Downloads/myCanvas${i}.jpg`);
    file.Move("~/Downloads/calcbcproj/images/");
} 

function index(x, y) {
    return (x + y * num.width) * 4;
}

function indexData(x, y, w) {
    return (x + (y * w));
}
  
function convolution(img, x, y, filter) {
    let sumR = 0;
    let sumG = 0;
    let sumB = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let pix = index(x + i, y + j);
        let factor = filter[j + 1][i + 1];
        sumR += img.pixels[pix + 0] * factor;
        sumG += img.pixels[pix + 1] * factor;
        sumB += img.pixels[pix + 2] * factor;
      }
    }
  
    return {
      r: sumR,
      g: sumG,
      b: sumB
    };
}

function convolutionData(data, x, y, filter) {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let pix = indexData(x + i, y + j, dim);
            let factor = filter[j + 1][i + 1];
            sum += data[pix] * factor;
        }
    }

    return sum;
}

function pooling(img, x, y) {
    let brightR = -Infinity;
    let brightG = -Infinity;
    let brightB = -Infinity;
    for (let i = 0; i < stride; i++) {
      for (let j = 0; j < stride; j++) {
        let pix = index(x + i, y + j, img);
        let r = img.pixels[pix + 0];
        let g = img.pixels[pix + 1];
        let b = img.pixels[pix + 2];
        brightR = max(brightR, r);
        brightG = max(brightG, g);
        brightB = max(brightB, b);
      }
    }
    return {
      r: brightR,
      g: brightG,
      b: brightB
    };
}

function poolingData(data, x, y) {
    let bright = -Infinity;
    for (let i = 0; i < stride; i++) {
        for (let j = 0; j < stride; j++) {
            let pix = indexData(x+i, y+j, dim-stride);
            let d = data[pix];
            bright = max(bright, d);
        }
    }
    return bright;
}

function cycle() {
    error = 0;
    for (let i=0; i<images; i++) {
        clas[i] = [];
        evaluation(i);
    }
    error = error/images;
    console.log("error: " + error);
    backpropagate();
}

function evaluation(numInd) {
    for (let i=0; i<10; i++) {
        clas[numInd].push(0);
    }

    for (let i=0; i<10; i++) {
        for (let j=0; j<pooledData[numInd].length; j++) {
            clas[numInd][i] += pooledData[numInd][j]*weights[i][j];
        }
        // console.log("clas: " + clas[numInd][i]);
    }

    clasError[numInd] = 0;
    for (let i=0; i<10; i++) {
        if (i == eVal[numInd]) {
            clasError[numInd] += Math.pow((clas[numInd][i] - 1), 2);
        } else {
            clasError[numInd] += Math.pow((clas[numInd][i]), 2);
        }
        // console.log("clasError: " + clasError[numInd]);
    }

    error += clasError[numInd];
    // console.log("clasError: " + clasError[numInd]);
    // console.log("error: " + error);
}

function backpropagate() {
    for (let i=0; i<10; i++) {
        for (let j=0; j<pooledData[0].length; j++) {
            let coeff = 0;
            for (let k=0; k<images; k++) {
                if (i == eVal[k]) {
                    coeff += 0.1*(2*(pooledData[k][j])*(clas[k][i] - 1));
                } else {
                    coeff += 0.1*(2*(pooledData[k][j])*(clas[k][i]));
                }
            }
            weights[i][j] -= a*coeff;
        }
    }
}

function test() {
    processTest();

    let clasTest = [];

    for (let i=0; i<10; i++) {
        clasTest.push(0);
    }

    for (let i=0; i<10; i++) {
        for (let j=0; j<pooledDataTarget.length; j++) {
            clasTest[i] += pooledDataTarget[j]*weights[i][j];
        }
    }

    for (let i=0; i<10; i++) {
        console.log("cValue of " + i + " is equal to: " + clasTest[i]);
    }

    let clasTestMax = 0;
    for (let i=1; i<10; i++) {
        if (clasTest[i] > clasTest[clasTestMax]) {
            clasTestMax = i;
        }
    }

    return clasTestMax;
}
