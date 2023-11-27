import { config } from './data/config.mjs'
import { YoutubeTranscript } from 'youtube-transcript'
import fs from 'fs'
import { Sitemap2Doc } from 'sitemap2doc'
import { Repos2Doc } from 'repos2doc'


export class UpGPT {
    #config
 

    constructor() {
        this.#config = config
    }


    async start() {

/*
        process.stdout.write( `Transscript    ` )
        await this.getTranscripts()
        console.log()
*/

/*
        process.stdout.write( 'Sitempap        ' )
        await this.getSitemaps()
        console.log()
*/

/*
        console.log( 'Get Tutorials' )
        await this.getTutorials()
*/

/*
        console.log( 'Get Lukso' )
        await this.#getLukso()
*/

        return true
    }


    async #getLukso() {
        const cmds = [
            [ 'repos', 'otherRepos', 'Other Repos' ],
            [ 'lukso', 'luksoRepos', 'Lukso Repos' ]
        ]

        for( const cmd of cmds ) {
            const [ key, pathKey ] = cmd 
            console.lo

            const repositories = this.#config[ key ]
                .filter( a => a['use'] === true )
                .map( a => a['repo'].replace( 'https://github.com/', '' ) )

            const r2d = new Repos2Doc( false )
            await r2d.getDocument( { 
                repositories,
                'name': key,
                'formats': [ 'md', 'txt', 'pdf' ],
                'destinationFolder': this.#config['paths'][ pathKey ]
            } )
        }

        return true
    }


    async getTutorials() {
        const { repositories, options } = this.#config['tutorials']
            .reduce( ( acc, a, index ) => {
                const repo = a['repo'].replace( 'https://github.com/', '' )
                acc['repositories'].push( repo )

                let path = ''
                path += this.#config['paths']['transcripts']
                path += `${index}.txt`
                const content = fs.readFileSync( path, 'utf-8' )
                acc['options'].push( {
                    'description': content 
                } )

                return acc
            }, { 'repositories': [], 'options': [] } )

        const r2d = new Repos2Doc( false )
        await r2d.getDocument( { 
            repositories,
            'name': 'tutorials',
            'formats': [ 'md', 'txt', 'pdf' ],
            'destinationFolder': this.#config['paths']['merge'],
            options
        } )

        return true
    }


    async getSitemaps() {
        const data = Object.entries( this.#config['sitemaps'] )

        const chunkSize = this.#config['meta']['sitemapChunkSize']
        const groups = data
            .map( ( a, i ) => i % chunkSize === 0 ? data.slice( i, i + chunkSize ) : null )
            .filter( a => a )

        for( let i = 0; i < groups.length; i++ ) {
            await Promise.all(
                groups[ i ]
                    .map( async( a, index ) => {
                        const [ key, value ] = a
                        const s2d = new Sitemap2Doc()
                        await s2d.getDocument( {
                            'projectName': key,
                            'sitemapUrl': value
                        } )
                    } )
            )
        }
        return true
    }


    async getTranscripts() {
        for( let i = 0; i < this.#config['tutorials'].length; i++ ) {
            process.stdout.write( `.` )
            const url = this.#config['tutorials'][ i ]['source']

            const txt = await this.getTransscript( { url } )
            let path = ''
            path += this.#config['paths']['transcripts']
            path += `${i}.txt`

            fs.writeFileSync( path, txt, 'utf-8' )
        }
    
        return true
    }


    async getTransscript( { url } ) {
        const response = await YoutubeTranscript
            .fetchTranscript( url )
        const result = response
            .map( a => a['text'] )
            .join( "\n" )
        return result
    }
}