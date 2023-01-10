"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GeneticAlgorithm_1 = require("./GeneticAlgorithm");
/**
 * Genetic Algorithm result: 1, 2, 3, 4, 5, 6, 7...
 * Each number in gene represents: Free time slot
 * Each gene (slot) represents: Class
 */
const delay = ms => new Promise((resolve) => setTimeout(resolve, ms));
const fitness = (entity) => {
    const res = '0917450102';
    let score = 0;
    entity.chromosome.forEach((value, index) => {
        score = score + (value == parseInt(res[index]) ? 1 : 0);
    });
    return score;
};
const selection = (population) => {
    const crossoverRate = 0.5;
    let parentPoolSize = Math.floor(population.length * crossoverRate);
    let temp = [...population].sort((a, b) => {
        return b.fitness - a.fitness; // Descending fitness score
    });
    let result = [];
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
};
const crossover = (first, second) => {
    let firstChild;
    let secondChild;
    const firstPoint = (0, GeneticAlgorithm_1.randInt)(1, first.length - 1);
    const secondPoint = (0, GeneticAlgorithm_1.randInt)(firstPoint, first.length);
    firstChild = first.chromosome.slice(0, firstPoint);
    secondChild = second.chromosome.slice(0, firstPoint);
    firstChild.push(...second.chromosome.slice(firstPoint, secondPoint));
    secondChild.push(...first.chromosome.slice(firstPoint, secondPoint));
    firstChild.push(...first.chromosome.slice(secondPoint));
    secondChild.push(...second.chromosome.slice(secondPoint));
    firstChild = new GeneticAlgorithm_1.Entity(first.length, first.geneCount, firstChild);
    secondChild = new GeneticAlgorithm_1.Entity(first.length, first.geneCount, secondChild);
    return [firstChild, secondChild];
};
// Test
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let engine = new GeneticAlgorithm_1.GeneticAlgorithm();
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
    });
    let res = engine.run();
    const mId = 5;
    for (let id = mId - 1; id > 0; --id) {
        engine.configurate({
            initialPopulation: res,
            // generation: 1000,
            mutationRate: (mId - id) / 100,
            crossover: (id < mId / 2) ? crossover : undefined,
            eliteRate: (mId - id) / 10
        });
        res = engine.run();
    }
    for (let i = 0; i < 10; ++i) {
        console.log(...res[i].chromosome.map((x) => {
            return x.toString();
        }), '+', res[i].fitness);
    }
});
main();
