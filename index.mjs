import { UpGPT } from './src/UpGPT.mjs'

const up = new UpGPT()


const url = 'https://www.youtube.com/watch?v=DMpeMswK12w'
const txt = await up.getTransscript( { url } )

console.log( 'Txt', txt )