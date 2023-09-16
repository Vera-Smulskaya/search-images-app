import { fetchImages } from './pixabay-api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const perPage = 40;
let simpleLightBox;

searchForm.addEventListener('submit', onSearchForm);

function renderMarkup(images) {
  if (!gallery) {
    return;
  }
  const markup = images
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
    <p class="info-item">
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>
 </a>`;
      }
    )
    .join();

  gallery.innerHTML = markup;
}

function onSearchForm(event) {
  event.preventDefault();
  let page = 1;
  let query = event.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  fetchImages(query, page, perPage)
    .then(data => {
      if (data.totalHits) {
        renderMarkup(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}
