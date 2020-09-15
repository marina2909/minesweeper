import React, { Component } from 'react';
import Grid from '../grid/grid.js';

class App extends Component {
	constructor(props) {
		super();
	}
	render() { 

		return ( 
			<div>
				<Grid m={10} n={12} numberOfMines={25} />
			</div> 
		);
	}
}
 
export default App;