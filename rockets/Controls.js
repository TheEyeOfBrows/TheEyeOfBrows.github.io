function Rockets_SetFitness_AliveTimeScale(source)
{
	main.fitnessGrading.aliveTimeScale = parseInt(source.value);
}
function Rockets_SetFitness_DistanceScale(source)
{
	main.fitnessGrading.distanceScale = parseInt(source.value);
}
function Rockets_SetFitness_HitTargetScale(source)
{
	main.fitnessGrading.hitTargetScale = parseInt(source.value);
}

function Rockets_SetGravity(source)
{
	main.physics.gravity = parseFloat(source.value);
}
function Rockets_SetThrust(source)
{
	main.physics.thrust = parseFloat(source.value);
}
function Rockets_SetHandling(source)
{
	main.physics.handling =parseFloat(source.value);
}
function Rockets_ResetPhysics(source)
{
	var el = document.getElementById('gravity');
	el.value = 1.1;
	Rockets_SetGravity(el);

	el = document.getElementById('thrust');
	el.value = 2.5;
	Rockets_SetThrust(el);

	el = document.getElementById('handling');
	el.value = 0.14;
	Rockets_SetHandling(el);
}

function Rockets_SetMaze(source)
{
	main.obstacleSet = parseInt(source.value);
	Rockets_Reset();
}
function Rockets_Pause()
{
	main.RunToggle();
}
function Rockets_Reset()
{
	var fitness = main.fitnessGrading;
	main.Setup();
	main.fitnessGrading = fitness;
	main.Update();
}
function Rockets_SkipGenerations()
{
	main.SkipGenerations(30);
}
