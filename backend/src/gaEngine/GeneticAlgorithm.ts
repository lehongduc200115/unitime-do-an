// Generate a random number in range [from, to)
export const randInt = (from: number, to: number) => {
  return Math.floor(Math.random() * (to - from) + from);
}

interface EntityConstructorProps {
  length?: number,
  geneCount: number,
  chromosome?: number[];
  calcFitness: (entity: Entity) => number;
}

export class Entity {
  length: number;
  geneCount: number;
  chromosome: number[] = [];
  fitness: number;
  calcFitness: (entity: Entity) => number;

  constructor({
      length,
      geneCount,
      chromosome = [],
      calcFitness,
  }: EntityConstructorProps) {
      this.geneCount = geneCount;
      this.length = length ? length : chromosome.length;
      this.calcFitness = calcFitness;
      
      // Random init if no chromosome specified
      if (chromosome.length == 0) {
          for (let i = 0; i < this.length; ++i) {
              this.chromosome.push(randInt(0, geneCount));
          }
      } else {
          this.chromosome = chromosome;
      }

      this.fitness = calcFitness(this);
  }

  public mutate = (chance: number) => {
      let isMutated = 0;
      for (let i = 0; i < this.length; ++i) {
          if (Math.random() < chance) {
              let mutatedGene = randInt(0, this.geneCount - 1);
              if (mutatedGene >= this.chromosome[i]) {
                  mutatedGene += 1;
              }
              this.chromosome[i] = mutatedGene;
              isMutated++;
          }
      }
      if (isMutated > 0) {
          this.fitness = this.calcFitness(this);
      }
  }
}


interface Configuration {
  chromosomeLength?: number,
  geneCount?: number,
  generation?: number,
  mutationRate?: number,
  maxPopulationSize?: number,
  fitness?: ((entity: Entity) => number),
  crossover?: ((first: Entity, second: Entity) => Entity[]),
  selection?: ((population: Entity[]) => Entity[]),

  eliteRate?: number,
  initialPopulation?: Entity[],
}


export class GeneticAlgorithm {

  // Algorithm's attributes
  private chromosomeLength: number;
  private geneCount: number;
  private generation: number;
  private mutationRate: number;
  private maxPopulationSize: number;
  private population: Entity[] = [];
  private fitness: ((entity: Entity) => number);
  private customSelectParents: ((population: Entity[]) => Entity[]) | undefined;
  private customCrossover: ((first: Entity, second: Entity) => Entity[]) | undefined;
  
  // Extended attributes
  private earlyStop: ((population: Entity[]) => boolean) | undefined;
  private eliteRate: number;
  // private notableEntities: Entity[] = [];

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
   * @param {number} [maxPopulationSize] - Maximum number of entities to be sustained in population
   * @param {(population: Entity[]) => Entity[]} selection - Custom parents selection function
   *      - Return an array of Entity object represent as parents
   * @param {(first: Entity, second: Entity) => Entity[]} crossover - Custom crossover function
   *      - Return 2 Entity object as array
   * @param {(entity: Entity) => number} fitness - Fitness evaluation function
   *      - Return fitness score
   *      - Higher score means better fitness
   * @param {(population: Entity[]) => boolean} [earlyStop] - Stop the algorithm when current population satisfies conditions.
   * @param {number} [eliteRate] - Proportion of population to continue live on
   *      - Relative to population after reproduction
   *      - A number from 0 to 1
   * @param {Entity[]} [initialPopulation] - Population to start with
   */
  public configurate = ({
      chromosomeLength = this.chromosomeLength,
      geneCount = this.geneCount,
      generation = this.generation || 50,
      mutationRate = this.mutationRate || 0.01,
      maxPopulationSize = this.maxPopulationSize || 50,
      fitness = this.fitness,
      selection = this.customSelectParents,
      crossover = this.customCrossover,
      eliteRate = isNaN(this.eliteRate) ? 0.2 : this.eliteRate,
      initialPopulation = []
  }: Configuration) => {
      this.chromosomeLength = chromosomeLength;
      this.geneCount = geneCount;
      this.generation = generation;
      this.mutationRate = mutationRate;
      this.maxPopulationSize = maxPopulationSize;
      this.population = initialPopulation;
      this.fitness = fitness;
      this.customSelectParents = selection;
      this.customCrossover = crossover;
      this.eliteRate = eliteRate;
  }

  /**
   * Run the algorithm with configurations set
   * 
   * @returns The final population
   */
  public run = () => {
      // Main loop
      let loop = Math.max(1, this.generation);
      while (true) {
          // Generate population
          this.spawnPopulation();
          // Early stopping condition satisfied?
          if (loop <= 0 || this.earlyStop?.(this.population)) {
              break;
          }
          // Selection
          const parentPool = this.selectParents();
          // Crossover (breeding) with mutation
          this.crossoverSelection(parentPool);
          // Control population size
          this.purgePopulation();

          loop--;
      }
      
      return this.population;
  }

  public get currentPopulation() {
      return this.population
  }


  /**
   * Generate population or emigrate to sustain population size
   */
  private spawnPopulation = () => {
      for (let i = this.population.length; i < this.maxPopulationSize; ++i) {
          this.population.push(
              new Entity({
                  length: this.chromosomeLength,
                  geneCount: this.geneCount,
                  calcFitness: this.fitness
              })
          )
      }
  }
  
  /**
   * Determines which entity should take part in crossover process.
   * A default K-way tournament selection is used if {@link customSelection} is undefined
   * 
   * @returns An array of even number of entities
   */
  private selectParents = () => {
      // Using custom method
      if (this.customSelectParents) {
          return this.customSelectParents(this.population);
      }
      // Or using default one
      const crossoverRate = 0.5;
      let parentPoolSize = Math.floor(this.population.length * crossoverRate);
      let temp = [...this.population].sort((a: Entity, b: Entity) => {
          return b.fitness - a.fitness // Descending fitness score
      });
      let result: Entity[] = [];
      // K-way tournament
      // Calculate sample space
      let maxProb = 0;
      this.population.forEach((entity: Entity) => {
          maxProb += entity.fitness + 1; // Padding 1 unit since there is 0 score.
      })
      // Pick up entities until enough size reached
      let i = 0;
      while (parentPoolSize) {
          if (Math.random() < (temp[i].fitness + 1) / maxProb) { // The division represents chance to be picked up
              result.push(temp[i]);
              parentPoolSize--;
              temp.splice(i, 1); // Remove picked entity from list
              i = i % temp.length;
              continue;
          }
          i = (i + 1) % temp.length;
      }
      return result;
  }
  
  /**
   * Coupling 2 from the pool and crossover
   * 
   * @param {Entity[]} parentPool - The pool where all entities will crossover each other
   */
  private crossoverSelection = (parentPool: Entity[]) => {
      let maxI = parentPool.length - 1;
      let maxJ = parentPool.length;
      for (let i = 0; i < maxI; ++i) {
          for (let j = i+1; j < maxJ; ++j) {
              this.population.push(...this.crossover(parentPool[i], parentPool[j]));
          }
      }
  }

  /**
   * Reproduce new entities from 2 entities using single-point crossover, including mutation.
   * A default single-point crossover is used if {@link customSelection} is undefined
   * 
   * @param first - First entity
   * @param second - Second entity
   * 
   * @returns Array contains 2 Entity offsprings
   */
  private crossover = (first: Entity, second: Entity) => {
      let firstChild: any;
      let secondChild: any;
      if (this.customCrossover) { // Using custom method
          [firstChild, secondChild] = this.customCrossover(first, second);
      } else { // Or using default one
          const length = this.chromosomeLength;
          let crossPoint = randInt(1, length) // At least 1 gene should be able to crossover
  
          firstChild = first.chromosome.slice(0, crossPoint);
          secondChild = second.chromosome.slice(0, crossPoint);

          
          firstChild.push(...second.chromosome.slice(crossPoint));
          secondChild.push(...first.chromosome.slice(crossPoint));

  
          firstChild = new Entity({
              geneCount: this.geneCount,
              chromosome: firstChild,
              calcFitness: this.fitness,
          });
          secondChild = new Entity({
              geneCount: this.geneCount,
              chromosome: secondChild,
              calcFitness: this.fitness,
          });
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
          return b.fitness - a.fitness // Descending fitness score
      });
      const eliteCount = Math.floor(this.maxPopulationSize * this.eliteRate);
      this.population.splice(eliteCount);
  }
}