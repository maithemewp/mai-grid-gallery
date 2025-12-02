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
			const media       = figure.querySelector('img, video');
			const description = figure.querySelector('figcaption');

			// Bail if no media.
			if ( ! media ) {
				return null;
			}

			return {
				height: media.height || '600',
				width: media.width || '800',
				href: media.dataset.src,
				srcset: media.srcset,
				sizes: media.sizes,
				alt: media.alt,
				description: description ? description.textContent.trim() : '',
			};
		}).filter(Boolean);

		// Get hidden elements.
		const hiddenElements     = galleryEl.querySelectorAll('span.mai-grid-gallery-hidden');
		const hiddenElementsData = Array.from(hiddenElements).map(hiddenElement => {
			return {
				src: hiddenElement.dataset.src,
				srcset: hiddenElement.dataset.srcset,
				sizes: hiddenElement.dataset.sizes,
				alt: hiddenElement.dataset.alt,
				caption: hiddenElement.dataset.caption,
			};
		});

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

		// If hidden elements.
		if ( hiddenElementsData.length > 0 ) {
			// Loop through and add hidden elements to the lightbox.
			hiddenElementsData.forEach(hiddenElement => {
				lightbox.insertSlide({
					href: hiddenElement.src,
					srcset: hiddenElement.srcset,
					sizes: hiddenElement.sizes,
					alt: hiddenElement.alt,
					description: hiddenElement.caption,
				});
			});
		}

		// Add slide information to each slide.
		lightbox.on('slide_before_load', (data) => {
			const { slideIndex, slideNode } = data;
			slideNode.dataset.slideIndex  = slideIndex + 1;
			slideNode.dataset.totalSlides = elements.length;
		});

		// Set width/height of image after it is loaded.
		// We hit weirdness with WP's `img:is([sizes="auto" i], [sizes^="auto," i]) { contain-intrinsic-size: 3000px 1500px }`
		lightbox.on('slide_after_load', (data) => {
			const img = data.slideNode.querySelector('img');
			if ( img ) {
				if ( ! img.getAttribute('width') ) {
					img.setAttribute('width', img.naturalWidth);
				}
				if ( ! img.getAttribute('height') ) {
					img.setAttribute('height', img.naturalHeight);
				}
			}
		});

		// Store lightbox instance for cleanup.
		instances.set(galleryEl, lightbox);

		// Add click handlers to gallery items.
		galleryEl.querySelectorAll('figure').forEach((figure, index) => {
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