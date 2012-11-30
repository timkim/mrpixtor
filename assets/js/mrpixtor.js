function MrPixtor(){    
    this.masterCanvas = null;
    this.masterCtx = null;

    this.init = (function(context){
        if(!context.masterCanvas){
            context.masterCanvas = document.createElement("canvas");
            document.body.appendChild(context.masterCanvas);
            context.masterCanvas.setAttribute("style","display:none");
            context.masterCtx = context.masterCanvas.getContext('2d'); 
        }
    }(this));
    
    // get the image data from the master canvas
    this.getImageData = function(img){
        if(this.masterCanvas && this.masterCtx && img){
            this.resetCanvas();
            this.masterCanvas.width = img.width;
            this.masterCanvas.height = img.height;
            this.masterCtx.drawImage(img,0,0,this.masterCanvas.width, this.masterCanvas.height);
            return this.masterCtx.getImageData(0,0,this.masterCanvas.width, this.masterCanvas.height);   
        }
    };
    
    // reset the canvas for future manipulations
    this.resetCanvas = function(){
        if(this.masterCanvas && this.masterCtx){
            // from: http://stackoverflow.com/questions/2142535/how-to-clear-the-canvas-for-redrawing
            // Store the current transformation matrix
            this.masterCtx.save();
            
            // Use the identity matrix while clearing the canvas
            this.masterCtx.setTransform(1, 0, 0, 1, 0, 0);
            this.masterCtx.clearRect(0, 0, this.masterCanvas.width, this.masterCanvas.height);
            
            // Restore the transform
            this.masterCtx.restore(); 
        }
    };
    
    // output the image data to an existing img tag
    this.outputImageData = function(imageData, imgContainer){
        if(this.masterCanvas && this.masterCtx && imgContainer){
            this.resetCanvas();   
            this.masterCanvas.width = imageData.width;
            this.masterCanvas.height = imageData.height;
            this.masterCtx.putImageData(imageData, 0, 0);
            var url = this.masterCanvas.toDataURL();
            imgContainer.src = url;
        }
    };

    this.boundResult = function(pixelValue){
        if(pixelValue < 0){
            pixelValue = 0;
        }else if(pixelValue >255){
            pixelValue = 255;
        }
        return pixelValue;
    }
    
    this.generateSVG = function(img, out){
        var imgData = this.getImageData(img);
        var imgJSON = this.buildRaphaelJSON(imgData);
        var paper = Raphael(out,imgData.width, imgData.height);
        paper.add(imgJSON);
    };
        
    // proof of concept method - basically make squares for every pixel
    this.buildRaphaelJSON = function(imgData){
        var width = imgData.width, height = imgData.height;
        var imgJSON = [];
        var currentIndex = 0;
        var r, g, b;
        
        for(var i=0;i<width;i++){
            for(var j=0;j<height;j++){
                currentIndex = (i+j*width)*4; 
                r = imgData.data[currentIndex];
                g = imgData.data[currentIndex+1];
                b = imgData.data[currentIndex+2]
                imgJSON.push(this.rectTemplate(i,j,Raphael.rgb(r, g, b)));
            }
        } 
        return imgJSON;
    };
    
    this.rectTemplate = function(x,y,fill){
        return {
            type: "rect",
            x: x,
            y: y,
            width: 1,
            height: 1,
            fill: fill,
            stroke: 0
        }
    };
}