function loadFile(event)
{   
    //Import uploaded file
    var file = new Image();   
    file.src = URL.createObjectURL(event.target.files[0]);
    file.crossOrigin = "Anonymous";

    //Get scale
    var scaleX = document.getElementById("scaleX").value;
    var scaleY = document.getElementById("scaleY").value;

    file.onload = function() 
    {
        //Get width and height from uploaded image
        var width = file.width;
        var height = file.height;

        //Prepare canvas
        var canvas = document.getElementById("canvas");

        canvas.setAttribute("width", width); 
        canvas.setAttribute("height", height); 

        var ctx = canvas.getContext("2d");
        ctx.drawImage(file, 0, 0);
        var imgData = ctx.getImageData(0, 0, width, height);

        var outputImage = "";
        var i = 0;
        var grayScale = 0; //convert pixels to grayscale
        var divider = 255 / 3; //divide color to segment
        var brLine = 1;

        //Debug values
        var lowest = 0;
        var middle = 0;
        var highest = 0;

        //Generate pixels
        for(i=0; i<imgData.data.length; i+=4)
        {
            grayScale = ((0.299 * imgData.data[i]) + (0.587 * imgData.data[i+1]) + (0.114 * imgData.data[i+2]));

            if(grayScale < divider) //lowest
            {
                outputImage += "░";
                lowest++;
            }
            else if(grayScale > (divider * 2)) //highest
            {
                outputImage += "▓";
                highest++;
            }
            else //middle
            {
                outputImage += "▒";
                middle++;
            }

            if((width * brLine) / i * 4 == 1) //move to the next line
            {
                outputImage += "<br />";
                brLine++;
            }
        }

        document.getElementById("outputDiv").innerHTML = outputImage; //output

        console.log("lowest - " + lowest + ", middle - " + middle + ", highest - " + highest + ", brLines - " + brLine); //Debug
    };
}
//▓ ▒ ░ 