import { Notify } from 'notiflix';
import NewApiService from './js/fetch-gallery';

const refs = {
  formRef: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const api = new NewApiService();
let images = []; // array of imgs for markup
let totalAmount; // sum of all pictures
let amountOfPages; // sum of all pages

refs.formRef.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();

  api.query = e.currentTarget.elements.searchQuery.value;
  api.resetPage();
  api
    .fetchGallery()
    .then(data => {
      totalAmount = data.totalHits;
      amountOfPages = data.totalHits / 40;
      images = [];

      if (!data.hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        for (const image of data.hits) {
          images.push(image);
        }
        clearInnerHTML();
        renderGallery(images);

        if (amountOfPages > 1) {
          showLoadMoreBtn();
        }
      }
    })
    .catch(console.log);
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.hidden = false;
  refs.loadMoreBtn.addEventListener('click', loadMore);
}

function loadMore() {
  api.fetchGallery().then(data => {
    for (const image of data.hits) {
      images.push(image);
    }
    renderGallery(images);
  });
}

function clearInnerHTML() {
  refs.galleryRef.innerHTML = '';
}

// function onFormSubmit(e) {
//   e.preventDefault();
//   resetPage();
//   refs.galleryListRef.innerHTML = '';

//   fetchGallery(page)
//     .then(resp => {
//       totalAmount = resp.total;
//       amountOfPages = resp.total / 20;

//       if (!resp.hits.length) {
//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//       } else {
//         for (const image of resp.hits) {
//           images.push(image);
//         }
//         renderGallery(images);
//       }
//     })
//     .catch(console.log);
// }

function renderGallery(arr) {
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card"><img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info">
      <p class="info-item"><b>Likes</b>
        ${likes}
      </p>
      <p class="info-item"><b>Views</b>
        ${views}
      </p>
      <p class="info-item"><b>Comments</b>
        ${comments}
      </p>
      <p class="info-item"><b>Downloads</b>
        ${downloads}  
    </div>
</div>`
    )
    .join('');

  refs.galleryRef.insertAdjacentHTML('beforeend', markup);

  //   if (images.length === totalAmount) {
  //     return;
  //   } else {
  //     refs.galleryBtnRef.hidden = false;
  //   }
}

// function loadMore() {
//   incrementPage();

//   if (page === amountOfPages) {
//     refs.galleryBtnRef.hidden = true;
//   } else {
//     fetchGallery(page)
//       .then(resp => {
//         for (const image of resp.hits) {
//           images.push(image);
//         }
//         renderGallery(images);
//       })
//       .catch(console.log);
//   }
// }
