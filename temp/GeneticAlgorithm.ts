// Generate a random number in range [from, to)
export const randInt = (from: number, to: number) => {
    return Math.floor(Math.random() * (to - from) + from);
}


export class Entity {
    length: number;
    geneCount: number;
    chromosome: number[] = [];
    fitness: number;

    constructor(length: number, geneCount: number = 2, chromosome: number[] = []) {
        this.geneCount = geneCount;
        this.length = length;

        // Random init if no chromosome specified
        if (chromosome.length == 0) {
            for (let i = 0; i < length; ++i) {
                this.chromosome.push(randInt(0, geneCount))
            }
        } else {
            this.chromosome = chromosome
        }
    }

    public mutate = (chance: number) => {
        for (let i = 0; i < this.length; ++i) {
            if (Math.random() < chance) {
                let mutatedGene = randInt(0, this.geneCount - 1);
                if (mutatedGene >= this.chromosome[i]) {
                    mutatedGene += 1;
                }
                this.chromosome[i] = mutatedGene;
            }
        }
    }
}


interface Configuration {
    chromosomeLength?: number,
    geneCount?: number,
    generation?: number,
    mutationRate?: number,
    populationSize?: number,
    fitness: ((entity: Entity) => number),
    selection: ((population: Entity[]) => Entity[]) | undefined,
    dump?: ((population: Entity[]) => void) | undefined,

    eliteRate?: number
}


export class GeneticAlgorithm {

    // Algorithm's attributes
    chromosomeLength: number;
    geneCount: number;
    generation: number;
    mutationRate: number;
    populationSize: number;
    population: Entity[] = [];
    fitness: ((entity: Entity) => number);
    customSelectParents: ((population: Entity[]) => Entity[]) | undefined;
    customCrossover: ((first: Entity, second: Entity) => Entity[]) | undefined;
    customDump: ((population: Entity[]) => void) | undefined;
    
    // Extended attributes
    eliteRate: number;
    notableEntities: Entity[] = [];

    constructor() {}


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
    public configurate = ({
        chromosomeLength = this.chromosomeLength,
        geneCount = this.geneCount,
        generation = this.generation || 50,
        mutationRate = this.mutationRate || 0.01,
        populationSize = this.populationSize || 50,
        fitness = this.fitness,
        selection = this.customSelectParents,
        dump = this.customDump,
        eliteRate = isNaN(this.eliteRate) ? 0.5 : this.eliteRate
    }: Configuration) => {
        this.chromosomeLength = chromosomeLength;
        this.geneCount = geneCount;
        this.generation = generation;
        this.mutationRate = mutationRate;
        this.populationSize = populationSize;
        this.fitness = fitness;
        this.customSelectParents = selection;
        this.customDump = dump;
        this.eliteRate = eliteRate;
    }

    /**
     * Run the algorithm with configurations set
     */
    public run = () => {
        // Generate population
        this.spawnPopulation();
        this.calculateFitness();
        // Main loop
        let loop = this.generation;
        while (loop--) {
            // Testing code
            console.log('\rGeneration', this.generation - loop);
            // Calculate fitness of the population
            // Early stopping condition satisfied?
            // TODO
            // Selection
            const parentPool = this.selectParents();
            const parentPoolLength = parentPool.length;
            // Crossover (breeding) with mutation
            this.crossoverSelection(parentPool);
            // Control population size
            this.purgePopulation();
            this.spawnPopulation();
            this.calculateFitness();
        }
        
        this.dump();
    }

    /**
     * Do anything to the final population
     */
    private dump = () => {
        if (this.customDump) {
            this.customDump(this.population);
        } else {
            this.population.forEach((entity: Entity) => {
                console.log(entity.chromosome, '-', entity.fitness);
            });
        }
    }

    /**
     * Generate population or emigrate to sustain population size
     */
    private spawnPopulation = () => {
        for (let i = this.population.length; i < this.populationSize; ++i) {
            this.population.push(
                new Entity(
                    this.chromosomeLength,
                    this.geneCount
                )
            )
        }
    }
    
    /**
     * Calculate fitness score for whole population. Higher score means better fitness
     */
    private calculateFitness = () => {
        // Update fitness score for each entity
        this.population.forEach((entity: Entity, index: number) => {
            this.population[index].fitness = this.fitness(entity);
        });
    }
    
    /**
     * Determines which entity should take part in crossover process. A default function is used if {@link customSelection} is undefined
     * 
     * @returns An array of even number of entities
     */
    private selectParents = () => {
        if (this.customSelectParents) {
            return this.customSelectParents(this.population);
        } else { // Using default selection function
            const crossoverRate = 0.3;
            let parentPoolSize = Math.floor(this.population.length * crossoverRate);
            let temp = [...this.population].sort((a: Entity, b: Entity) => {
                return b.fitness - a.fitness // Descending fitness score
            });
            let result: Entity[] = [];
            // K-way tournament
            // Calculate sample space
            let maxProb = temp[0].fitness + 1;
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
    }
    
    /**
     * Coupling 2 from the pool and crossover
     * 
     * @param {Entity[]} parentPool - The pool where all entities will crossover each other
     */
    private crossoverSelection = (parentPool: Entity[]) => {
        let maxI = parentPool.length - 1;
        let maxJ = parentPool.length
        for (let i = 0; i < maxI; ++i) {
            for (let j = i+1; j < maxJ; ++j) {
                this.population.push(...this.crossover(parentPool[i], parentPool[j]));
            }
        }
    }

    /**
     * Reproduce new entities from 2 entities using single-point crossover, including mutation. A default function is used if {@link customSelection} is undefined
     * 
     * @param first - First entity
     * @param second - Second entity
     * 
     * @returns Array contains 2 Entity offsprings
     */
    private crossover = (first: Entity, second: Entity) => {
        let firstChild: any;
        let secondChild: any;
        if (this.customCrossover) {
            [firstChild, secondChild] = this.customCrossover(first, second);
        } else {
            const length = this.chromosomeLength;
            let crossPoint = randInt(1, length) // At least 1 gene should be able to crossover
    
            firstChild = first.chromosome.slice(0, crossPoint);
            secondChild = second.chromosome.slice(0, crossPoint);
            
            firstChild.push(...second.chromosome.slice(crossPoint));
            secondChild.push(...first.chromosome.slice(crossPoint));
    
            firstChild = new Entity(length, this.geneCount, firstChild);
            secondChild = new Entity(length, this.geneCount, secondChild);
        }

        firstChild.mutate(this.mutationRate);
        secondChild.mutate(this.mutationRate);

        return [firstChild, secondChild];
    }

    /**
     * Use this method to control population size.
     */
    private purgePopulation = () => {
        this.population.sort((a: Entity, b: Entity) => {
            return Math.round(b.fitness - a.fitness) // Descending fitness score
        });
        const eliteCount = Math.floor(this.populationSize * this.eliteRate);
        this.population.splice(eliteCount);
    }
}