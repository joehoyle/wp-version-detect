const fetch = require( 'isomorphic-fetch' );
const fs = require( 'fs' );
const data = String( fs.readFileSync( './data.csv' ) );

const versions = { errored: 0 };

const urls = data.split( "\n" ).map( line => line.split( ' ' )[0] );
urls.map( url => fetch( 'http://' + url )
	.then( response => response.text() )
	.then( html => html.match( /<meta name="generator" content="WordPress ([\d|\.]+)"/ ) )
	.then( matches => matches ? matches[1] : 'unknown' )
	.then( version => versions[ version ] = versions[ version ] ? versions[ version ] + 1 : 1 )
	.then( () => console.log( versions ) )
	.catch( () => versions[ 'errored' ]++ )
)
