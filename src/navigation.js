let page = 1;
let maxPage;
let infiniteScroll;
let idiomaNavegador = JSON.parse(localStorage.getItem('language'))

selectLanguagesOptions.addEventListener('change',()=>{
    localStorage.setItem('language',JSON.stringify(selectLanguagesOptions.value))
    setInterval(() => {
     location.reload()
    }, 300);
     
 })

searchFormBtn.addEventListener('click', () => {

    if (searchFormInput.value) {
        location.hash = `#search=${searchFormInput.value}`
        headerTitle.textContent = `Buscaste: ${searchFormInput.value}`
    } else {
        searchFormInput.style = 'border: 1px solid var(--red);'
        searchFormInput.placeholder = 'Por favor, ingresa el título'
        setTimeout(() => {
            searchFormInput.style = ''
            searchFormInput.placeholder = 'Buscar'


        }, 1000);
    }

    searchFormInput.value = ''


});

trendingBtn.addEventListener('click', () => {

    location.hash = '#trends='

});

arrowBtn.addEventListener('click', () => {

    history.back();
    headerTitle.textContent = ''
    // location.hash = '#home';

});


window.addEventListener('DOMContentLoaded', navigatorPage, false);
window.addEventListener('hashchange', navigatorPage, false);
window.addEventListener('scroll',infiniteScroll,{passive:false});

function navigatorPage() {
    
    if (infiniteScroll) {
        window.removeEventListener('scroll',infiniteScroll,{passive:false});
        infiniteScroll = undefined
    }


    if (location.hash.startsWith('#trends=')) {
        trendsPage()
    } else if (location.hash.startsWith('#search=')) {
        searchPage()
    } else if (location.hash.startsWith('#movie=')) {
        movieDetaiilsPage()
    } else if (location.hash.startsWith('#category=')) {
        categoriesPage()
    } else {
        homePage()
        headerTitle.textContent = `Movies`

    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (infiniteScroll) {
        window.addEventListener('scroll',infiniteScroll,{passive:false});
    }

}

function homePage() {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    selectLanguages.classList.remove('inactive')

    getTrendingMoviesPreview()
    getCategoriesPreview()
    getLikedMovies()
}
function categoriesPage() {


    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    selectLanguages.classList.add('inactive')

    const [_, categoryData] = location.hash.split('=')
    const [categoryId, categoryName] = categoryData.split('-')

    headerCategoryTitle.innerHTML = categoryName


    getMoviesByCategory(categoryId)

    infiniteScroll = ()=>{getPaginatedMovieByCategory(categoryId)}

}
function movieDetaiilsPage() {


    headerSection.classList.add('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');
    selectLanguages.classList.add('inactive')

    const [_, movieId] = location.hash.split('=')
    getMovieById(movieId)

}
function searchPage() {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    selectLanguages.classList.add('inactive')

    const [_, query] = location.hash.split('=')

    getMoviesBySearch(query)

    infiniteScroll= getPaginatedMoviesBySearch(query)

}
function trendsPage() {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    selectLanguages.classList.add('inactive')

    getTrendingMovies()
    infiniteScroll = getPaginatedTrendingMovies

}