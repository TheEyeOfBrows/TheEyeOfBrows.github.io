function Rocket(physics, pos, dna, grading)
{
    this.pos = pos ? new Vector2D(pos.x, pos.y) : new Vector2D();
    this.vector = new Vector2D();
    this.size = 10;
    this.heading = Math.PI * 1.5;
    this.alive = true;
    this.aliveTime = 0;
    this.hitTarget = false;
    this.physics = physics

    this.posHistory = [];
    this.grading = grading ? grading : new FitnessGrading();


    this.dna = dna ? new DNA(dna.sequence) : new DNA();

    this.Draw = function(ctx)
    {
        // Draw tail
        var increment = 4;
        if (this.posHistory.length > 0) {
            ctx.beginPath();
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            ctx.strokeStyle = "rgba(255,255,0,1)";
            ctx.moveTo(this.pos.x, this.pos.y);
            ctx.lineTo(this.posHistory[this.posHistory.length - 1].x, this.posHistory[this.posHistory.length - 1].y);
            ctx.stroke();

            for(var i = this.posHistory.length - 1; i >=increment; i -= increment)
            {
                ctx.beginPath();
                var alpha = Math.floor(mapRange(i, 0, this.posHistory.length, 0, 100)) / 100;
                ctx.strokeStyle = "rgba(255,255,0," + alpha + ")";
                ctx.moveTo(this.posHistory[i].x, this.posHistory[i].y)
                ctx.lineTo(this.posHistory[i - increment].x, this.posHistory[i - increment].y);
                ctx.stroke();
            }
        }

        // Draw rocket
        ctx.setTransform(1, 0, 0, 1, this.pos.x, this.pos.y);
        ctx.rotate(this.heading);
        ctx.beginPath();

        ctx.strokeStyle = this.hitTarget ? '#0F0' : this.alive ? '#FFF' : '#F00';

        ctx.moveTo(this.size / 2, 0);
        ctx.lineTo(-this.size / 2, this.size / 4);
        ctx.lineTo(-this.size / 2, -this.size / 4);
        ctx.closePath();
        ctx.stroke();


    }

    this.Update = function(target, collisionRects)
    {
        if (!this.hitTarget) this.posHistory.push(new Vector2D(this.pos.x, this.pos.y));
        if (!this.hitTarget && this.posHistory.length > 30) this.posHistory.shift();

        if (!this.alive) return;
        if (!collisionRects) collisionRects = [];

        this.heading += mapRange(this.dna.next(), 0, 1, -this.physics.handling, this.physics.handling);
        this.vector.addForce(this.physics.thrust, this.heading);
        this.vector.add(new Vector2D(0, this.physics.gravity));
        this.vector.x *= 0.9;
        this.vector.y *= 0.9;
        this.pos.add(this.vector);

        if (this.pos.y > 600 || this.pos.y < 0 || this.pos.x > 800 || this.pos.x < 0)
        {
            this.alive = false;
        }


        for(var i = 0; i < collisionRects.length && this.alive; i++)
        {
            if(this.pos.x > collisionRects[i].pos.x &&
                this.pos.x < collisionRects[i].pos.x + collisionRects[i].width &&
                this.pos.y > collisionRects[i].pos.y &&
                this.pos.y < collisionRects[i].pos.y + collisionRects[i].height)
            {
                this.alive = false;
                break;
            }
        }

        if(this.pos.x > target.pos.x &&
                this.pos.x < target.pos.x + target.width &&
                this.pos.y > target.pos.y &&
                this.pos.y < target.pos.y + target.height)
        {
            this.alive = false;
            this.hitTarget = true;
        }

        this.aliveTime++;
    }

    this.GetFitness = function(targetPos)
    {
        var fitness = this.hitTarget ? this.grading.hitTargetScale: 0;

        if (this.hitTarget && this.grading.hitTargetScale > 0)
        {
            fitness += mapRange(this.aliveTime, 0, 300, this.grading.aliveTimeScale, 0);
        }
        else
        {
            fitness += mapRange(this.aliveTime, 0, 300, 0, this.grading.aliveTimeScale);
        }

        fitness += mapRange(this.pos.distance(this.grading.targetPos), 0, 600, this.grading.distanceScale, 0);

        fitness = fitness * 10;

        return Math.max(fitness, Math.pow(fitness, 4), 0.001);
    }
}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function Vector2D(x, y)
{
    this.x = x ? x : 0;
    this.y = y ? y : 0;

    this.add = function(vector)
    {
        this.x += vector.x;
        this.y += vector.y;
    }
    this.addForce = function(distance, angle)
    {
        this.x += Math.cos(angle) * distance;
        this.y += Math.sin(angle) * distance;
    }
    this.distance = function(position)
    {
        return Math.sqrt( Math.pow(this.x - position.x, 2 ) + Math.pow(this.y - position.y, 2 ));
    }
}

function DNA(sequence)
{
    this.index = 0;
    this.sequence = sequence ? sequence : [];
    this.next = function()
    {
        this.index = this.index % 200;
        while (this.sequence.length <= this.index)
        {
            this.sequence.push(Math.random());
        }
        return this.sequence[this.index++];
    }
}

function FitnessGrading(targetPos, distanceScale, aliveTimeScale,hitTargetScale)
{
    this.targetPos = targetPos ? targetPos : new Vector2D();
    this.distanceScale = distanceScale ? distanceScale : 1;
    this.aliveTimeScale = aliveTimeScale ? aliveTimeScale : 1;
    this.hitTargetScale = hitTargetScale ? hitTargetScale : 1;
}

function PhysicsPayload(gravity, thrust, handling)
{
    this.gravity = gravity ? gravity : 1.1;
    this.thrust = thrust ? thrust : 2.5;
    this.handling = handling ? handling : 0.14;
}
