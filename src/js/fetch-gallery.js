// export function fetchGallery(page = 1) {
//   const BASE_URL = 'https://pixabay.com/api';
//   const API_KEY = '32896163-5a08927168932cddf0e5a890d';

//   return fetch(
//     `${BASE_URL}/?key=${API_KEY}&q=${}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=20`
//   )
//     .then(resp => {
//       if (!resp.ok) {
//         throw new Error(resp.statusText);
//       } else {
//         return resp.json();
//       }
//     })
//     .catch(console.log);
// }

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '32896163-5a08927168932cddf0e5a890d';

export default class NewApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchGallery() {
    return fetch(
      `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    )
      .then(res => {
        if (!res.ok) {
          throw new Error(res.statusText);
        } else {
          return res.json();
        }
      })
      .then(data => {
        this.incrementPage();

        return data;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
