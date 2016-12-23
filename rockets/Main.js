
function Main() {
    this.canvas;
    this.context;
    this.loopId;

    this.rockets = [];
    this.obstacles;
    this.target;
    this.runCount;
    this.runMax;
    this.pool;
    this.round;
    this.isRunning = false;
    this.obstacleSet = 0;

    this.fitnessGrading;
    this.physics = new PhysicsPayload();

    this.Setup = function () {
        this.target = { pos: new Vector2D((this.canvas.width / 2) - 25, 25), width: 25, height: 25 };
        this.fitnessGrading = new FitnessGrading(this.target.pos, 1, 3, 5);
        this.obstacles = [];
        if(this.obstacleSet == 0)
        {
        this.obstacles.push({ pos: new Vector2D((this.canvas.width / 2) - 150, (this.canvas.height / 2) - 10), width: 300, height: 20 });
        }
        if(this.obstacleSet == 1)
        {
            this.obstacles.push({ pos: new Vector2D(0, (this.canvas.height * 0.25) - 10), width: this.canvas.width * 0.75, height: 20 });
            this.obstacles.push({ pos: new Vector2D(this.canvas.width * 0.25, (this.canvas.height* 0.6) - 10), width: this.canvas.width * 0.75, height: 20 });
        }
        if(this.obstacleSet == 2)
        {
            this.obstacles.push({ 
                pos: new Vector2D(Math.random() * this.canvas.width, Math.random() * this.canvas.height * 0.6), 
                width: (Math.random() * this.canvas.width * 0.5) + 40, 
                height: (Math.random() * this.canvas.height * 0.25) + 30 });
            this.obstacles.push({ 
                pos: new Vector2D(Math.random() * this.canvas.width, Math.random() * this.canvas.height * 0.6), 
                width: (Math.random() * this.canvas.width * 0.5) + 40, 
                height: (Math.random() * this.canvas.height * 0.25) + 30 });
        }
        if(this.obstacleSet == 3)
        {
            // No obstacles
        }
        this.runCount = 0;
        this.runMax = 300;

        this.rockets = [];
        for(var i = 0; i < 150; i++)
        {
            this.rockets.push(new Rocket(this.physics, new Vector2D(this.canvas.width / 2, this.canvas.height), null, this.fitnessGrading));
        }

        this.pool = new Pool();
        
        this.round = 1;
    }

    this.Update = function () {

        var breakRound = true;
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.fillStyle = '#FFF';
        this.context.fillText("Generation [" + this.round + "]", this.canvas.width - 100, 10);
        this.context.fillText(this.runCount, this.canvas.width - 100, 20);

        if (this.runCount++ >= this.runMax)
        {
            this.runCount = 0;
            this.rockets = this.pool.BreedCandidates(this.physics, new Vector2D(this.canvas.width / 2, this.canvas.height), this.target.pos, this.rockets, this.fitnessGrading);
            this.round++;
        }

        this.context.strokeStyle = '#FFF';
        this.context.strokeRect(this.target.pos.x, this.target.pos.y, this.target.width, this.target.height);

        for (var i = 0; i < this.obstacles.length; i++)
        {
            this.context.strokeStyle = '#FFF';
            this.context.strokeRect(this.obstacles[i].pos.x, this.obstacles[i].pos.y, this.obstacles[i].width, this.obstacles[i].height);
        }
        

        for (var i = 0; i < this.rockets.length; i++) {
            this.rockets[i].Update(this.target, this.obstacles);
            this.rockets[i].Draw(this.context);

            if (this.rockets[i].alive)
            {
                breakRound = false;
            }
        }
        if(breakRound)
        {
            this.runCount = this.runMax;
        }
    }

    this.InitCanvas = function () {
        this.canvas = document.getElementById('mainCanvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.backgroundColor = '#000';

        this.context = this.canvas.getContext("2d");
    }

    this.Run = function()
    {
        this.InitCanvas();
        this.Setup();
        this.RunToggle();
    }
    this.RunToggle = function()
    {
        if(this.isRunning)
        {
            clearInterval(this.loopId);
            this.isRunning = false;
        }
        else
        {
            this.loopId = setInterval(this.Update.bind(this), 1000 / 60);
            this.isRunning = true;
        }
    }
}
