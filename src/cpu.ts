
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

  private registerNames = {
      reg0: 'reg0',
      reg1: 'reg1',
      reg2: 'reg2',
      reg3: 'reg3',
      reg4: 'reg4',
      reg5: 'reg5',
      reg6: 'reg6',
      reg7: 'reg7',
      reg8: 'reg8',
      reg9: 'reg9',
   }

   private isLabelLine = (line: string) => {
      return Boolean(line.match(/:$/));
   }

   private fetchLabels = (instructionsLines: string[]) => {
      instructionsLines.forEach((line, lineIndex) => {
         if (this.isLabelLine(line)) {
            this.labels[line.replace(/:$/, '')] = lineIndex;
         }
      })
   }

   public parseTextToInstructions(text: string){
      const instructionsLinesArray = text.trim().split('\n');
      this.fetchLabels(instructionsLinesArray);
      this.readInstructionsLineByLine(instructionsLinesArray);
   }
   
   private readInstructionsLineByLine(instructionsLines: string[]) {
      while (this.linePointer < instructionsLines.length) {
         const command = instructionsLines[this.linePointer].split(' ')[0];
         const commandArguments = instructionsLines[this.linePointer].split(' ')[1];

         if (!this.isLabelLine(command)) {
            this[command](...commandArguments.split(','));
         }
         ++this.linePointer;
      }
   }
   
   private isNumericValue = (value: string) => {
      return /^\d+$/.test(value);
   }

   private isValidRegisterName(name: string): boolean {
      return Object.values(this.registerNames).includes(name);
   }

   private isInvalidRegisterName(name: string): boolean {
      return !Object.values(this.registerNames).includes(name);
   }

   private isInvalidString = (value: string) => {
      return this.isInvalidRegisterName(value) && !this.isNumericValue(value);
   }

   private checkErrors = (argument1: string, argument2: string) => {
      if (this.isInvalidString(argument1) 
         || this.isInvalidString(argument2)) {
         throw `'Error[line: ${this.linePointer}]: The arguments should be a number or a register name.'`
      }
   }

  public print (argument: string) {
   if (this.isValidRegisterName(argument)) {
      console.log(this[argument]);
   } else {
     console.log(argument);
   }
  }

  public mov(argument1: string, argument2: string) {
   if (this.isInvalidString(argument2)) {
      throw 'Error[mov]: The second argument should be a number or a register name.'
   }
   if (this.isValidRegisterName(argument2)) {
      this[argument1] = this[argument2]
   }
   if (this.isNumericValue(argument2)) {
      this[argument1] = argument2;
   }
  }

  //arithmetic methods below

  public add(argument1: string, argument2: string) {
      if (this.isValidRegisterName(argument1)) {
         if (this.isNumericValue(argument2)) {
            this[argument1] = Number(this[argument1]) + Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = Number(this[argument1]) + Number(this[argument2]);
         }
      }
      if (this.isNumericValue(argument1)) {
         if (this.isNumericValue(argument2)) {
            this.reg0 = Number(argument1) + Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = Number(argument1) + Number(this[argument2]);
         }
      }
      this.checkErrors(argument1, argument2);
   }

   public sub(argument1: string, argument2: string) {
      if (this.isValidRegisterName(argument1)) {
         if (this.isNumericValue(argument2)) {
            this[argument1] = Number(this[argument1]) - Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = Number(this[argument1]) - Number(this[argument2]);
         }
      }
      if (this.isNumericValue(argument1)) {
         if (this.isNumericValue(argument2)) {
            this.reg0 = Number(argument1) - Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = Number(argument1) - Number(this[argument2]);
         }
      }
      this.checkErrors(argument1, argument2);
   }

   public mul(argument1: string, argument2: string) {
      if (this.isValidRegisterName(argument1)) {
         if (this.isNumericValue(argument2)) {
            this[argument1] = Number(this[argument1]) * Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = Number(this[argument1]) * Number(this[argument2]);
         }
      }
      if (this.isNumericValue(argument1)) {
         if (this.isNumericValue(argument2)) {
            this.reg0 = Number(argument1) * Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = Number(argument1) * Number(this[argument2]);
         }
      }
      this.checkErrors(argument1, argument2);
   }

   public div(argument1: string, argument2: string) {
      if (this.isValidRegisterName(argument1)) {
         if (this.isNumericValue(argument2)) {
            this[argument1] = Number(this[argument1]) / Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = Number(this[argument1]) / Number(this[argument2]);
         }
      }
      if (this.isNumericValue(argument1)) {
         if (this.isNumericValue(argument2)) {
            this.reg0 = Number(argument1) / Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = Number(argument1) / Number(this[argument2]);
         }
      }
      this.checkErrors(argument1, argument2);
   }

   private compareOperation(argument1: string, argument2: string) {
      this.reg9 = Number(argument1) - Number(argument2);
   }

   public cmp(argument1: string, argument2: string) {
      if (this.isValidRegisterName(argument1)) {
         if (this.isNumericValue(argument2)) {
            this.compareOperation(this[argument1], argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.compareOperation(this[argument1], this[argument2]);
         }
      }
      if (this.isNumericValue(argument1)) {
         if (this.isNumericValue(argument2)) {
            this.compareOperation(argument1, argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.compareOperation(argument1, this[argument2]);
         }
      }
      this.checkErrors(argument1, argument2);
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

   //logic methods below

   public and(argument1: string, argument2: string) {
      if (this.isValidRegisterName(argument1)) {
         if (this.isNumericValue(argument2)) {
            this[argument1] = Number(this[argument1]) & Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = Number(this[argument1]) & Number(this[argument2]);
         }
      }
      if (this.isNumericValue(argument1)) {
         if (this.isNumericValue(argument2)) {
            this.reg0 = Number(argument1) & Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = Number(argument1) & Number(this[argument2]);
         }
      }
      this.checkErrors(argument1, argument2);
   }

   public or(argument1: string, argument2: string) {
      if (this.isValidRegisterName(argument1)) {
         if (this.isNumericValue(argument2)) {
            this[argument1] = Number(this[argument1]) | Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = Number(this[argument1]) | Number(this[argument2]);
         }
      }
      if (this.isNumericValue(argument1)) {
         if (this.isNumericValue(argument2)) {
            this.reg0 = Number(argument1) | Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = Number(argument1) | Number(this[argument2]);
         }
      }
      this.checkErrors(argument1, argument2);
   }

   public xor(argument1: string, argument2: string) {
      if (this.isValidRegisterName(argument1)) {
         if (this.isNumericValue(argument2)) {
            this[argument1] = Number(this[argument1]) ^ Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this[argument1] = Number(this[argument1]) ^ Number(this[argument2]);
         }
      }
      if (this.isNumericValue(argument1)) {
         if (this.isNumericValue(argument2)) {
            this.reg0 = Number(argument1) ^ Number(argument2);
         }
         if (this.isValidRegisterName(argument2)) {
            this.reg0 = Number(argument1) ^ Number(this[argument2]);
         }
      }
      this.checkErrors(argument1, argument2);
   }
}

export {SimpleCPU};