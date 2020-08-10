//Upload file
var file = new Image(); 
var filePreview = document.getElementById("filePreview");
var isFileLoaded = false;

//Uploaded image
var width;
var height;

var scaleX;
var scaleY;

//Info
var resolutionInfo = document.getElementById("resolutionInfo");

//Canvas
var canvas = document.getElementById("canvas");
var ctx;
var imgData;

//Characters of witch ascii art consists from lowest to highest
var colors = ["░", "▒", "▓"];
//var colors = ["░", "▒", "▓"]; //default values

//Outputting art
var outputDiv = document.getElementById("outputDiv");
var outputImage;
var i;
var j;
var grayScale;
var divider;
var brLine;

//Load file from file
function loadFile(event)
{   
    file.src = URL.createObjectURL(event.target.files[0]);  
}

//Load image from URL
function loadURL()
{
    file = new Image();   
    file.src = document.getElementById("URLInput").value;
}

//Process Image
file.onload = function() 
{
    //Get width and height from uploaded image
    width = file.width;
    height = file.height; 
    
    //Preview image
    filePreview.style.display = "initial";
    filePreview.src = file.src; 

    isFileLoaded = true;
};  


//Put image into canvas and generate art
function GenerateArt()
{
    if(isFileLoaded)
    {
        //Get Scale
        scaleX = document.getElementById("scaleX").value;
        scaleY = document.getElementById("scaleY").value;

        if(scaleX != 0 && scaleY != 0)
        {
            //Resize canvas to fit image
            canvas.width = width * scaleX; 
            canvas.height = height * scaleY; 

            //Put image into canvas
            ctx = canvas.getContext("2d");
            ctx.drawImage(file, 0, 0, Math.round(width * scaleX), Math.round(height * scaleY));

            //Get scaled image data
            imgData = ctx.getImageData(0, 0, Math.round(width * scaleX), Math.round(height * scaleY));
        
            outputImage = ""; //clear art
            divider = Math.round(255 / colors.length); //divide color to segment
            brLine = 1; //first X line

            //Make scaled width dividable by 2
            nextLineFix = Math.round(width * scaleX) % 2 != 0 ? 1 : 0; //1 if true, 0 if false

            //Generate Image
            for(i=0; i<imgData.data.length; i+=4)
            {
                //Recommended grayscale conversion equation 
                grayScale = ((0.299 * imgData.data[i]) + (0.587 * imgData.data[i+1]) + (0.114 * imgData.data[i+2]));
                //grayScale = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / 3; //alt grayscale equation

                //Generate pixel
                for(j=0; j<colors.length; j++)
                {
                    if(grayScale >= (divider * j) && grayScale <= (divider * (j+1))) //find which art fits this pixels color segment
                    {
                        outputImage += colors[j];
                    }
                }

                //Move to the next line
                if((Math.round(width * scaleX) * brLine + nextLineFix) / (i / 4) == 1) 
                {
                    outputImage += "<br />";
                    brLine++;
                }
            }

            //Print art
            outputDiv.innerHTML = outputImage;

            //Show copy button
            document.getElementById("copyButton").style.display = "initial";

            //Put info into info paragraph
            resolutionInfo.innerHTML = "Resolution: <b>" + Math.round(width * scaleX) + "</b> x <b>" + Math.round(height * scaleY) + "</b>,<br />Characters: <b>" + (Math.round(width * scaleX) * Math.round(height * scaleY)) + "</b>.";
            document.getElementById("infoBox").style.display = "initial";
        }
        else
        {
            //If scale is 0
            alert("Scale can't equal 0");
        }
    }
    else
    {
        //If file isn't uploaded alert the user
        alert("You have to upload image first");
    }
}

//Save to clipboard
function CopyArt()
{
    const selected =            
        document.getSelection().rangeCount > 0  // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0) // Store selection if found
        : false;    // Mark as false to know no selection existed before

    var range = document.createRange();
    range.selectNode(outputDiv);
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();// to deselect

    if (selected)   // If a selection existed before copying
    {                                 
        document.getSelection().removeAllRanges();  // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
    }

    alert("Saved to clipboard"); //Alert
}