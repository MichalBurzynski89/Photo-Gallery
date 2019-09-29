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

  const displayImages = (images, startIdx, endIdx) => {

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

      image.setAttribute('src', url);
      image.setAttribute('alt', `Photo Gallery Image #${id}`);

      container.appendChild(provider);
      container.appendChild(image);
      imageCollection.appendChild(container);

    }

    gallery.appendChild(imageCollection);

  }

  const images = await fetchImages(URL);
  console.log(images);

  displayImages(images, 0, 10);

});