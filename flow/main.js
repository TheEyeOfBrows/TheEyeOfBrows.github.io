window.onload = function(e)
{
    var theCanvas = document.createElement('canvas');
    theCanvas.width = 500;
    theCanvas.height = 400;
    document.body.appendChild(theCanvas);
    setup(theCanvas);
};

var animationId;
var canvas;
var ctx;

var flowField;

function setup(aCanvas)
{
    canvas = aCanvas;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    flowField = {field:[], width:25, height:20};
    for(var y = 0; y < flowField.height; y++){
        for(var x=0; x < flowField.width; x++){
            flowField.field[x + y*flowField.width] = Math.random();
        }
    }

    mainLoop();
}
function mainLoop()
{
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(0.5, 0.5);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#EEEE33"
    ctx.strokeRect(0,0,canvas.width-1,canvas.height-1);

    drawField(flowField);
    animationId = requestAnimationFrame(mainLoop);
}
function drawField(flow)
{
    if(!flow.render)
    {
        var xScale = 20;
        var yScale = 20;

        var xHalf = xScale/2;
        var xQuart = xScale/4;
        var yHalf = yScale/2;
        var yThird = yScale/3;

        for(var i=0; i < flow.field.length; i++)
        {
            var x = i % flow.width;
            var y = Math.floor(i / flow.width);

            ctx.save();
            ctx.translate(x*xScale + xHalf, y*yScale + yHalf);
            ctx.strokeStyle = "#005";
            ctx.strokeRect(-xHalf + 2, -yHalf + 2, xScale - 4, yScale - 4);
            ctx.rotate( Math.PI * 2 * flow.field[i]);
            ctx.moveTo(0, -yHalf + 4);
            ctx.lineTo(0, yHalf - 4);
            ctx.lineTo(-xQuart, yHalf - yThird);
            ctx.moveTo(0, yHalf - 4);
            ctx.lineTo(xQuart, yHalf - yThird);
            ctx.stroke();

            ctx.restore();
        }
        flow.render = ctx.getImageData(0, 0, flow.width * xScale, flow.height * yScale);
    } else {
        ctx.putImageData(flow.render,0,0);
    }

}
