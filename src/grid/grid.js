import React, { Component } from 'react';
import './grid.css';

class Grid extends Component {
	constructor(props) {
		super();
		this.state = {
			matrix: [[]],
			revealed: [[]],
			boom: false
		}
	}

	componentDidMount() {
		console.log(this.props.n)
		this.setState({
			matrix: generateMatrix(this.props.m, this.props.n, this.props.numberOfMines),
			revealed: generateRevealed(this.props.m, this.props.n)
		});
	}

	onCellClick(i, j) {
		let revealed = openCells(i, j, this.state.matrix, this.state.revealed);
		this.setState({
			revealed,
			boom: this.state.matrix[i][j] === '*'
		});
	}	

	render() {
		let {boom, matrix, revealed} = this.state;
		let {m, n} = this.props;
		return (
			<div className={'Grid ' + (boom ? 'boom' : '')} style={{'--m': m, '--n': n}}>
			{
				matrix.map((row, i) => (
					row.map((cell, j) => (
						<div
							className={'cell ' + (revealed[i][j] ? 'cell-revealed' : '')}
							data-val={matrix[i][j]}
							onClick={() => this.onCellClick(i, j)}
						>{
							matrix[i][j]>0 ? matrix[i][j] :  
							matrix[i][j]=='*' ? '\u2739' :
							''
						}
						</div> 
					))
				))
			}
			</div>
		);
	}
}
 
export default Grid;



function generateMatrix(m, n, k) {
	const matrix = Array(m).fill(0).map(()=>Array(n).fill(0));

	// Add mines
	let mines = 0;
	while (mines <= k) {
		let i = Math.floor(Math.random() * m);
		let j = Math.floor(Math.random() * n);
		if (matrix[i][j] === 0) {
			matrix[i][j] = '*';
			mines++;
		}
	}

	// Add numbers
	for (let i=0; i<m; i++) {
		for (let j=0; j<n; j++) {
			if (matrix[i][j] === '*') continue; 
			let c = 0;
			if (matrix[i-1] && matrix[i-1][j-1] === '*') c++;
			if (matrix[i-1] && matrix[i-1][j  ] === '*') c++;
			if (matrix[i-1] && matrix[i-1][j+1] === '*') c++;

			if (matrix[i  ] && matrix[i  ][j-1] === '*') c++;
			if (matrix[i  ] && matrix[i  ][j+1] === '*') c++;

			if (matrix[i+1] && matrix[i+1][j-1] === '*') c++;
			if (matrix[i+1] && matrix[i+1][j  ] === '*') c++;
			if (matrix[i+1] && matrix[i+1][j+1] === '*') c++;
			if (c) {
				matrix[i][j] = c;
			}
		}
	}
	return matrix;
}

function generateRevealed(m, n) {
	return Array(m).fill(false).map(()=>Array(n).fill(false));
}

function isRevealComplete(matrix, revealed) {
	let [m, n] = [matrix.length, matrix[0].length];

	for (let i=0; i<m; i++) {
		for (let j=0; j<n; j++) {
			if (matrix[i][j] == 0 && revealed[i][j]) {
				if (
					(i>0 && j>0   && !revealed[i-1][j-1]) ||
					(i>0 &&          !revealed[i-1][j]  ) ||
					(i>0 && j<n-1 && !revealed[i-1][j+1]) ||
					
					(j>0   && !revealed[i][j-1]) ||
					(j<n-1 && !revealed[i][j+1]) ||
					
					(i<m-1 && j>0   && !revealed[i+1][j-1]) ||
					(i<m-1 &&          !revealed[i+1][j]  ) ||
					(i<m-1 && j<n-1 && !revealed[i+1][j+1])

					) return false;
			}
		}
	}
	return true;
}

function openAroundZeroes(matrix, revealed) {
	let [m, n] = [matrix.length, matrix[0].length];
	let newRevealed = [];
	for (let i=0; i<m; i++) {
		newRevealed[i] = revealed[i].slice();
	}
	for (let i=0; i<m; i++) {
		for (let j=0; j<n; j++) {
			if (matrix[i][j] == 0 && revealed[i][j]) {
				if(i>0 && j>0)   newRevealed[i-1][j-1] = true;
				if(i>0)          newRevealed[i-1][j]   = true;
				if(i>0 && j<n-1) newRevealed[i-1][j+1] = true;
				
				if(j>0)   newRevealed[i][j-1] = true;
				if(j<n-1) newRevealed[i][j+1] = true;
				
				if(i<m-1 && j>0)   newRevealed[i+1][j-1] = true;
				if(i<m-1)          newRevealed[i+1][j]   = true;
				if(i<m-1 && j<n-1) newRevealed[i+1][j+1] = true;
			}
		}
	}
	return newRevealed;
}

function openCells(i, j, matrix, revealed) {
	let newRevealed = [];
	for (let i=0; i<revealed.length; i++) {
		newRevealed[i] = revealed[i].slice();
	}
	newRevealed[i][j] = true;
	
	while (!isRevealComplete(matrix, newRevealed)) {
		newRevealed = openAroundZeroes(matrix, newRevealed);
	}

	return newRevealed;
}
