import { Entity, GeneticAlgorithm, randInt } from "./GeneticAlgorithm"


/**
 * Genetic Algorithm result: 1, 2, 3, 4, 5, 6, 7...
 * Each number in gene represents: Free time slot
 * Each gene (slot) represents: Class
 */

const delay = ms => new Promise((resolve) => setTimeout(resolve, ms));


const fitness = (entity: Entity) => {
    const res = '0917450102';
    let score = 0;
    entity.chromosome.forEach((value: number, index: number) => {
        score = score + (value == parseInt(res[index]) ? 1 : 0);
    });
    return score;
}


const selection = (population: Entity[]) => {
    const crossoverRate = 0.5;
    let parentPoolSize = Math.floor(population.length * crossoverRate);
    let temp = [...population].sort((a: Entity, b: Entity) => {
        return b.fitness - a.fitness // Descending fitness score
    });
    let result: Entity[] = [];
    // K-way tournament
    // Calculate sample space
    let maxProb = population[0].fitness + 1;
    maxProb = maxProb * (maxProb + 1) / 2;
    // Pick up entities until enough size reached
    let i = 0;
    while (parentPoolSize) {
        if (Math.random() < (temp[i].fitness + 1) / maxProb) { // The division represents chance to be picked up
            result.push(temp[i]);
            parentPoolSize--;
            temp.splice(i, 1); // Remove picked entity from list
        }
        i = (i + 1) % temp.length;
    }
    return result;
}


const crossover = (first: Entity, second: Entity) => {
    let firstChild: any;
    let secondChild: any;
    const firstPoint = randInt(1, first.length - 1);
    const secondPoint = randInt(firstPoint, first.length);

    firstChild = first.chromosome.slice(0, firstPoint);
    secondChild = second.chromosome.slice(0, firstPoint);

    firstChild.push(...second.chromosome.slice(firstPoint, secondPoint));
    secondChild.push(...first.chromosome.slice(firstPoint, secondPoint));

    firstChild.push(...first.chromosome.slice(secondPoint));
    secondChild.push(...second.chromosome.slice(secondPoint));

    firstChild = new Entity(first.length, first.geneCount, firstChild);
    secondChild = new Entity(first.length, first.geneCount, secondChild);

    return [firstChild, secondChild];
}


// Test
const main = async () => {
    let engine = new GeneticAlgorithm();
    engine.configurate({
        chromosomeLength: 10,
        geneCount: 10,
        generation: 1000,
        mutationRate: 0.01,
        maxPopulationSize: 500,
        // selection: selection,
        crossover: crossover,
        fitness: fitness,
        eliteRate: 0.1,
    })
    
    let res = engine.run();
    // const mId = 5
    // for (let id = mId-1; id > 0; --id) {
    //     engine.configurate({
    //         initialPopulation: res,
    //         // generation: 1000,
    //         mutationRate: (mId - id) / 100,
    //         crossover: (id < mId / 2) ? crossover : undefined,
    //         eliteRate: (mId - id) / 10
    //     })
        
    //     res = engine.run();
    // }
    
    for (let i = 0; i < 10; ++i) {
        console.log(...res[i].chromosome.map((x: number) => {
            return x.toString();
        }), '+', res[i].fitness);
    }
};

main()