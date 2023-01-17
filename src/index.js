import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewApiService from './js/fetch-gallery';
import { renderGallery } from './js/templates/render-gallery';

const lightbox = new SimpleLightbox('.photo-card a');
const refs = {
  formRef: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  guardRef: document.querySelector('.js-guard'),
};
const api = new NewApiService();
let totalAmount; // sum of all pictures
let amountOfPages; // sum of all pages

// infinity scroll
const options = {
  root: null,
  rootMargin: '300px',
  threshold: 0,
};
const observer = new IntersectionObserver(onPagination, options);

refs.formRef.addEventListener('submit', onFormSubmit);

async function onFormSubmit(e) {
  e.preventDefault();

  api.query = e.currentTarget.elements.searchQuery.value;
  api.resetPage();
  const data = await api.fetchGallery();
  totalAmount = data.totalHits;
  amountOfPages = data.totalHits / 40;

  if (!data.hits.length) {
    clearInnerHTML();
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    clearInnerHTML();
    refs.galleryRef.innerHTML = renderGallery(data.hits);
    api.incrementPage();
    lightbox.refresh();
    observer.observe(refs.guardRef);

    // if (amountOfPages > 1) {
    //   showLoadMoreBtn();
    // }
  }
}

function onPagination(entires, observer) {
  entires.forEach(entry => {
    if (entry.isIntersecting) {
      api.fetchGallery().then(data => {
        if (api.page * 40 >= data.totalHits) {
          // hideLoadMoreBtn();
          observer.unobserve(refs.guardRef);
          Notify.info(
            `We're sorry, but you've reached the end of search results.`
          );
        } else {
          refs.galleryRef.insertAdjacentHTML(
            'beforeend',
            renderGallery(data.hits)
          );
          api.incrementPage();
          lightbox.refresh();
          const { height: cardHeight } =
            refs.galleryRef.firstElementChild.getBoundingClientRect();
          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          }); // smooth scroll
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
        }
      });
    }
  });
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.hidden = false;
  refs.loadMoreBtn.addEventListener('click', loadMore);
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.hidden = true;
}

// function loadMore() {
//   api.fetchGallery().then(data => {
//     if (api.page * 40 >= data.totalHits) {
//       hideLoadMoreBtn();
//       Notify.info(`We're sorry, but you've reached the end of search results.`);
//     } else {
//       refs.galleryRef.insertAdjacentHTML(
//         'afterbegin',
//         renderGallery(data.hits)
//       );
//       api.incrementPage();
//       lightbox.refresh();

//       const { height: cardHeight } =
//         refs.galleryRef.firstElementChild.getBoundingClientRect();
//       window.scrollBy({
//         top: cardHeight * 2,
//         behavior: 'smooth',
//       }); // smooth scroll

//       Notify.success(`Hooray! We found ${data.totalHits} images.`);
//     }
//   });
// }

function clearInnerHTML() {
  refs.galleryRef.innerHTML = '';
}
