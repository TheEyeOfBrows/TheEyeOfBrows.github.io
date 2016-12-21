function Pool() {
    this.mutationRate = 0.007;

    this.MaxFitness = function (targetPos, candidatesArray)
    {
        //if (!candidatesArray) candidatesArray = [];

        var theMax = 0;
        for(var i = 0; i < candidatesArray.length; i++)
        {
            theMax = Math.max(theMax, candidatesArray[i].GetFitness(targetPos));
        }
        return theMax;
    }

    this.BreedCandidates = function(initPos, targetPos, candidatesArray, grading)
    {
        var maxFitness = this.MaxFitness(targetPos, candidatesArray);
        var newPool = [];

        for (var i = 0; i < candidatesArray.length; i++)
        {
            var selection1 = this.RejectSelect(maxFitness, targetPos, candidatesArray);
            var selection2 = this.RejectSelect(maxFitness, targetPos, candidatesArray);
            var newDna = new DNA();
            var seqLength = Math.max(selection1.dna.sequence.length, selection2.dna.sequence.length);
            var segment = Math.floor(Math.random() * seqLength);
            for (var step = 0; step < seqLength ; step++)
            {
                if(Math.random() < this.mutationRate)
                {
                    newDna.sequence.push(Math.random());
                }
                else
                {
                    if (step < selection1.dna.sequence.length && step < selection2.dna.sequence.length) {
                        if (step < segment) {
                            newDna.sequence.push(selection1.dna.sequence[step]);
                        }
                        else {
                            newDna.sequence.push(selection2.dna.sequence[step]);
                        }
                    }
                    else if(step < selection1.dna.sequence.length)
                    {
                        newDna.sequence.push(selection1.dna.sequence[step]);
                    }
                    else if (step < selection2.dna.sequence.length)
                    {
                        newDna.sequence.push(selection2.dna.sequence[step]);
                    }
                }
            }
            var newRocket = new Rocket(initPos, newDna, grading);
            newRocket.id = "ROCKET " + i;
            newPool.push(newRocket);
        }
        return newPool;
    }
    this.RejectSelect = function (maxFitness, targetPos, candidatesArray)
    {
        var selectedIndex = 0;
        for(var i = 0; i < 100; i++)
        {
            selectedIndex = Math.floor(Math.random() * candidatesArray.length);
            if (Math.random() * maxFitness < candidatesArray[selectedIndex].GetFitness(targetPos))
            {
                return candidatesArray[selectedIndex];
            }
        }
        return candidatesArray[selectedIndex];
    }
}