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
exports.GeneticAlgorithm = exports.Entity = exports.randInt = void 0;
// Generate a random number in range [from, to)
var randInt = function (from, to) {
    return Math.floor(Math.random() * (to - from) + from);
};
exports.randInt = randInt;
var Entity = /** @class */ (function () {
    function Entity(length, geneCount, chromosome) {
        if (geneCount === void 0) { geneCount = 2; }
        if (chromosome === void 0) { chromosome = []; }
        var _this = this;
        this.chromosome = [];
        this.mutate = function (chance) {
            for (var i = 0; i < _this.length; ++i) {
                if (Math.random() < chance) {
                    var mutatedGene = (0, exports.randInt)(0, _this.geneCount - 1);
                    if (mutatedGene >= _this.chromosome[i]) {
                        mutatedGene += 1;
                    }
                    _this.chromosome[i] = mutatedGene;
                }
            }
        };
        this.geneCount = geneCount;
        this.length = length;
        // Random init if no chromosome specified
        if (chromosome.length == 0) {
            for (var i = 0; i < length; ++i) {
                this.chromosome.push((0, exports.randInt)(0, geneCount));
            }
        }
        else {
            this.chromosome = chromosome;
        }
    }
    return Entity;
}());
exports.Entity = Entity;
var GeneticAlgorithm = /** @class */ (function () {
    function GeneticAlgorithm() {
        var _this = this;
        this.population = [];
        this.notableEntities = [];
        /**
         * Configurate genetic algorithm's attributes
         *
         * @param {number} [chromosomeLength] - Number of genes in chromosome
         * @param {number} [geneCount] - Number of gene types
         * @param {number} [generation] - Number of iterations
         *      - Algorithm may be stopped beforehand by other conditions
         *      - Optional work?: 0 generation for other stopping condition
         * @param {number} [mutationRate] - Chance for a gene mutate. A number from 0 to 1
         * @param {number} [populationSize] - Number of entities in population
         * @param {(population: Entity[]) => Entity[] | undefined} selection - Fitness evaluation function
         *      - Return fitness score
         *      - Higher score means better fitness
         * @param {(entity: Entity) => number | undefined} fitness - Fitness evaluation function
         *      - Return fitness score
         *      - Higher score means better fitness
         * @param {(population: Entity[]) => void | undefined} [dump] - Do anything at the end of the run
         * @param {number} [eliteRate] - Proportion of population to continue live on
         *      - Relative to population after reproduction
         *      - A number from 0 to 1
         */
        this.configurate = function (_a) {
            var _b = _a.chromosomeLength, chromosomeLength = _b === void 0 ? _this.chromosomeLength : _b, _c = _a.geneCount, geneCount = _c === void 0 ? _this.geneCount : _c, _d = _a.generation, generation = _d === void 0 ? _this.generation || 50 : _d, _e = _a.mutationRate, mutationRate = _e === void 0 ? _this.mutationRate || 0.01 : _e, _f = _a.populationSize, populationSize = _f === void 0 ? _this.populationSize || 50 : _f, _g = _a.fitness, fitness = _g === void 0 ? _this.fitness : _g, _h = _a.selection, selection = _h === void 0 ? _this.customSelectParents : _h, _j = _a.dump, dump = _j === void 0 ? _this.customDump : _j, _k = _a.eliteRate, eliteRate = _k === void 0 ? isNaN(_this.eliteRate) ? 0.5 : _this.eliteRate : _k;
            _this.chromosomeLength = chromosomeLength;
            _this.geneCount = geneCount;
            _this.generation = generation;
            _this.mutationRate = mutationRate;
            _this.populationSize = populationSize;
            _this.fitness = fitness;
            _this.customSelectParents = selection;
            _this.customDump = dump;
            _this.eliteRate = eliteRate;
        };
        /**
         * Run the algorithm with configurations set
         */
        this.run = function () {
            // Generate population
            _this.spawnPopulation();
            _this.calculateFitness();
            // Main loop
            var loop = _this.generation;
            while (loop--) {
                // Testing code
                console.log('\rGeneration', _this.generation - loop);
                // Calculate fitness of the population
                // Early stopping condition satisfied?
                // TODO
                // Selection
                var parentPool = _this.selectParents();
                var parentPoolLength = parentPool.length;
                // Crossover (breeding) with mutation
                _this.crossoverSelection(parentPool);
                // Control population size
                _this.purgePopulation();
                _this.spawnPopulation();
                _this.calculateFitness();
            }
            _this.dump();
        };
        /**
         * Do anything to the final population
         */
        this.dump = function () {
            if (_this.customDump) {
                _this.customDump(_this.population);
            }
            else {
                _this.population.forEach(function (entity) {
                    console.log(entity.chromosome, '-', entity.fitness);
                });
            }
        };
        /**
         * Generate population or emigrate to sustain population size
         */
        this.spawnPopulation = function () {
            for (var i = _this.population.length; i < _this.populationSize; ++i) {
                _this.population.push(new Entity(_this.chromosomeLength, _this.geneCount));
            }
        };
        /**
         * Calculate fitness score for whole population. Higher score means better fitness
         */
        this.calculateFitness = function () {
            // Update fitness score for each entity
            _this.population.forEach(function (entity, index) {
                _this.population[index].fitness = _this.fitness(entity);
            });
        };
        /**
         * Determines which entity should take part in crossover process. A default function is used if {@link customSelection} is undefined
         *
         * @returns An array of even number of entities
         */
        this.selectParents = function () {
            if (_this.customSelectParents) {
                return _this.customSelectParents(_this.population);
            }
            else { // Using default selection function
                var crossoverRate = 0.3;
                var parentPoolSize = Math.floor(_this.population.length * crossoverRate);
                var temp = __spreadArray([], _this.population, true).sort(function (a, b) {
                    return b.fitness - a.fitness; // Descending fitness score
                });
                var result = [];
                // K-way tournament
                // Calculate sample space
                var maxProb = temp[0].fitness + 1;
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
            }
        };
        /**
         * Coupling 2 from the pool and crossover
         *
         * @param {Entity[]} parentPool - The pool where all entities will crossover each other
         */
        this.crossoverSelection = function (parentPool) {
            var _a;
            var maxI = parentPool.length - 1;
            var maxJ = parentPool.length;
            for (var i = 0; i < maxI; ++i) {
                for (var j = i + 1; j < maxJ; ++j) {
                    (_a = _this.population).push.apply(_a, _this.crossover(parentPool[i], parentPool[j]));
                }
            }
        };
        /**
         * Reproduce new entities from 2 entities using single-point crossover, including mutation. A default function is used if {@link customSelection} is undefined
         *
         * @param first - First entity
         * @param second - Second entity
         *
         * @returns Array contains 2 Entity offsprings
         */
        this.crossover = function (first, second) {
            var _a;
            var firstChild;
            var secondChild;
            if (_this.customCrossover) {
                _a = _this.customCrossover(first, second), firstChild = _a[0], secondChild = _a[1];
            }
            else {
                var length_1 = _this.chromosomeLength;
                var crossPoint = (0, exports.randInt)(1, length_1); // At least 1 gene should be able to crossover
                firstChild = first.chromosome.slice(0, crossPoint);
                secondChild = second.chromosome.slice(0, crossPoint);
                firstChild.push.apply(firstChild, second.chromosome.slice(crossPoint));
                secondChild.push.apply(secondChild, first.chromosome.slice(crossPoint));
                firstChild = new Entity(length_1, _this.geneCount, firstChild);
                secondChild = new Entity(length_1, _this.geneCount, secondChild);
            }
            firstChild.mutate(_this.mutationRate);
            secondChild.mutate(_this.mutationRate);
            return [firstChild, secondChild];
        };
        /**
         * Use this method to control population size.
         */
        this.purgePopulation = function () {
            _this.population.sort(function (a, b) {
                return Math.round(b.fitness - a.fitness); // Descending fitness score
            });
            var eliteCount = Math.floor(_this.populationSize * _this.eliteRate);
            _this.population.splice(eliteCount);
        };
    }
    return GeneticAlgorithm;
}());
exports.GeneticAlgorithm = GeneticAlgorithm;
