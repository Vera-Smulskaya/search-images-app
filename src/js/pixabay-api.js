import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const api_key = '39479425-6a3db35f3651c21ffc7f636b4';

export async function fetchImages(query, page, perPage) {
  const response = await axios.get(
    `?key=${api_key}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response.data;
}
