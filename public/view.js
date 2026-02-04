document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');

    // Get Album ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('id');

    if (!albumId) {
        showError('No album ID provided.');
        return;
    }

    fetchImages(albumId);

    async function fetchImages(id) {
        try {
            const response = await fetch(`/api/album/${id}`);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Album not found.');
                }
                throw new Error('Failed to load images.');
            }

            const data = await response.json();

            if (!data.images || data.images.length === 0) {
                showError('No images found in this album.');
                return;
            }

            renderGallery(data.images);

        } catch (err) {
            showError(err.message);
        } finally {
            loading.style.display = 'none';
        }
    }

    function renderGallery(images) {
        images.forEach(imgUrl => {
            const item = document.createElement('div');
            item.className = 'grid-item';

            const img = document.createElement('img');
            img.src = imgUrl;
            img.loading = 'lazy';
            img.alt = 'Uploaded image';

            // Allow clicking to view full size (optional simple implementation)
            img.onclick = () => window.open(imgUrl, '_blank');
            img.style.cursor = 'pointer';

            item.appendChild(img);
            grid.appendChild(item);
        });
    }

    function showError(msg) {
        loading.style.display = 'none';
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
    }
});
