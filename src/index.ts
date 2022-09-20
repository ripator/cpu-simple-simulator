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

mainCPU.parseTextToInstructions(instructions)

// const express = require('express')
// const app = express()
// const port = 3001
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`);
//     console.log(mainCPU.parseTextToInstructions(instructions));
// })