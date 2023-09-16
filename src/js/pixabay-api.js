const api_key = '39479425-6a3db35f3651c21ffc7f636b4';
const BASE_URL = 'https://pixabay.com/api/';
const inputValue = 'value from input';

export function fetchImages() {
  return fetch(
    `${BASE_URL}?api_key=${api_key}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    console.log(response.json());
    return response.json();
  });
}
