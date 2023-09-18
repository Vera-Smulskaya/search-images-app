import { fetchImages } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const perPage = 40;
let page = 1;
let simpleLightBox;
let query = '';
let loadedData = [];

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onClickLoadMore);

function renderMarkup() {
  if (!loadedData.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    searchForm.reset();
    gallery.innerHTML = '';
    return;
  }

  const markup = loadedData
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="gallery__link" href="${largeImageURL}">
        <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">Likes: 
      <b>${likes}</b>
    </p>
    <p class="info-item">Views: 
      <b>${views}</b>
    </p>
    <p class="info-item">Comments: 
      <b>${comments}</b>
    </p>
    <p class="info-item">Downloads: 
      <b>${downloads}</b>
    </p>
  </div>
</div>
 </a>`;
      }
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

async function onSearchForm(event) {
  event.preventDefault();
  query = event.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure('The search string cannot be empty.');
    return;
  }

  hideLoadMoreBtn();

  try {
    const data = await fetchImages(query, 1, perPage);
    Notiflix.Notify.info(`We found ${data.totalHits} results`);
    if (data.totalHits) {
      loadedData = data.hits;
      renderMarkup();
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      if (shouldShowLoadMoreBtn(data)) {
        showLoadMoreBtn();
      }
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
    console.error(error);
  } finally {
    loadMoreBtn.disabled = false;
  }
}

async function onClickLoadMore() {
  page += 1;
  simpleLightBox.destroy();

  try {
    const data = await fetchImages(query, page, perPage);
    loadedData = [...loadedData, ...data.hits];
    renderMarkup();
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();

    if (!shouldShowLoadMoreBtn(data)) {
      hideLoadMoreBtn();
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
    console.error(error);
  }
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('is-hidden');
}

function shouldShowLoadMoreBtn(data) {
  const totalPages = Math.ceil(data.totalHits / perPage);
  return page < totalPages;
}
