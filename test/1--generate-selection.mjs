import { BadgeTable } from 'badgetable'
import { config } from './../src/data/config.mjs'
import fs from 'fs'


const bg = new BadgeTable()

const n = [
    [ 'repos', './4-repos-selection.md' ],
    [ 'lukso', './5-lukso-selection.md' ]
]
    .forEach( b => {
        const [ key, filePath ] = b
        const values = config[ key ]
            .filter( a => a['use'] === true )
            .reduce( ( acc, a, index ) => {
                if( index === 0 ) {
                    acc['template'] = 'githubStats'
                    acc['projects'] = []
                }
        
                const parts = a['repo']
                    .replace( 'https://github.com', '' )
                    .split( '/' )
                const struct = {
                    'title': `${parts.slice( -1 )[ 0 ]}`,
                    'githubUserName': `${parts.slice( -2 )[ 0 ]}`,
                    'githubRepository': `${parts.slice( -1 )[ 0 ]}`,
                    'jsonPath': 'dependencies.o1js'
                }
        
                acc['projects'].push( struct )
                return acc
            }, {} )
        
        let strs = ''
        strs += `# Selection\n\n`
        strs += bg.getTable( values )
        
        fs.writeFileSync( `${filePath}`, strs, 'utf-8' )
    } )


