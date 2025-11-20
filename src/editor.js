/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, useInnerBlocksProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { gallery as icon } from '@wordpress/icons';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { FocalPointPicker } from '@wordpress/components';
import { useState, cloneElement } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from '../block/block.json';

/**
 * Register the Grid Gallery block
 * This block allows for a grid of images and videos with customizable focal points
 */
registerBlockType('mai/grid-gallery', {
	...metadata,
	icon,
	edit: () => {
		const blockProps = useBlockProps();
		const pluginUrl = window.maiGridGalleryVars?.pluginUrl.replace(/\/?$/, '/'); // Ensure trailing slash

		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: [
				'core/image',
				'core/video',
			],
			template: [
				// ['core/video', {
				// 	src: `${pluginUrl}assets/placeholder.mp4`,
				// 	autoplay: true,
				// 	controls: false,
				// 	loop: true,
				// 	muted: true,
				// 	playsInline: true
				// }],
				['core/image', {
					url: `${pluginUrl}assets/placeholder.png`,
					alt: 'Placeholder image'
				}],
				['core/image', {
					url: `${pluginUrl}assets/placeholder.png`,
					alt: 'Placeholder image'
				}],
				['core/image', {
					url: `${pluginUrl}assets/placeholder.png`,
					alt: 'Placeholder image'
				}],
				['core/image', {
					url: `${pluginUrl}assets/placeholder.png`,
					alt: 'Placeholder image'
				}],
				['core/image', {
					url: `${pluginUrl}assets/placeholder.png`,
					alt: 'Placeholder image'
				}],
				['core/image', {
					url: `${pluginUrl}assets/placeholder.png`,
					alt: 'Placeholder image'
				}],
				['core/image', {
					url: `${pluginUrl}assets/placeholder.png`,
					alt: 'Placeholder image'
				}],
				['core/image', {
					url: `${pluginUrl}assets/placeholder.png`,
					alt: 'Placeholder image'
				}]
			],
			templateLock: false,
			max: 6
		});

		return <div {...innerBlocksProps} />;
	},
	save: () => {
		const blockProps = useBlockProps.save();
		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	}
});

/**
 * Add focal point attribute to core/image block
 * This allows us to store the focal point coordinates for each image
 */
addFilter(
	'blocks.registerBlockType',
	'mai/image-focal-point-attribute',
	(settings, name) => {
		if (name !== 'core/image') {
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
	'mai/with-focal-point-picker',
	createHigherOrderComponent((BlockEdit) => (props) => {
		// Only process core/image blocks
		if (props.name !== 'core/image') {
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
	'mai/apply-focal-point',
	(element, blockType, attributes) => {
		if (blockType.name !== 'core/image') {
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
	'mai/with-focal-point-styles',
	createHigherOrderComponent((BlockListBlock) => {
		return (props) => {
			if (props.name !== 'core/image') {
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