const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    //dentro de axios podemos enviar tanto headers como params por defecto
    headers: {
        'Content-type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY
    }
})

function likedMoviesList() {

    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item
    }else {
        movies= {}
    }

    return movies
}

function likeMovie(movie) {
    
    const likedMovies = likedMoviesList()

    console.log(likedMovies);
    if (likedMovies[movie.id]) {
        likedMovies[movie.id]= undefined
    } else {
        likedMovies[movie.id] = movie
    }

    localStorage.setItem('liked_movies',JSON.stringify(likedMovies))
    getLikedMovies()
    getTrendingMoviesPreview()
}

//UTILS

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // console.log(entry.target);
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src', url)
        }
    });
})

function createMovies(
    container,
    movies,
    { lazyLoad = false, clean = true } = {}
) {
    if (clean) {
        container.innerHTML = '';
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            `https://image.tmdb.org/t/p/w300${movie.poster_path}`)
        
        const movieBtn = document.createElement('button')
        movieBtn.classList.add('movie-btn')

        likedMoviesList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
        movieBtn.addEventListener('click',()=>{
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie)
            
        })

        if (lazyLoad) {
            lazyLoader.observe(movieImg)
        }
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute('src', `https://via.placeholder.com/300x450/788199/ffffff?text=Id=${movie.id}`)
            movieImg.style = ' height: 258px;'
        })

        movieImg.addEventListener('click', () => {
            location.hash = `movie=${movie.id}`
        })

        const divDetails = document.createElement('div')
        const nameMoviparagraph = document.createElement('p')
        const valorationMovieparagraph = document.createElement('p')
        const textValoration = document.createTextNode('Valoracion')
        const numValoration = document.createTextNode(`★ ${movie.vote_average}`)
        nameMoviparagraph.appendChild(textValoration)
        valorationMovieparagraph.appendChild(numValoration)
        divDetails.appendChild(nameMoviparagraph)
        divDetails.appendChild(valorationMovieparagraph)


        movieContainer.appendChild(movieImg)
        movieContainer.appendChild(divDetails)
        movieContainer.appendChild(movieBtn)
        container.appendChild(movieContainer)

    });
}

function createCategories(container, categories) {
    container.innerHTML = ''


    categories.forEach(category => {
        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add("category-container")

        const categoryTitle = document.createElement('h3')
        categoryTitle.classList.add('category-title')
        categoryTitle.setAttribute('id', 'id' + category.id)
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`
        })

        const categoryTitleText = document.createTextNode(category.name)

        categoryTitle.appendChild(categoryTitleText)
        categoryContainer.appendChild(categoryTitle)
        container.appendChild(categoryContainer)
    });
}

//UTILIZAMOS FETCH
async function getTrendingMoviesPreview() {
    const res = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
    const data = await res.json()
    const movies = data.results

    createMovies(trendingMoviesPreviewList, movies, { lazyLoad: true, clean: true })
}

//UTILIZAMOS AXIOS EN LAS DEMAS
async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list',{
        params:{
            "language":idiomaNavegador || 'en'
        }
    })
    const categories = data.genres
    createCategories(categoriesPreviewList, categories)
}

async function getMoviesByCategory(id) {
    const { data } = await api(`discover/movie`, {
        params: {
            with_genres: id
        }
    })

    const movies = data.results;
    maxPage = data.total_pages

    createMovies(genericSection, movies, { lazyLoad: true, clean: true })

}

async function getPaginatedMovieByCategory(id) {

    const { scrollTop, clientHeight, scrollHeight } = document.documentElement

    const scrollIsButtom = (scrollTop + clientHeight) >= (scrollHeight - 15)

    const pageIsNotMax = page < maxPage

    if (scrollIsButtom && pageIsNotMax) {
        page++

        const { data } = await api(`discover/movie`, {
            params: {
                with_genres: id,
                page
            }
        })
        const movies = data.results

        createMovies(genericSection, movies, { lazyLoad: true, clean: false })

    }
}

async function getMoviesBySearch(query) {
    const { data } = await api(`search/movie`, {
        params: {
            query
        }
    })
    const movies = data.results;
    maxPage = data.total_pages
    createMovies(genericSection, movies)
}

function getPaginatedMoviesBySearch(query) {
   return async function () {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement
    const scrollIsButtom = (scrollTop + clientHeight) >= (scrollHeight - 15)
    const pageIsNotMax = page < maxPage
    if (scrollIsButtom && pageIsNotMax) {
        page++
        const { data } = await api(`search/movie`, {
            params: {
                query,
                page
            }
        })
        const movies = data.results;
        createMovies(genericSection,  movies, { lazyLoad: true, clean: false })
    }
   }
}

async function getTrendingMovies() {
    const { data } = await api(`trending/movie/day`)

    const movies = data.results
    
    maxPage = data.total_pages

    headerCategoryTitle.innerHTML = 'Tendencias'
    createMovies(genericSection, movies, { lazyLoad: true, clean: true })

    // const btnLoadMore = document.createElement('button')
    // btnLoadMore.innerText = 'Cargar mas'
    // genericSection.appendChild(btnLoadMore)
    // btnLoadMore.addEventListener('click', () => { btnLoadMore.remove(), getPaginatedTrendingMovies() })

}

async function getPaginatedTrendingMovies() {

    const { scrollTop, clientHeight, scrollHeight } = document.documentElement

    const scrollIsButtom = (scrollTop + clientHeight) >= (scrollHeight - 15)

    const pageIsNotMax = page < maxPage

    if (scrollIsButtom && pageIsNotMax) {
        page++

        const { data } = await api(`trending/movie/day`, {
            params: {
                page: page
            }
        })
        const movies = data.results

        createMovies(genericSection, movies, { lazyLoad: true, clean: false })

    }


    // const btnLoadMore = document.createElement('button')
    // btnLoadMore.innerText = 'Cargar mas'
    // genericSection.appendChild(btnLoadMore)
    // btnLoadMore.addEventListener('click', () => { btnLoadMore.remove(), getPaginatedTrendingMovies() })
}

async function getMovieById(id) {
    const data = await api(`movie/${id}`,{
        params:{
            "language":idiomaNavegador || 'en'
        }
    })
    const movie = data.data
   
    
    const movieImgUrl = `https://image.tmdb.org/t/p/w300/${movie.poster_path}`
    headerSection.style.background = `
    linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%),
    url(${movieImgUrl})
    `
    movieDetailTitle.textContent = movie.title
    movieDetailDescription.textContent = movie.overview
    movieDetailScore.textContent = movie.vote_average

    createCategories(movieDetailCategoriesList, movie.genres)
    getRelatedMoviesId(id)

}

async function getRelatedMoviesId(id) {
    const data = await api(`movie/${id}/recommendations`)
    const movies = data.data.results
    if (movies.length > 0) {
        createMovies(relatedMoviesContainer, movies)
    }
}

function getLikedMovies() {
   const likedMovies = likedMoviesList()
   const moviesArray = Object.values(likedMovies)
   

   createMovies(likedMoviesListArticle, moviesArray, { lazyLoad: true, clean: true })
    
}

