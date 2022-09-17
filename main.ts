import { SimpleCPU } from "./cpu";

const mainCPU = new SimpleCPU();

const instructions = `
mov reg5, 10
cmp 10, 10
jle Test
add reg5, 10
Test:
print reg5 
`;

const express = require('express')
const app = express()
const port = 3001
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log(mainCPU.parseTextToInstructions(instructions));
})