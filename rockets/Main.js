
function Main() {
    this.canvas;
    this.context;

    this.rockets = [];
    this.obstacles;
    this.target;
    this.runCount;
    this.runMax;
    this.pool;
    this.round;

    this.fitnessGrading;

    this.Setup = function () {
        this.target = { pos: new Vector2D((this.canvas.width / 2) - 25, 25), width: 25, height: 25 };
        this.fitnessGrading = new FitnessGrading(this.target.pos, 2, 3, 5);
        this.obstacles = [];
        //this.obstacles.push({ pos: new Vector2D((this.canvas.width / 2) - 150, (this.canvas.height / 2) - 10), width: 300, height: 20 });
        this.obstacles.push({ pos: new Vector2D(0, (this.canvas.height * 0.25) - 10), width: this.canvas.width * 0.75, height: 20 });
        this.obstacles.push({ pos: new Vector2D(this.canvas.width * 0.25, (this.canvas.height* 0.6) - 10), width: this.canvas.width * 0.75, height: 20 });
        this.runCount = 0;
        this.runMax = 300;

        this.rockets = [];
        for(var i = 0; i < 150; i++)
        {
            this.rockets.push(new Rocket(new Vector2D(this.canvas.width / 2, this.canvas.height), null, this.fitnessGrading));
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
            this.rockets = this.pool.BreedCandidates(new Vector2D(this.canvas.width / 2, this.canvas.height), this.target.pos, this.rockets, this.fitnessGrading);
            this.round++;
            /*
            this.rockets = [];
            for (var i = 0; i < 50; i++) {
                this.rockets.push(new Rocket(new Vector2D(this.canvas.width / 2, this.canvas.height)));
            }
            */
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
        this.canvas = document.createElement('canvas');
        this.canvas.id = "mainCanvas";
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.canvas.style.backgroundColor = '#000';
        document.body.appendChild(this.canvas);

        this.context = this.canvas.getContext("2d");
    }

    this.InitCanvas();
    this.Setup();
    setInterval(this.Update.bind(this), 1000 / 60);
}

//var main = new Main();