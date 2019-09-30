window.addEventListener('DOMContentLoaded', async () => {

  const URL = 'http://www.splashbase.co/api/v1/images/search?query=tree';
  let startingIndex = 0;

  const fetchImages = async url => {

    const response = await fetch(url);
    const fetchedImages = response.ok ? await response.json() : [];
    const images = Array.isArray(fetchedImages) ? fetchedImages : fetchedImages.images.map((img, idx) => {
      const { url, site } = img;
      const image = {
        id: idx + 1,
        url,
        providerName: site
      };
      return image;
    });

    return images;

  }

  const displayImages = (images, isLoaded = false) => {

    if (!images.length || !Array.isArray(images)) throw new Error('Oops, something went wrong...');

    if (startingIndex < 0) startingIndex = 0;
    const endIdx = startingIndex + 10;

    const gallery = document.querySelector('.gallery');

    const loader = document.querySelector('.gallery__loader');
    loader.style.display = 'none';

    const imageCollection = document.createElement('div');
    imageCollection.classList.add('gallery__images');

    for (let i = startingIndex, j = 1; i < endIdx; i++ , j++ , startingIndex++) {

      if (i >= images.length) break;
      const { id, url, providerName } = images[i];

      const container = document.createElement('div');
      const provider = document.createElement('span');
      const image = document.createElement('img');

      container.classList.add('container-image');
      provider.classList.add('image-provider-name');
      provider.textContent = `#${providerName}`;
      image.classList.add('image');

      if (j === 5 || j === 9) {
        container.classList.add('container-image--wide');
      } else if (j === 8 || j === 10) {
        container.classList.add('container-image--portrait-version');
      }

      const alt = `Photo Gallery Image #${id}`;
      image.setAttribute('src', url);
      image.setAttribute('alt', alt);

      container.setAttribute('aria-label', 'Zoom-in');
      container.appendChild(provider);
      container.appendChild(image);
      container.addEventListener('click', createImageZoom.bind(null, url, alt));
      imageCollection.appendChild(container);

    }

    const showMoreButton = document.querySelector('.gallery__button');

    isLoaded ? gallery.insertBefore(imageCollection, showMoreButton) : gallery.appendChild(imageCollection);
    if (startingIndex >= images.length) gallery.removeChild(showMoreButton);

  }

  const createShowMoreButton = (addListener, images) => {

    const gallery = document.querySelector('.gallery');

    const button = document.createElement('button');
    const loader = document.createElement('div');

    button.className = 'button gallery__button';
    button.textContent = 'Show More';
    loader.className = 'gallery__loader gallery__loader--small';

    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot dot--small';
      loader.appendChild(dot);
    }

    loader.style.display = 'none';

    addListener(button, images);

    button.appendChild(loader);
    gallery.appendChild(button);

  }

  const addListenerToShowMoreButton = (button, images) => {

    button.addEventListener('click', () => {
      const spinner = document.querySelector('.gallery__loader--small');

      spinner.style.display = 'block';
      button.style.textIndent = '-10000px';

      setTimeout(() => {
        spinner.style.display = 'none';
        button.style.textIndent = '0px';
      }, 500);

      displayImages(images, true);

    });

  }

  const createImageZoom = (src, alt) => {

    const gallery = document.querySelector('.gallery');

    const imageZoomOverlay = document.createElement('div');
    const container = document.createElement('div');
    const closeButton = document.createElement('button');
    const image = document.createElement('img');

    imageZoomOverlay.classList.add('gallery__image-zoom-overlay');
    container.classList.add('container-image-zoom-overlay');
    closeButton.className = 'fa fa-times cross-mark';
    closeButton.setAttribute('aria-label', 'Close');
    image.className = 'image image--large';
    image.setAttribute('src', src);
    image.setAttribute('alt', alt + ' Zoomed-in');

    closeButton.addEventListener('click', handleCloseButtonClick);

    container.appendChild(closeButton);
    container.appendChild(image);
    imageZoomOverlay.appendChild(container);
    gallery.appendChild(imageZoomOverlay);

  }

  const handleCloseButtonClick = () => {

    const gallery = document.querySelector('.gallery');
    const imageZoomOverlay = document.querySelector('.gallery__image-zoom-overlay');
    gallery.removeChild(imageZoomOverlay);

  }

  const images = await fetchImages(URL);
  console.log(images);

  displayImages(images);
  createShowMoreButton(addListenerToShowMoreButton, images);

});