import { SimpleCPU } from "./cpu";

const mainCPU = new SimpleCPU();

const instructions = `
mov reg5,10
cmp reg5,15
jle Test
add reg5,10
Test:
print reg5
`;

mainCPU.parseTextToInstructions(instructions);
