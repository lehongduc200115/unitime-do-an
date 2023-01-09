"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var GeneticAlgorithm_1 = require("./GeneticAlgorithm");
/**
 * Genetic Algorithm result: 1, 2, 3, 4, 5, 6, 7...
 * Each number in gene represents: Free time slot
 * Each gene (slot) represents: Class
 */
var selection = function (population) {
    var crossoverRate = 0.5;
    var parentPoolSize = Math.floor(population.length * crossoverRate);
    var temp = __spreadArray([], population, true).sort(function (a, b) {
        return b.fitness - a.fitness; // Descending fitness score
    });
    var result = [];
    // K-way tournament
    // Calculate sample space
    var maxProb = population[0].fitness + 1;
    maxProb = maxProb * (maxProb + 1) / 2;
    // Pick up entities until enough size reached
    var i = 0;
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
var fitness = function (entity) {
    var res = '0917450102';
    var score = 0;
    entity.chromosome.forEach(function (value, index) {
        score = score + (value == parseInt(res[index]) ? 1 : 0);
    });
    return score;
};
var dump = function (population) {
    for (var i = 0; i < 20; ++i) {
        console.log.apply(console, __spreadArray(__spreadArray([], population[i].chromosome.map(function (x) {
            return x.toString();
        }), false), ['+', population[i].fitness], false));
    }
};
// Test
var engine = new GeneticAlgorithm_1.GeneticAlgorithm();
engine.configurate({
    chromosomeLength: 10,
    geneCount: 10,
    generation: 10000,
    mutationRate: 0.01,
    populationSize: 100,
    selection: selection,
    fitness: fitness,
    dump: dump,
    eliteRate: 0.2
});
engine.run();
