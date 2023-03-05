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
 *   List chỗ trống
 * }
 * length2 * maxLength
 */
class Coord {
    constructor(label) {
        this.building = ['B1', 'B2'];
        this.value = 0;
        let coord = label.split('-');
        let value = 0;
        if (coord[0][0] == 'H') {
            value += 100000 + parseInt(coord[0][1]) * 1000;
        }
        else {
            value += this.building.findIndex((x) => (x == coord[0])) * 1000;
        }
        value += parseInt(coord[1]);
        this.value = value;
    }
}
const fitness = (entity) => {
    let score = 0;
    const totalFreeSlot = 9;
    entity.chromosome.forEach((value, index) => {
        let freeSlotId = value % totalFreeSlot;
        let lecturerId = Math.floor(value / totalFreeSlot);
    });
    return score;
};
// Test
const main = async () => {
    let engine = new GeneticAlgorithm_1.GeneticAlgorithm();
    engine.configurate({
        chromosomeLength: 10,
        geneCount: 10,
        generation: 10,
        mutationRate: 0.01,
        maxPopulationSize: 100,
        fitness: fitness,
        eliteRate: 0.1,
        // initialPopulation: [
        //     new Entity(10, 10, [0, 9, 1, 7, 4, 5, 0, 1, 4, 2]),
        //     new Entity(10, 10, [0, 4, 2, 7, 2, 5, 0, 1, 0, 2]),
        // ]
    });
    let res = engine.run();
    console.log("Result:");
    for (let i = 0; i < 10; ++i) {
        console.log(...res[i].chromosome.map((x) => {
            return x.toString();
        }), '+', res[i].fitness);
    }
};
main();
