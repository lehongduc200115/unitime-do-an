import { Entity, GeneticAlgorithm, randInt } from "./GeneticAlgorithm"


/**
 * Genetic Algorithm result: 1, 2, 3, 4, 5, 6, 7...
 * Each number in gene represents: Free time slot
 * Each gene (slot) represents: Class
 */

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


const fitness = (entity: Entity) => {
    const res = '0917450102';
    let score = 0;
    entity.chromosome.forEach((value: number, index: number) => {
        score = score + (value == parseInt(res[index]) ? 1 : 0);
    });
    return score;
}


const dump = (population: Entity[]) => {
    for (let i = 0; i < 20; ++i) {
        console.log(...population[i].chromosome.map((x: number) => {
            return x.toString();
        }), '+', population[i].fitness);
    }
}


// Test
let engine = new GeneticAlgorithm()
engine.configurate({
    chromosomeLength: 10,
    geneCount: 10,
    generation: 10000,
    mutationRate: 0.01,
    populationSize: 100,
    selection: selection,
    fitness: fitness,
    dump: dump,
    eliteRate: 0.2,
})
engine.run()