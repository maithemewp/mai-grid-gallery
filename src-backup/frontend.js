import GLightbox from 'glightbox';

/**
 * Frontend JavaScript for the grid gallery
 * Initializes GLightbox for image lightbox functionality
 */
document.addEventListener('DOMContentLoaded', () => {
	const galleries = document.querySelectorAll('.wp-block-mai-grid-gallery');
	const lightboxInstances = new Map(); // Store GLightbox instances

	/**
	 * Initialize GLightbox for a gallery
	 * @param {HTMLElement} galleryEl - The gallery container element
	 */
	const initializeLightbox = (galleryEl) => {
		// Map gallery items to GLightbox elements configuration
		const elements = Array.from(galleryEl.querySelectorAll('figure')).map(figure => {
			const media = figure.querySelector('img, video');
			const description = figure.querySelector('figcaption');
			if (!media) return null;

			return {
				href: media.src,
				description: description ? description.textContent : '',
			};
		}).filter(Boolean);

		// Initialize GLightbox with configuration
		const lightbox = GLightbox({
			elements,
			touchNavigation: true,
			loop: true,
			autoplayVideos: true,
			openEffect: 'fade',
			closeEffect: 'fade',
			cssEfects: {
				fade: { in: 'fadeIn', out: 'fadeOut' },
			}
		});

		// Add slide information to each slide
		lightbox.on('slide_before_load', (data) => {
			const { slideIndex, slideNode } = data;
			slideNode.dataset.slideIndex = slideIndex + 1;
			slideNode.dataset.totalSlides = elements.length;
		});

		// Store lightbox instance for cleanup
		lightboxInstances.set(galleryEl, lightbox);

		// Add click handlers to gallery items
		galleryEl.querySelectorAll('figure').forEach((figure, index) => {
			figure.style.cursor = 'pointer';
			figure.addEventListener('click', (e) => {
				e.preventDefault();
				lightbox.openAt(index);
			});
		});
	};

	// Initialize lightbox for all galleries on the page
	galleries.forEach(galleryEl => {
		initializeLightbox(galleryEl);
	});

	// Clean up on page unload
	window.addEventListener('unload', () => {
		lightboxInstances.forEach(instance => instance.close());
		lightboxInstances.clear();
	});
});