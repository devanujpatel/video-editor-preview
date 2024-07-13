const videoInput = document.getElementById('videoInput');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const roiCanvas = document.getElementById('roiCanvas');
const roiCtx = roiCanvas.getContext('2d');
const aspectRatio = document.getElementById("aspectRatio");
const startCropper = document.getElementById("startCropper");
const stopCropper = document.getElementById("stopCropper");
const html = document.getElementsByTagName("html");
const container = document.getElementById("container");


let isSelecting = false;
let startX, startY, endX, endY;
let selected = false;

let aspectRatioValue = 9 / 16;

function splitString(ratio) {
    const parts = ratio.split(":");
    const num1 = parseInt(parts[0], 10);
    const num2 = parseInt(parts[1], 10);
    return [num1, num2];
}

aspectRatio.addEventListener('change', () => {
    aspectRatioValue = aspectRatio.value
    // const ratio = "9:16";
    const [num1, num2] = splitString(aspectRatioValue);
    console.log(num1); // 9
    console.log(num2); // 16
    aspectRatioValue = num1 / num2;

})

// function drawGridOverlay(x, y) {
//     const videoHeight = video.videoHeight;
//     const videoWidth = videoHeight * aspectRatioValue;
//
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//
//     ctx.strokeStyle = 'red';
//     ctx.lineWidth = 2;
//
//     // Calculate grid dimensions
//     const gridWidth = videoWidth;
//     const gridHeight = videoHeight;
//
//     // Adjust startX and startY based on aspect ratio
//     startX = x;
//     startY = 0;
//
//     // Ensure grid stays within bounds of the video
//     if (startX < 0) startX = 0;
//     if (startY < 0) startY = 0;
//     if (startX + gridWidth > canvas.width) startX = canvas.width - gridWidth;
//     if (startY + gridHeight > canvas.height) startY = canvas.height - gridHeight;
//
//     // Draw grid overlay
//     ctx.strokeRect(startX, startY, gridWidth, gridHeight);
// }

function drawGridOverlay() {
    console.log("drawGridOverlay")
    const videoHeight = video.videoHeight;
    const videoWidth = videoHeight * aspectRatioValue;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 20;

    // Calculate grid dimensions
    const gridWidth = videoWidth;
    const gridHeight = videoHeight;

    // Calculate startX and startY based on aspect ratio
    startX = 50//(canvas.width - gridWidth) / 2;
    startY = 0;

    console.log(startX, startY, gridWidth, gridHeight)
    // Draw grid overlay
    ctx.strokeRect(startX, startY, gridWidth, gridHeight);
}


// Assuming StartCropper is an element to initiate the cropping action
startCropper.addEventListener("click", () => {

    //
    // const newDiv = document.createElement('div');
    //
    // // Set class for the div (optional for styling)
    // newDiv.className = 'myDiv';
    //
    // x = 200;
    // y = 800;
    // // Set styles for the div
    // newDiv.style.left = `${x}px`;  // X coordinate
    // newDiv.style.top = `${y}px`;   // Y coordinate
    // newDiv.style.backgroundColor = 'red'; // Background color
    //
    // // Append the div to the container
    // const container = document.getElementById('container');
    // container.appendChild(newDiv);
    // // Add mousemove listener to track grid movement
    // canvas.addEventListener('mousemove', function (event) {
    //     console.log("mouse move")
    //
    //     // drawGridOverlay(event.offsetX, event.offsetY);
    // });


    canvas.addEventListener('mousedown', function (event) {
        startX = event.offsetX;
        startY = event.offsetY;
    });

    canvas.addEventListener('mousemove', function (event) {
        if (selected) { // Assuming selected is a flag to indicate selection state
            endX = event.offsetX;
            endY = event.offsetY;
        }
    });

    canvas.addEventListener('mouseup', function () {
        selected = true; // Assuming selected is set to true to indicate selection end
        // Perform actions after selection is complete
    });

    roiCanvas.style.display = "block";
});


// Assuming StartCropper is an element to initiate the cropping action
stopCropper.addEventListener("click", () => {



    canvas.addEventListener('mousedown', function (event) {
        //pass
    });

    canvas.addEventListener('mousemove', function (event) {
        //pass
    });

    canvas.addEventListener('mouseup', function () {
        //pass
    });

    roiCanvas.style.display = "none";

});


videoInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        video.src = url;
        video.play();
    }
});

video.addEventListener('loadedmetadata', function () {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
});

video.addEventListener('play', function () {
    const processFrame = () => {
        if (!video.paused && !video.ended) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            //
            // if (isSelecting) {
            //     ctx.strokeStyle = 'red';
            //     ctx.lineWidth = 2;
            //     ctx.strokeRect(startX, startY, endX - startX, endY - startY);
            // }

            if (selected) {
                let x = startX //Math.min(startX, endX);
                const y = 0 //Math.min(startY, endY);
                // const width = Math.abs(endX - startX);
                // const height = Math.abs(endY - startY);


                // how to get the height of the entire video
                const videoHeight = video.videoHeight;


                const videoWidth = videoHeight * aspectRatioValue;

                if (x > Math.abs(canvas.width - videoWidth)) {
                    x = Math.abs(canvas.width - videoWidth)
                }


                const roi = ctx.getImageData(x, y, videoWidth, videoHeight);

                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = videoWidth;
                tempCanvas.height = videoHeight;
                tempCtx.putImageData(roi, 0, 0);

                roiCanvas.width = videoWidth;
                roiCanvas.height = videoHeight;
                roiCtx.clearRect(0, 0, roiCanvas.width, roiCanvas.height);
                roiCtx.drawImage(tempCanvas, 0, 0, videoWidth, videoHeight, 0, 0, roiCanvas.width, roiCanvas.height);
            }

            requestAnimationFrame(processFrame);
        }
    };

    processFrame();
});


