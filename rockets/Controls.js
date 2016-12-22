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
}
