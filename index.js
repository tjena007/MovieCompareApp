const autoCompleteConfig = {
	renderOption: (movie) => {
		const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
		return `
		<img src="${imgSrc}"> 
		${movie.Title} (${movie.Year})
		`;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(input) {
		const response = await axios.get('https://www.omdbapi.com/', {
			params: {
				apikey: '7a68c485',
				s: `${input}`
			}
		});
		if (response.data.Error) {
			return [];
		}
		return response.data.Search;
	}
};
let leftSide;
let rightSide;
createAutoComplete({
	root: document.querySelector('#left-autocomplete'),
	...autoCompleteConfig,
	onOptionSelect: (movie) => {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
	}
});
createAutoComplete({
	root: document.querySelector('#right-autocomplete'),
	...autoCompleteConfig,
	onOptionSelect: (movie) => {
		document.querySelector('.tutorial').classList.add('is-hidden');
		onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
	}
});

const onMovieSelect = async (movie, destination, side) => {
	//console.log(movie.imdbID);
	const response = await axios.get('https://www.omdbapi.com/', {
		params: {
			apikey: '7a68c485',
			i: `${movie.imdbID}`
		}
	});
	//console.log(response.data);
	//console.log(destination);
	destination.innerHTML = movieTemplate(response.data);
	if (side === 'left') {
		leftSide = response.data;
	} else {
		rightSide = response.data;
	}

	if (leftSide && rightSide) {
		runComparison();
	}
};
const runComparison = () => {
	const leftSideStats = document.querySelectorAll('#left-summary .notification');
	const rightSideStats = document.querySelectorAll('#right-summary .notification');

	//console.log(leftSideStats);
	leftSideStats.forEach((leftStat, index) => {
		const rightStat = rightSideStats[index];

		console.log(rightStat, index);

		const leftVal = leftStat.dataset.value;
		const rightVal = rightStat.dataset.value;
		if (rightVal > leftVal) {
			leftStat.classList.remove('is-primary');
			leftStat.classList.add('is-warning');
		}
		if (rightVal < leftVal) {
			rightStat.classList.remove('is-primary');
			rightStat.classList.add('is-warning');
		}
	});
};

const movieTemplate = (movieDetail) => {
	console.log(movieDetail);
	const dollar =
		movieDetail.BoxOffice === 'N/A' ? 0 : parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
	const metascore = movieDetail.Metascore === 'N/A' ? 0 : parseInt(movieDetail.Metascore);
	const imdbRating = movieDetail.imdbRating === 'N/A' ? 0 : parseFloat(movieDetail.imdbRating);
	const imdbVotes = movieDetail.imdbVotes === 'N/A' ? 0 : parseInt(movieDetail.imdbVotes.replace(/,/g, ''));

	let count = 0;
	const awards = movieDetail.Awards.split(' ').forEach((word) => {
		const value = parseInt(word);

		if (isNaN(value)) {
			return;
		} else {
			count += value;
		}
	});
	console.log(dollar, metascore, imdbRating, imdbVotes, count);

	return `
	<article class="media">
		<figure class="media-left">
			<p class="image">
				<img src="${movieDetail.Poster}">			
			</p>
		</figure>
		<div class="media-content">
			<div class="content">
				<h1>${movieDetail.Title}</h1>
				<h4>${movieDetail.Genre}</h4>
				<p>${movieDetail.Plot}</p>
			</div>
		</div>
	</article>
	<article data-value=${count} class="notification is-primary">
		<p class="title">${movieDetail.Awards}</p>
		<p class="subtitle">Awards</p>
	</article>
	<article data-value=${dollar} class="notification is-primary">
		<p class="title">${movieDetail.BoxOffice}</p>
		<p class="subtitle">BoxOffice</p>
	</article>
	<article data-value=${metascore} class="notification is-primary">
		<p class="title">${movieDetail.Metascore}</p>
		<p class="subtitle">Metascore</p>
	</article>
	<article data-value=${imdbRating} class="notification is-primary">
		<p class="title">${movieDetail.imdbRating}</p>
		<p class="subtitle">IMDB Rating</p>
	</article>
	<article data-value=${imdbVotes} class="notification is-primary">
		<p class="title">${movieDetail.imdbVotes}</p>
		<p class="subtitle">IMDB Votes</p>
	</article>
	`;
};
