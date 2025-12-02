/**
 * WordPress dependencies.
 */
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { upload as icon } from '@wordpress/icons';

/**
 * Internal dependencies.
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';

/**
 * Register the Grid Gallery Item block.
 * This block represents a single image or video within a grid gallery.
 */
registerBlockType(metadata.name, {
	...metadata,
	icon,
	edit,
	save,
	/**
	 * Block transforms configuration.
	 * Allows converting core/image blocks to gallery item blocks.
	 */
	transforms: {
		from: [
			{
				type: 'block',
				blocks: ['core/image'],
				/**
				 * Transform function to convert core/image blocks to mai/grid-gallery-item.
				 * Extracts image data from the image block and creates a gallery item block.
				 *
				 * @param {Object} attributes - The core/image block attributes.
				 * @return {Object} A new mai/grid-gallery-item block.
				 */
				transform: (attributes) => {
					/**
					 * Get the image ID from the block attributes.
					 * This is the WordPress attachment ID.
					 */
					const imageId = attributes.id;

					/**
					 * If we have an image ID, try to get full media data from the core store.
					 * This provides the full-size URL and other metadata.
					 */
					if (imageId) {
						const coreSelect = select('core');
						const media      = coreSelect.getMedia(imageId);

						if (media) {
							/**
							 * Get the full size image URL.
							 * Try multiple possible URL locations in the media object.
							 */
							const url = media.source_url || media.media_details?.sizes?.full?.source_url || media.url || '';

							/**
							 * Get caption - handle both object and string formats.
							 * WordPress media captions can be stored as objects with a 'raw' property or as plain strings.
							 */
							let caption = '';
							if (media.caption) {
								caption = typeof media.caption === 'string' ? media.caption : media.caption.raw || '';
							}

							/**
							 * Create gallery item block with media data from the store.
							 */
							return createBlock('mai/grid-gallery-item', {
								id: media.id,
								url: url,
								type: 'image',
								alt: media.alt_text || attributes.alt || '',
								caption: caption || attributes.caption || '',
							});
						}
					}

					/**
					 * Fallback: Create gallery item block using attributes from the image block.
					* This handles cases where media isn't in the store or there's no attachment ID.
					*/
					return createBlock('mai/grid-gallery-item', {
						id: imageId || 0,
						url: attributes.url || '',
						type: 'image',
						alt: attributes.alt || '',
						caption: attributes.caption || '',
					});
				},
			},
		],
	},
});
