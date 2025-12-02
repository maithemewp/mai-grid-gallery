/**
 * WordPress dependencies.
 * These are the core WordPress packages needed for block development.
 */
import { registerBlockType, createBlock } from '@wordpress/blocks';
import {
	useBlockProps,
	useInnerBlocksProps,
	InnerBlocks,
	InspectorControls,
	BlockControls,
	MediaPlaceholder,
	MediaReplaceFlow,
} from '@wordpress/block-editor';
import { gallery as icon, seen, unseen } from '@wordpress/icons';
import { PanelBody, ToolbarGroup, ToolbarButton, RangeControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect, useDispatch, select } from '@wordpress/data';
import { View } from '@wordpress/primitives';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 * Import the block metadata and register the gallery item block.
 */
import metadata from '../block/grid-gallery/block.json';
import '../block/grid-gallery-item/index.js';

/**
 * Add gallery icon to metadata.
 * This sets the icon that appears in the block inserter.
 */
metadata.icon = icon;

/**
 * Register the Grid Gallery block.
 * This is the main gallery container block that holds gallery item blocks.
 */
registerBlockType('mai/grid-gallery', {
	...metadata,
	/**
	 * Edit component for the grid gallery block.
	 * This function renders the block in the editor.
	 *
	 * @param {Object} props - The component props.
	 * @param {string} props.clientId - The unique ID of this block instance.
	 * @param {Object} props.attributes - The block's saved attributes.
	 * @param {Function} props.setAttributes - Function to update block attributes.
	 * @return {JSX.Element} The rendered edit component.
	 */
	edit: ({ clientId, attributes, setAttributes }) => {
		/**
		 * Editor-only state for showing/hiding extra images.
		 * This state is only used in the editor and doesn't affect the saved content.
		 */
		const [editorShowAll, setEditorShowAll] = useState(false);

		/**
		 * Get the inner blocks (gallery items) and count from the block editor store.
		 * useSelect is a React hook that subscribes to WordPress data store changes.
		 */
		const { innerBlocks, blockCount } = useSelect(
			(select) => {
				const { getBlock } = select('core/block-editor');
				const block = getBlock(clientId);
				return {
					innerBlocks: block?.innerBlocks || [],
					blockCount: block?.innerBlocks?.length || 0,
				};
			},
			[clientId]
		);

		/**
		 * Get functions to insert and replace inner blocks.
		 * useDispatch provides functions to modify the block editor state.
		 */
		const { insertBlocks, replaceInnerBlocks } = useDispatch('core/block-editor');

		/**
		 * Calculate gallery state variables.
		 * These determine what UI elements to show and how many items are visible.
		 */
		const hasInnerBlocks  = blockCount > 0;
		const visibleImages   = attributes.maxVisible ? attributes.maxVisible : Math.min(blockCount, 8);
		const hasHiddenImages = blockCount > visibleImages;

		/**
		 * Get block props with data attributes for styling and JavaScript.
		 * useBlockProps provides the standard block wrapper attributes.
		 */
		const blockProps = useBlockProps({
			'data-count': blockCount,
			'data-visible': visibleImages,
		});

		/**
		 * Extract media IDs from all inner blocks that have an ID.
		 * This is used for the MediaReplaceFlow component.
		 */
		const mediaIds = innerBlocks
			.filter((block) => block.attributes?.id)
			.map((block) => block.attributes.id);
		const hasMediaIds = mediaIds.length > 0;

		/**
		 * Handle media selection from the media library or file upload.
		 * This function processes selected media and creates gallery item blocks.
		 *
		 * @param {Array|FileList} media - The selected media items or file list.
		 * @return {void}
		 */
		const handleMediaSelect = (media) => {
			// Bail early if no media was selected.
			if (!media || media.length === 0) {
				return;
			}

			/**
			 * Check if this is a new file upload (FileList) or existing media from library.
			 * FileList objects need to be converted to an array.
			 */
			const newFileUploads = Object.prototype.toString.call(media) === '[object FileList]';
			const mediaArray     = newFileUploads ? Array.from(media) : media;

			/**
			 * Create gallery item blocks for each selected media item.
			 * Determine if each item is a video or image based on its MIME type.
			 */
			const blocksToInsert = mediaArray.map((item) => {
				const mediaType = item.type && item.type.startsWith('video/') ? 'video' : 'image';

				return createBlock('mai/grid-gallery-item', {
					id: item.id,
					url: item.url,
					type: mediaType,
				});
			});

			/**
			 * Insert or replace blocks based on whether gallery already has items.
			 * If gallery has items and we're not uploading new files, add to existing.
			 * Otherwise, replace all blocks (new gallery or file upload).
			 */
			if (blocksToInsert.length > 0) {
				if (hasMediaIds && !newFileUploads) {
					// Add to existing gallery (when addToGallery is true).
					insertBlocks(blocksToInsert, innerBlocks.length, clientId);
				} else {
					// Replace all blocks.
					replaceInnerBlocks(clientId, blocksToInsert);
				}
			}
		};

		/**
		 * Get props for the inner blocks container.
		 * This configures which blocks are allowed as children and their behavior.
		 */
		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['mai/grid-gallery-item'],
			templateLock: false,
			orientation: 'horizontal',
		});

		/**
		 * Render the block editor UI.
		 * Returns JSX that displays the gallery in the editor with controls.
		 */
		return (
			<>
				{/**
				 * Block toolbar controls.
				 * These appear in the toolbar above the block when it's selected.
				 */}
				{hasInnerBlocks && (
					<BlockControls group="other">
						{/**
						 * Media management toolbar group.
						 * Allows users to add, remove, or replace media in the gallery.
						 */}
						<ToolbarGroup>
							<MediaReplaceFlow
								allowedTypes={['image', 'video']}
								accept="image/*,video/*"
								handleUpload={false}
								onSelect={handleMediaSelect}
								name={__('Manage Media', 'mai-grid-gallery')}
								multiple
								mediaIds={mediaIds}
								addToGallery={hasMediaIds}
							/>
						</ToolbarGroup>
						{/**
						 * Show/hide extra images toggle.
						 * Only shown when there are more images than the max visible setting.
						 */}
						{hasHiddenImages && (
							<ToolbarGroup>
								<ToolbarButton
									icon={editorShowAll ? seen : unseen}
									text={
										editorShowAll
											? __('Hide extra', 'mai-grid-gallery')
											: __('Show hidden', 'mai-grid-gallery')
									}
									onClick={() => setEditorShowAll(!editorShowAll)}
									isPressed={editorShowAll}
								/>
							</ToolbarGroup>
						)}
					</BlockControls>
				)}
				{/**
				 * Sidebar inspector controls.
				 * These appear in the block settings panel on the right side of the editor.
				 */}
				<InspectorControls>
					<PanelBody title={__('Settings', 'mai-grid-gallery')}>
						{/**
						 * Max visible items control.
						 * Limits how many gallery items are shown before the "show more" badge appears.
						 */}
						<RangeControl
							label={__('Max Visible Items', 'mai-grid-gallery')}
							value={attributes.maxVisible || 0}
							onChange={(value) => setAttributes({ maxVisible: value || 0 })}
							min={0}
							max={8}
							step={1}
							help={__(
								'Limit visible items to this number. Use 0 to use the number of images in the gallery (max 8 visible).',
								'mai-grid-gallery'
							)}
						/>
					</PanelBody>
				</InspectorControls>
				{/**
				 * Main block content area.
				 * Shows either a placeholder (empty gallery) or the gallery items.
				 */}
				{!hasInnerBlocks ? (
					// Empty gallery placeholder - shown when no media has been added yet.
					<View {...innerBlocksProps}>
						{innerBlocksProps.children}
						<MediaPlaceholder
							handleUpload={false}
							icon={icon}
							labels={{
								title: __('Mai Grid Gallery', 'mai-grid-gallery'),
								instructions: __(
									'Drag and drop images, upload, or choose from your library.',
									'mai-grid-gallery'
								),
							}}
							onSelect={handleMediaSelect}
							accept="image/*,video/*"
							allowedTypes={['image', 'video']}
							multiple
							value={{}}
						/>
					</View>
				) : (
					// Gallery with items - shows all gallery items, with optional data attribute to hide extras in editor.
					<div
						{...innerBlocksProps}
						{...(hasHiddenImages && !editorShowAll ? { 'data-hide-extra': 'true' } : {})}
					/>
				)}
			</>
		);
	},
	/**
	 * Save component for the grid gallery block.
	 * This function defines what gets saved to the database.
	 * Since this is a dynamic block, we return the inner blocks content.
	 *
	 * @param {Object} props - The component props.
	 * @param {Object} props.attributes - The block's saved attributes.
	 * @return {JSX.Element} The saved block markup.
	 */
	save: ({ attributes }) => {
		/**
		 * Get block props for the saved output.
		 * useBlockProps.save() provides the wrapper attributes for saved content.
		 */
		const blockProps = useBlockProps.save();

		/**
		 * Return the saved block structure.
		 * InnerBlocks.Content renders all the child gallery item blocks.
		 */
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
	/**
	 * Block transforms configuration.
	 * Transforms allow converting one block type to another.
	 * This enables users to convert WordPress core galleries to Mai Grid Galleries.
	 */
	transforms: {
		from: [
			{
				type: 'block',
				blocks: ['core/gallery'],
				/**
				 * Transform function to convert core/gallery blocks to mai/grid-gallery.
				 * Handles both newer format (with inner blocks) and older format (with ids attribute).
				 *
				 * @param {Object} attributes - The core/gallery block attributes.
				 * @param {Array} innerBlocks - The inner blocks of the core/gallery (wp:image blocks).
				 * @return {Object} A new mai/grid-gallery block with transformed inner blocks.
				 */
				transform: (attributes, innerBlocks) => {
					/**
					 * Handle newer gallery format with inner blocks (wp:image blocks).
					 * Modern WordPress galleries use nested image blocks instead of just IDs.
					 */
					if (innerBlocks && innerBlocks.length > 0) {
						/**
						 * Get the WordPress core data store selector.
						 * This allows us to fetch media attachment data.
						 */
						const coreSelect = select('core');
						/**
						 * Transform each inner image block into a gallery item block.
						 * Map through all inner blocks and extract image data.
						 */
						const transformedBlocks = innerBlocks
							.map((block) => {
								/**
								 * Extract image data from core/image block attributes.
								 * Get the attributes object, defaulting to empty object if missing.
								 */
								const imageAttrs = block.attributes || {};
								const imageId    = imageAttrs.id;

								// Skip blocks without an image ID.
								if (!imageId) {
									return null;
								}

								/**
								 * Get media data from the WordPress core store.
								 * This contains full attachment information like URLs, alt text, captions.
								 */
								const media = coreSelect.getMedia(imageId);
								if (!media) {
									/**
									 * Fallback: use attributes from the image block if media not in store.
									 * This handles cases where the media data hasn't been loaded yet.
									 */
									return createBlock('mai/grid-gallery-item', {
										id: imageId,
										url: imageAttrs.url || '',
										type: 'image',
										alt: imageAttrs.alt || '',
										caption: imageAttrs.caption || '',
									});
								}

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
								 * Create a new gallery item block with the media data.
								 * This becomes a child block of the mai/grid-gallery block.
								 */
								return createBlock('mai/grid-gallery-item', {
									id: media.id,
									url: url,
									type: 'image',
									alt: media.alt_text || '',
									caption: caption,
								});
							})
							.filter(Boolean); // Remove any null entries.

						/**
						 * Return empty gallery if no valid images were found.
						 * This prevents creating a gallery block with no content.
						 */
						if (transformedBlocks.length === 0) {
							return createBlock('mai/grid-gallery', {});
						}

						/**
						 * Create the grid gallery block with all transformed inner blocks.
						 * The third parameter is an array of inner blocks (gallery items).
						 */
						return createBlock('mai/grid-gallery', {}, transformedBlocks);
					}

					/**
					 * Fallback: Handle older gallery format with ids attribute.
					 * Older WordPress galleries stored just an array of attachment IDs.
					 */
					const { ids } = attributes;

					/**
					 * Return empty gallery if no image IDs found.
					 * This handles empty or invalid gallery blocks.
					 */
					if (!ids || ids.length === 0) {
						return createBlock('mai/grid-gallery', {});
					}

					/**
					 * Get media data for each image ID.
					 * Fetch full attachment data from the WordPress core store.
					 */
					const coreSelect        = select('core');
					const transformedBlocks = ids
						.map((id) => {
							/**
							 * Get media attachment data for this ID.
							 * Returns null if the media doesn't exist or isn't loaded.
							 */
							const media = coreSelect.getMedia(id);
							if (!media) {
								return null;
							}

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
							 * Create a new gallery item block with the media data.
							 * This becomes a child block of the mai/grid-gallery block.
							 */
							return createBlock('mai/grid-gallery-item', {
								id: media.id,
								url: url,
								type: 'image',
								alt: media.alt_text || '',
								caption: caption,
							});
						})
						.filter(Boolean); // Remove any null entries.

					/**
					 * Create the grid gallery block with all transformed inner blocks.
					 * The third parameter is an array of inner blocks (gallery items).
					 */
					return createBlock('mai/grid-gallery', {}, transformedBlocks);
				},
			},
		],
	},
});
