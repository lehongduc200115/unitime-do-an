"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GeneticAlgorithm_1 = require("./GeneticAlgorithm");
/**
 * Genetic Algorithm chromosome result: 0, 1, 2, 3, 4, 5, 6, 7...
 * Each number in gene represents: Free room slot + Lecturer * (coefficient: total room slot)
 * Each gene (slot) represents: Class
 * - If there is 2 room slot conflicted in the final result, count as suggestion (one will not be in final schedule, manual adjustment is needed)
 */
const delay = ms => new Promise((resolve) => setTimeout(resolve, ms));
const fitness = (entity) => {
    const res = '0911360460';
    let score = 0;
    entity.chromosome.forEach((value, index) => {
        score = score + (value == parseInt(res[index]) ? 1 : 0);
    });
    return score;
};
const selection = (population) => {
    const crossoverRate = 0.2;
    let parentPoolSize = Math.floor(population.length * crossoverRate);
    let temp = [...population].sort((a, b) => {
        return b.fitness - a.fitness; // Descending fitness score
    });
    let result = [];
    // K-way tournament
    // Calculate sample space
    let maxProb = 0;
    population.forEach((entity) => {
        maxProb += entity.fitness + 1; // Padding 1 unit since there is 0 score.
    });
    // Pick up entities until enough size reached
    let i = 0;
    while (parentPoolSize) {
        const chance = Math.random();
        console.log("Chance:", chance);
        if (chance < (temp[i].fitness + 1) / maxProb) { // The division represents chance to be picked up
            result.push(temp[i]);
            parentPoolSize--;
            temp.splice(i, 1); // Remove picked entity from list
            i = i % temp.length;
            continue;
        }
        i = (i + 1) % temp.length;
    }
    console.log(result);
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
    console.log("Children:", [firstChild, secondChild]);
    return [firstChild, secondChild];
};
/**
 * List phòng: [0, 1, 2, 3, 4, 5, 6, 7, 8]
 * List môn học: [0, 1, 2, 3, ...]
 * List lớp: [0, 1, 2, 3, 4, 5...] => thời khóa biểu gốc
 * {
        id: 0,
        name: 'L01',
        subject: 'Physic 1',
        weekday: 'Monday',
        period: [12, 14], // 12h to 14h
        room: 'H1-101',
        lecturer: 'N.V.An',
     }
 * List môn học cần thêm mới: [0, 1, 2, 3, 4]
     50 sv => ? lớp
 */
// Stage 1
/**
 * List chỗ trống: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ....] => length2
 * List lớp cần thêm mới: [0, 1, 2, 3, 4, 5, 6]
 * List giảng viên dạy cho từng lớp: [[0, 1, 2], [0, 1], [0, 1, 2, 3], ....] => maxLength
 * List giảng viên [0, 1, 2, 3, 4...]
 * {
 *   List môn giảng viên dạy được: [0, 1, 3, 6]
 * }
 * length2 * maxLength
 */
// Test
const main = async () => {
    let engine = new GeneticAlgorithm_1.GeneticAlgorithm();
    engine.configurate({
        chromosomeLength: 21,
        geneCount: 21,
        generation: 10000,
        mutationRate: 0.01,
        maxPopulationSize: 50,
        // selection: selection,
        // crossover: crossover,
        fitness: fitness,
        eliteRate: 0.1,
        // initialPopulation: [
        //     new Entity(10, 10, [0, 9, 1, 7, 4, 5, 0, 1, 4, 2]),
        //     new Entity(10, 10, [0, 4, 2, 7, 2, 5, 0, 1, 0, 2]),
        // ]
    });
    let res = engine.run();
    for (let i = 0; i < 10; ++i) {
        console.log(...res[i].chromosome.map((x) => {
            return x.toString();
        }), '+', res[i].fitness);
    }
};
main();
