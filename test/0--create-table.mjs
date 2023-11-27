import { BadgeTable } from 'badgetable'
import { config } from './../src/data/config.mjs'
import fs from 'fs'


const bg = new BadgeTable()
const n = [ 
    [ 'lukso', 'Lukso', './repositories/0-lukso-all.md' ], 
    [ 'tutorials', 'Tutorials', './repositories/1-tutorials-all.md' ],
    [ 'repos', 'Repositories', './repositories/2-repos-all.md' ]
]
    .forEach( b => {
        const [ key, headline, filePath ] = b
        console.log( '>>>', key )
        const values = config[ key ]
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
        strs += `# ${headline}\n\n`
        strs += bg.getTable( values )

        fs.writeFileSync( filePath, strs, 'utf-8' )
    } )