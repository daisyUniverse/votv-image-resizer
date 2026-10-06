// Image Resizer
// Made to resize images to a fixed list of aspect ratios
// Explicitly built to make VOTV custom content easier to create
// Robin Universe [S]
// 10 . 05 . 26

var Ratio = [1,1]

// dropzone event handlers
var dropzone;
dropzone = document.getElementById("dropzone");
uploadmodal = document.getElementById("uploadmodal")
dropzone.addEventListener("dragenter", dragenter, false);
dropzone.addEventListener("dragover", dragover, false);

dropzone.addEventListener("drop", async (e) => {
    e.stopPropagation();
    e.preventDefault();
    var dt = e.dataTransfer;
    const [file] = dt.files;

    var imageToResize = document.querySelector("#imgToResize");
    imageToResize.src = await fileToDataUri(file);

    const resizedImage = document.querySelector("#resizedImage");
    imageToResize.addEventListener("load", () => {
        resizedImage.src = changeAspect(imageToResize, Ratio);
    });

    //dropzone.style.visibility = "hidden";
    dropzone.style.height = "5%"
    dropzone.style.marginTop = "0%"
    dropzone.style.position = "relative"
    uploadmodal.style.marginTop = "2vh"
    imagesDiv.style.visibility = "visible";
    return false;
});

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

const imagesDiv = document.querySelector("#images");
const fileInput = document.querySelector("#upload");

fileInput.addEventListener("change", async (e) => {
    const [file] = fileInput.files;

    var imageToResize = document.querySelector("#imgToResize");
    imageToResize.src = await fileToDataUri(file);

    const resizedImage = document.querySelector("#resizedImage");
    imageToResize.addEventListener("load", () => {
    resizedImage.src = changeAspect(imageToResize, Ratio);
    });

    dropzone.style.visibility = "hidden";
    imagesDiv.style.visibility = "visible";
    return false;
});

function fileToDataUri(field) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
        resolve(reader.result);
    });

    reader.readAsDataURL(field);
    });
}

// the aspect ratio chooser thingy
document.addEventListener('input', function (event) {
	if (event.target.id !== 'aspect') return;
    console.log(event.target.value);
    Ratio[0] = event.target.value.split(":")[0]
    Ratio[1] = event.target.value.split(":")[1]
    var imageToResize = document.querySelector("#imgToResize");
    resizedImage.src = changeAspect(imageToResize, Ratio)
}, false);

// the beans and tomatos
function changeAspect(imgToResize, aspectRatio) {
    const canvas        = document.createElement("canvas");
    const context       = canvas.getContext("2d");

    const origWidth     = imgToResize.width; // gimme dat
    const origHeight    = imgToResize.height;

    var chunkW = (origWidth / aspectRatio[0]);  // How wide each horizontal chunk is
    var chunkH = (origHeight / aspectRatio[1]); // How high each vertical chunk is

    const maxSize       = Math.max(origHeight, origWidth) // Get da longest side of image
    var orientation     = ""
    var heightOffset    = 0;
    var widthOffset     = 0;
    if (origHeight < origWidth){ // Calculate new image dimensions from target aspect ratio
        // Image is Portrait
        var orientation = "Landscape" // just for debugging or maybe showing to the user later idk
        var finalSizeH = Math.round( chunkW * aspectRatio[1] )
        var finalSizeW = maxSize
        widthOffset = 0;
        heightOffset = ( (Math.round( finalSizeH / 2 )) - (Math.round( origHeight / 2 ))  );
    } else {
        // Image is Portrait
        var orientation = "Portrait"
        var finalSizeW = Math.round( chunkH * aspectRatio[0] )
        var finalSizeH = maxSize
        heightOffset = 0;
        widthOffset = ( (Math.round( finalSizeW / 2 )) - (Math.round( origWidth / 2 )) );
    }
    
    // console.log(orientation, maxSize, finalSizeW, finalSizeH) // debugging

    // Final size of the image to fart
    canvas.width        = finalSizeW;
    canvas.height       = finalSizeH;
    context.fillStyle   = "transparent";
    context.drawImage(imgToResize, widthOffset, heightOffset, origWidth, origHeight );
    
    return canvas.toDataURL();
}
