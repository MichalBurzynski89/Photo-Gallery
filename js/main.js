window.addEventListener('DOMContentLoaded', async () => {

  const URL = 'http://www.splashbase.co/api/v1/images/search?query=tree';

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

  const handleCloseButtonClick = () => {

    const gallery = document.querySelector('.gallery');
    const imageZoomOverlay = document.querySelector('.gallery__image-zoom-overlay');
    gallery.removeChild(imageZoomOverlay);

  }

  const createImageZoom = (src, alt) => {

    const gallery = document.querySelector('.gallery');

    const imageZoomOverlay = document.createElement('div');
    const container = document.createElement('div');
    const closeButton = document.createElement('i');
    const image = document.createElement('img');

    imageZoomOverlay.classList.add('gallery__image-zoom-overlay');
    container.classList.add('container-image-zoom-overlay');
    closeButton.className = 'fa fa-times cross-mark';
    image.className = 'image image--large';
    image.setAttribute('src', src);
    image.setAttribute('alt', alt + ' Zoomed-in');

    closeButton.addEventListener('click', handleCloseButtonClick);

    container.appendChild(closeButton);
    container.appendChild(image);
    imageZoomOverlay.appendChild(container);
    gallery.appendChild(imageZoomOverlay);

  }

  const displayImages = (images, startIdx, endIdx = startIdx + 10) => {

    const gallery = document.querySelector('.gallery');

    const loader = document.querySelector('.gallery__loader');
    loader.style.display = 'none';

    const imageCollection = document.createElement('div');
    imageCollection.classList.add('gallery__images');

    for (let i = startIdx, j = 1; i < endIdx; i++ , j++) {

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

      container.appendChild(provider);
      container.appendChild(image);
      container.addEventListener('click', createImageZoom.bind(this, url, alt));
      imageCollection.appendChild(container);

    }

    gallery.appendChild(imageCollection);

  }

  const images = await fetchImages(URL);
  console.log(images);

  displayImages(images, 0);

});