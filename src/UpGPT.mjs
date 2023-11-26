import { config } from './data/config.mjs'
import { YoutubeTranscript } from 'youtube-transcript'



export class UpGPT {
    #config


    constructor() {

    }


    async getTransscript( { url } ) {
        const txt = await YoutubeTranscript.fetchTranscript( url )
        return txt.map( a => a['text'] )
    }

}