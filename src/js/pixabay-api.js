import axios from 'axios';
import Notiflix from 'notiflix';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const api_key = '39479425-6a3db35f3651c21ffc7f636b4';

export async function fetchImages(query, page, perPage) {
  try {
    const params = new URLSearchParams({
      key: api_key,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    });
    const response = await axios.get(`?${params}`);
    return response.data;
  } catch (error) {
    Notiflix.Notify.failure(error.message);
    console.error(error);
  }
}
