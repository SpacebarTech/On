const generateKey = ( resizeListeners ) => {

	let key = Date.now();

	while ( resizeListeners[key] ) {
		key += 1;
	}

	return key;

};


export default ( function ( delay ) {

	const resizeListeners = {};

	let timeout = null;

	const getDims = () => {
		const { innerHeight : height, innerWidth : width } = window;

		return { height, width };
	};

	// watch for resize {delay} seconds
	// after the page resize is complete
	window.addEventListener( 'resize', ( ) => {

		if ( timeout ) {
			// resize events frequently happen hundreds of times
			// in seconds. so this makes sure we only run resize
			// callbacks after we are sure the user is done resizing
			// the page.
			window.clearTimeout( timeout );
		}

		timeout = window.setTimeout( () => {

			const keys = Object.keys( resizeListeners );
			const dims = getDims();

			keys.forEach( ( key ) => {
				const callback = resizeListeners[key];

				if ( typeof callback !== 'function' ) {
					// some browsers leave null after
					// you delete a key
					return;
				}

				callback( dims );
			} );

		}, delay );

	} );

	return {

		resize( callback, runImmediately = false ) {

			const key = generateKey( resizeListeners );
			resizeListeners[key] = callback;

			if ( runImmediately ) {
				callback( getDims() );
			}

			return key;

		},

		off( key ) {
			delete resizeListeners[key];
		}

	};

}( 200 ) ); // milliseconds to wait until running after resize ends
