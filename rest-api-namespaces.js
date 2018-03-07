const fetch = require( 'isomorphic-fetch' );
const fs = require( 'fs' );
const data = String( fs.readFileSync( './data.csv' ) );

const urls = data.split( "\n" ).map( line => line.split( ' ' )[0] );
//const urls = [ 'kilovolt.dk' ]

const log = () => d => { console.log( d ); return d }
const namespaces = {};
const perSite = [];

urls.map( url => { return fetch( 'http://' + url )
	.then( response => response.text() )
	.then( html => html.match( /<link rel='https:\/\/api.w.org\/' href='([^']+)'/ )[1] )
	.then( url => fetch( url ) )
	.then( response => response.json() )
	.then( data => data.namespaces )
	.then( ns => {
		ns.forEach( n => {
			namespaces[ n ] = namespaces[ n ] ? namespaces[ n ] + 1 : 1
		})
		console.log( namespaces )
		perSite.push( ns.length )
		console.log( 'Average per site ' + ( perSite.reduce( ( a, b ) => a + b, 0 ) / perSite.length ) )
	})
	.catch( error => console.log( error.message ) )
})
