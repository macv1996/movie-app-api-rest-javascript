
async function getTrendingPreview() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
    const data = await res.json()
    const movies = data.results
    
    movies.forEach(movi => {
        const trendingPreviewMovieList = document.querySelector('.trendingPreview-movieList')
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        
        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt',movi.title);
        movieImg.setAttribute('src',`https://image.tmdb.org/t/p/w300${movi.backdrop_path}`)
        
        
        movieContainer.appendChild(movieImg)
        trendingPreviewMovieList.appendChild(movieContainer)
    });
}
getTrendingPreview()