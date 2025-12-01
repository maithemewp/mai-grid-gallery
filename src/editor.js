/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
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
import { createBlock } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { FocalPointPicker } from '@wordpress/components';
import { useState, cloneElement } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { View } from '@wordpress/primitives';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from '../block/block.json';

/**
 * Add gallery icon to metadata.
 */
metadata.icon = icon;

/**
 * Register the Grid Gallery block
 */
registerBlockType('mai/grid-gallery', {
	...metadata,
	edit: ({ clientId, attributes, setAttributes }) => {
		// Editor-only state for showing/hiding extra images
		const [editorShowAll, setEditorShowAll] = useState(false);

		const { getBlocks } = useSelect(
			(select) => select('core/block-editor'),
			[]
		);

		const { insertBlocks, replaceInnerBlocks } = useDispatch('core/block-editor');

		const innerBlocks     = getBlocks(clientId);
		const hasInnerBlocks  = innerBlocks.length > 0;
		const visibleImages   = attributes.maxVisible ? attributes.maxVisible : Math.min(innerBlocks.length, 8);
		const hasHiddenImages = innerBlocks.length > visibleImages;
		const blockProps      = useBlockProps({
			className: hasHiddenImages && !editorShowAll
				? 'hide-extra-in-editor'
				: undefined,
			'data-visible': visibleImages,
		});

		const imageIds = innerBlocks
			.filter((block) => block.attributes?.id)
			.map((block) => block.attributes.id);
		const hasImageIds = imageIds.length > 0;

		const handleMediaSelect = (media) => {
			if (!media || media.length === 0) {
				return;
			}

			const newFileUploads = Object.prototype.toString.call(media) === '[object FileList]';
			const mediaArray = newFileUploads ? Array.from(media) : media;

			const blocksToInsert = mediaArray.map((item) => {
				if (item.type && item.type.startsWith('video/')) {
					return createBlock('core/video', {
						src: item.url,
						id: item.id,
					});
				} else {
					return createBlock('core/image', {
						url: item.url,
						alt: item.alt || '',
						id: item.id,
					});
				}
			});

			if (blocksToInsert.length > 0) {
				if (hasImageIds && !newFileUploads) {
					// Add to existing gallery (when addToGallery is true)
					const currentBlocks = getBlocks(clientId);
					insertBlocks(blocksToInsert, currentBlocks.length, clientId);
				} else {
					// Replace all blocks
					replaceInnerBlocks(clientId, blocksToInsert);
				}
			}
		};

		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['core/image', 'core/video'],
			templateLock: false,
			orientation: 'horizontal',
		});

		return (
			<>
			{hasInnerBlocks && (
				<BlockControls group="other">
					<ToolbarGroup>
						<MediaReplaceFlow
							allowedTypes={['image', 'video']}
							accept="image/*,video/*"
							handleUpload={false}
							onSelect={handleMediaSelect}
							name={__('Manage Media', 'mai-grid-gallery')}
							multiple
							mediaIds={imageIds}
							addToGallery={hasImageIds}
						/>
					</ToolbarGroup>
					{hasHiddenImages && (
						<ToolbarGroup>
							<ToolbarButton
								icon={editorShowAll ? seen : unseen}
								text={editorShowAll
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
				<InspectorControls>
					<PanelBody title={__('Settings', 'mai-grid-gallery')}>
						<RangeControl
							label={__('Max Visible Items', 'mai-grid-gallery')}
							value={attributes.maxVisible || 0}
							onChange={(value) => setAttributes({ maxVisible: value || 0 })}
							min={0}
							max={8}
							step={1}
							help={__('Limit visible items to this number. Use 0 to use the number of images in the gallery (max 8 visible).', 'mai-grid-gallery')}
						/>
					</PanelBody>
				</InspectorControls>
				{!hasInnerBlocks ? (
					<View {...innerBlocksProps}>
						{innerBlocksProps.children}
						<MediaPlaceholder
							handleUpload={false}
							icon={icon}
							labels={{
								title: __('Mai Grid Gallery', 'mai-grid-gallery'),
								instructions: __('Drag and drop images, upload, or choose from your library.', 'mai-grid-gallery'),
							}}
							onSelect={handleMediaSelect}
							accept="image/*,video/*"
							allowedTypes={['image', 'video']}
							multiple
							value={{}}
						/>
					</View>
				) : (
					<div {...innerBlocksProps} />
				)}
			</>
		);
	},
	save: ({ attributes, innerBlocks }) => {
		const visibleImages = attributes.maxVisible ? attributes.maxVisible : Math.min(innerBlocks.length, 8);
		const blockProps    = useBlockProps.save({
			'data-count': innerBlocks.length,
			'data-visible': visibleImages,
		});

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
				<span className="wp-block-mai-grid-gallery__badge">
					<span className="wp-block-mai-grid-gallery__badge-icon"></span>
					<span className="wp-block-mai-grid-gallery__badge-count">{innerBlocks.length}</span>
				</span>
			</div>
		);
	},
});

/**
 * Add focal point attribute to core/image block
 * This allows us to store the focal point coordinates for each image
 */
addFilter(
	'blocks.registerBlockType',
	'mai-grid-gallery/image-focal-point-attribute',
	(settings, name) => {
		if ('core/image' !== name) {
			return settings;
		}

		return {
			...settings,
			attributes: {
				...settings.attributes,
				focalPoint: {
					type: 'object',
					default: {
						x: 0.5, // Center horizontally
						y: 0.5  // Center vertically
					}
				}
			}
		};
	}
);

/**
 * Add Focal Point Picker to image blocks within our gallery
 * This adds the UI control in the block sidebar for adjusting focal points
 */
addFilter(
	'editor.BlockEdit',
	'mai-grid-gallery/with-focal-point-picker',
	createHigherOrderComponent((BlockEdit) => (props) => {
		// Only process core/image blocks
		if ('core/image' !== props.name) {
			return <BlockEdit {...props} />;
		}

		// Get functions to check block hierarchy
		const { getBlockParents, getBlockName } = useSelect((select) => ({
			getBlockParents: select('core/block-editor').getBlockParents,
			getBlockName: select('core/block-editor').getBlockName,
		}), []);

		// Check if this image is inside our grid gallery block
		const parentBlocks = props.clientId ? getBlockParents(props.clientId) : [];
		// Check all ancestors for our grid gallery block
		const isChildOfGridGallery = parentBlocks.some(parentId =>
			getBlockName(parentId) === 'mai/grid-gallery'
		);

		// Only show focal point picker for images in our gallery
		if (!isChildOfGridGallery) {
			return <BlockEdit {...props} />;
		}

		// Manage focal point state
		const [focalPoint, setFocalPoint] = useState({
			x: props.attributes.focalPoint?.x || 0.5,
			y: props.attributes.focalPoint?.y || 0.5,
		});

		// Update focal point when changed
		const handleFocalPointChange = (newFocalPoint) => {
			setFocalPoint(newFocalPoint);
			props.setAttributes({ focalPoint: newFocalPoint });
		};

		// Get image URL for the picker preview
		const imageUrl = props.attributes?.url || props.attributes?.src;

		return (
			<>
				<BlockEdit {...props} />
				<InspectorControls>
					<div style={{ padding: '0 16px 16px' }}>
						{imageUrl && (
							<FocalPointPicker
								__nextHasNoMarginBottom
								label={__('Focal Point')}
								url={imageUrl}
								value={focalPoint}
								onDragStart={handleFocalPointChange}
								onDrag={handleFocalPointChange}
								onChange={handleFocalPointChange}
							/>
						)}
					</div>
				</InspectorControls>
			</>
		);
	}, 'withFocalPointPicker')
);

/**
 * Apply focal point styles to saved HTML
 */
addFilter(
	'blocks.getSaveElement',
	'mai-grid-gallery/apply-focal-point',
	(element, blockType, attributes) => {
		if ('core/image' !== blockType.name) {
			return element;
		}

		// Only add styles if focal point is different from default center position
		if (!attributes?.focalPoint ||
			(attributes.focalPoint.x === 0.5 && attributes.focalPoint.y === 0.5)) {
			return element;
		}

		return cloneElement(element, {
			...element.props,
			style: {
				...element.props.style,
				'--object-position': `${attributes.focalPoint.x * 100}% ${attributes.focalPoint.y * 100}%`
			}
		});
	}
);

/**
 * Apply focal point styles in the editor
 * This ensures the focal point is visible while editing
 */
addFilter(
	'editor.BlockListBlock',
	'mai-grid-gallery/with-focal-point-styles',
	createHigherOrderComponent((BlockListBlock) => {
		return (props) => {
			if ('core/image' !== props.name) {
				return <BlockListBlock {...props} />;
			}

			// Only add styles if focal point is different from default
			if (!props.attributes?.focalPoint ||
				(props.attributes.focalPoint.x === 0.5 && props.attributes.focalPoint.y === 0.5)) {
				return <BlockListBlock {...props} />;
			}

			// Add CSS custom property to block wrapper
			const style = {
				'--object-position': `${props.attributes.focalPoint.x * 100}% ${props.attributes.focalPoint.y * 100}%`
			};

			return <BlockListBlock {...props} wrapperProps={{ style }} />;
		};
	}, 'withFocalPointStyles')
);
