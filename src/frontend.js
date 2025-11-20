import GLightbox from 'glightbox';

/**
 * If DOM is ready, initialize the grid gallery.
 *
 * @since 0.1.0
 *
 * @return void
 */
if ('loading' === document.readyState) {
	document.addEventListener('DOMContentLoaded', initializeGridGallery);
} else {
	initializeGridGallery();
}

/**
 * Initialize the grid gallery.
 *
 * @since 0.1.0
 *
 * @return void
 */
function initializeGridGallery() {
	const galleries = document.querySelectorAll('.wp-block-mai-grid-gallery');
	const instances = new Map();

	/**
	 * Initialize GLightbox for a gallery.
	 *
	 * @since 0.1.0
	 *
	 * @param {HTMLElement} galleryEl - The gallery container element
	 *
	 * @return void
	 * @param {HTMLElement} galleryEl - The gallery container element
	 */
	const initializeLightbox = (galleryEl) => {
		// Map gallery items to GLightbox elements configuration.
		const elements = Array.from(galleryEl.querySelectorAll('figure')).map(figure => {
			const media = figure.querySelector('img, video');
			const description = figure.querySelector('figcaption');
			if (!media) return null;

			return {
				href: media.src,
				description: description ? description.textContent : '',
			};
		}).filter(Boolean);

		// Initialize GLightbox with configuration.
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

		// Add slide information to each slide.
		lightbox.on('slide_before_load', (data) => {
			const { slideIndex, slideNode } = data;
			slideNode.dataset.slideIndex    = slideIndex + 1;
			slideNode.dataset.totalSlides   = elements.length;
		});

		// Store lightbox instance for cleanup.
		instances.set(galleryEl, lightbox);

		// Add click handlers to gallery items.
		galleryEl.querySelectorAll('figure').forEach((figure, index) => {
			figure.style.cursor = 'pointer';
			figure.addEventListener('click', (e) => {
				e.preventDefault();
				lightbox.openAt(index);
			});
		});
	};

	// Initialize lightbox for all galleries on the page.
	galleries.forEach(galleryEl => {
		initializeLightbox(galleryEl);
	});

	// Clean up on page unload.
	window.addEventListener('unload', () => {
		instances.forEach(instance => instance.close());
		instances.clear();
	});
}