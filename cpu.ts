 import './registerNames';

 class SimpleCPU {
  private reg0: number; // reg0 is an accumulator register
  private reg1: number;
  private reg2: number;
  private reg3: number;
  private reg4: number;
  private reg5: number;
  private reg6: number;
  private reg7: number; 
  private reg8: number; 
  private reg9: number; // reg9 is a flag register for cmp method

  private linePointer: number = 0;
  private labels = {};

   private readInstructionsLineByLine(instructionsLines: string[]) {
      while (this.linePointer < instructionsLines.length) {
         const command = instructionsLines[this.linePointer].split(' ')[0];
         const commandArguments = instructionsLines[this.linePointer].split(' ')[1];
         if (!this[command] && command[command.length -1] === ':') {
            this.labels[command.replace(/:$/, '')] = this.linePointer;
         } else {
            this[command](...commandArguments.split(', '));
         }
         ++this.linePointer;
      }
   }

   public jmp(label) {
      this.linePointer = this.labels[label];
   }

   public jl(label) {
      if (this.reg9 === -1) {
         this.jmp(label);
      }
   }

   public jg(label) {
      if (this.reg9 === 1) {
         this.jmp(label);
      }
   }

   public jle(label) {
      if (this.reg9 <= 0) {
         this.jmp(label);
      }
   }

   public jge(label) {
      if (this.reg9 >= 0) {
         this.jmp(label);
      }
   }

   public je(label) {
      if (this.reg9 == 0) {
         this.jmp(label);
      }
   }
  
   public parseTextToInstructions(text){
      const instructionsLinesArray = text.split('\n');
      this.readInstructionsLineByLine(instructionsLinesArray);
   }
   
   private isValidRegisterName(name: string | number): boolean {
      return typeof name === 'string' && Object.values(registerNames).includes(name);
   }

   private isInvalidRegisterName(name: string | number): boolean {
      return typeof name === 'string' && !Object.values(registerNames).includes(name);
   }

  public print (argument) {
   if (this.isValidRegisterName(argument)) {
      console.log(this[argument]);
   } else {
      console.log(argument);
   }
  }

  public mov(argument1: string, argument2: string | number) {
   if (this.isInvalidRegisterName(argument2)) {
      throw 'Error[mov]: The second argument should be a number or a register name.'
   }
   if (this.isValidRegisterName(argument2)) {
      this[argument1] = this[argument2]
   }
   if (typeof argument2 === 'number') {
      this[argument1] = argument2;
   }
  }

  public add(argument1: number | string, argument2: number | string) {
      if (this.isValidRegisterName(argument1)) {
         if (typeof argument2 === 'number') {
            this[argument1] = this[argument1] + argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = this[argument1] + this[argument2];
         }
      }
      if (typeof argument1 === 'number') {
         if (typeof argument2 === 'number') {
            this.reg0 = argument1 + argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = argument1 + this[argument2];
         }
      }
      if (this.isInvalidRegisterName(argument1) 
         || this.isInvalidRegisterName(argument2)) {
         throw 'Error[add]: The arguments should be a number or a register name.'
      }
  }

   public sub(argument1: number | string, argument2: number | string) {
      if (this.isValidRegisterName(argument1)) {
         if (typeof argument2 === 'number') {
            this[argument1] = this[argument1] - argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = this[argument1] - this[argument2];
         }
      }
      if (typeof argument1 === 'number') {
         if (typeof argument2 === 'number') {
            this.reg0 = argument1 - argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = argument1 - this[argument2];
         }
      }
      if (this.isInvalidRegisterName(argument1) 
         || this.isInvalidRegisterName(argument2)) {
         throw 'Error[sub]: The arguments should be a number or a register name.'
      }
   }

   public mul(argument1: number | string, argument2: number | string) {
      if (this.isValidRegisterName(argument1)) {
         if (typeof argument2 === 'number') {
            this[argument1] = this[argument1] * argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = this[argument1] * this[argument2];
         }
      }
      if (typeof argument1 === 'number') {
         if (typeof argument2 === 'number') {
            this.reg0 = argument1 * argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = argument1 * this[argument2];
         }
      }
      if (this.isInvalidRegisterName(argument1) 
         || this.isInvalidRegisterName(argument2)) {
         throw 'Error[mul]: The arguments should be a number or a register name.'
      }
   }

   public div(argument1: number | string, argument2: number | string) {
      if (this.isValidRegisterName(argument1)) {
         if (typeof argument2 === 'number') {
            this[argument1] = this[argument1] / argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = this[argument1] / this[argument2];
         }
      }
      if (typeof argument1 === 'number') {
         if (typeof argument2 === 'number') {
            this.reg0 = argument1 / argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = argument1 / this[argument2];
         }
      }
      if (this.isInvalidRegisterName(argument1) 
         || this.isInvalidRegisterName(argument2)) {
         throw 'Error[div]: The arguments should be a number or a register name.'
      }
   }

   private compareOperation(argument1, argument2) {
      if (argument1 > argument2) {
         this.reg9 = 1;
      }
      if (argument1 < argument2) {
         this.reg9 = -1;
      }
      if (argument1 == argument2) {
         this.reg9 = 0;
      }
   }

   public cmp(argument1, argument2) {
      if (this.isValidRegisterName(argument1)) {
         if (typeof argument2 === 'number') {
            this.compareOperation(this[argument1], argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.compareOperation(this[argument1], this[argument2]);
         }
      }
      if (typeof argument1 === 'number') {
         if (typeof argument2 === 'number') {
            this.compareOperation(argument1, argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.compareOperation(argument1, this[argument2]);
         }
      }
      if (this.isInvalidRegisterName(argument1) 
         || this.isInvalidRegisterName(argument2)) {
         throw 'Error[cmp]: The arguments should be a number or a register name.'
      }
   }

   public and(argument1: number | string, argument2: number | string) {
      if (this.isValidRegisterName(argument1)) {
         if (typeof argument2 === 'number') {
            this[argument1] = this[argument1] & argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = this[argument1] & this[argument2];
         }
      }
      if (typeof argument1 === 'number') {
         if (typeof argument2 === 'number') {
            this.reg0 = argument1 & argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = argument1 & this[argument2];
         }
      }
      if (this.isInvalidRegisterName(argument1) 
         || this.isInvalidRegisterName(argument2)) {
         throw 'Error[and]: The arguments should be a number or a register name.'
      }
   }

   public or(argument1: number | string, argument2: number | string) {
      if (this.isValidRegisterName(argument1)) {
         if (typeof argument2 === 'number') {
            this[argument1] = this[argument1] | argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = this[argument1] | this[argument2];
         }
      }
      if (typeof argument1 === 'number') {
         if (typeof argument2 === 'number') {
            this.reg0 = argument1 | argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = argument1 | this[argument2];
         }
      }
      if (this.isInvalidRegisterName(argument1) 
         || this.isInvalidRegisterName(argument2)) {
         throw 'Error[or]: The arguments should be a number or a register name.'
      }
   }

   public xor(argument1: number | string, argument2: number | string) {
      if (this.isValidRegisterName(argument1)) {
         if (typeof argument2 === 'number') {
            this[argument1] = this[argument1] ^ argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = this[argument1] ^ this[argument2];
         }
      }
      if (typeof argument1 === 'number') {
         if (typeof argument2 === 'number') {
            this.reg0 = argument1 ^ argument2;
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = argument1 ^ this[argument2];
         }
      }
      if (this.isInvalidRegisterName(argument1) 
         || this.isInvalidRegisterName(argument2)) {
         throw 'Error[xor]: The arguments should be a number or a register name.'
      }
   }
}

export {SimpleCPU};