import { fetchImages } from './pixabay-api';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const perPage = 40;
let page = 1;
const simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let query = '';

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', onClickLoadMore);

function renderMarkup(data) {
  const markup = data
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
  page = 1;

  if (query === '') {
    Notiflix.Notify.failure('The search string cannot be empty.');
    hideLoadMoreBtn();
    return;
  }

  hideLoadMoreBtn();

  try {
    const data = await fetchImages(query, 1, perPage);

    Notiflix.Notify.info(`We found ${data.totalHits} results`);
    if (data.totalHits) {
      renderMarkup(data.hits);
      simpleLightBox.refresh();
      if (shouldShowLoadMoreBtn(data)) {
        showLoadMoreBtn();
      }
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      searchForm.reset();
      gallery.innerHTML = '';
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

  try {
    const data = await fetchImages(query, page, perPage);
    renderMarkup(data.hits);
    simpleLightBox.refresh();

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
