function ObsticleDrawer(main)
{
    this.main = main;
    this.startX = -1;
    this.startY = -1;
    this.mouseX = -1;
    this.mouseY = -1;

    this.OnMouseDown = function(event)
    {
        if(this.startX < 0 && this.startY < 0)
        {
            var rect = this.main.canvas.getBoundingClientRect();
            this.startX = event.clientX - rect.left;
            this.startY = event.clientY - rect.top;
        }
    }
    this.OnMouseUp = function(event)
    {
        if(this.main.obstacles)
        {
            var rect = this.main.canvas.getBoundingClientRect();

            var left = Math.min(this.startX, event.clientX - rect.left);
            var top = Math.min(this.startY, event.clientY - rect.top);
            var right= Math.max(this.startX, event.clientX - rect.left);
            var bottom = Math.max(this.startY, event.clientY - rect.top);
            if(Math.abs(right - left) >= 5 && Math.abs(bottom - top) >= 5)
            {
                this.main.obstacles.push({
                    pos: new Vector2D(left, top),
                    width: right - left,
                    height: bottom - top
                });
            }
        }
        this.startX = -1;
        this.startY = -1;
    }
    this.Update = function()
    {

    }
    this.Draw = function()
    {
        this.main.context.save();
        this.main.context.setTransform(1, 0, 0, 1, 0, 0);
        if(this.startX >= 0 && this.startY >= 0)
        {
            var rect = this.main.canvas.getBoundingClientRect();
            this.main.context.strokeStyle = '#5F5';
            this.main.context.strokeRect(this.startX, this.startY, this.mouseX - this.startX, this.mouseY - this.startY);
        }
        this.main.context.restore();
    }

    main.canvas.addEventListener('mousedown', this.OnMouseDown.bind(this));
    main.canvas.addEventListener('mouseup', this.OnMouseUp.bind(this));
    main.canvas.addEventListener('mousemove',function(){
        var rect = this.main.canvas.getBoundingClientRect();
        this.mouseX = event.clientX - rect.left;
        this.mouseY = event.clientY - rect.top;
        if(!this.main.isRunning)
        {
            this.main.Draw();
        }
    }.bind(this));
}
