/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import {
	useBlockProps,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';
import { Button, ToolbarGroup, ToolbarButton, SelectControl } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { createBlock } from '@wordpress/blocks';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { FocalPointPicker } from '@wordpress/components';
import { useState, cloneElement } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import metadata from '../block/block.json';

/**
 * Register the Grid Gallery block
 */
registerBlockType('mai/grid-gallery', {
	...metadata,
	edit: ({ clientId, attributes, setAttributes }) => {
		const blockProps = useBlockProps();

		const { getBlocks } = useSelect(
			(select) => select('core/block-editor'),
			[]
		);

		const { insertBlocks } = useDispatch('core/block-editor');

		const innerBlocks = getBlocks(clientId);
		const hasInnerBlocks = innerBlocks.length > 0;

		const handleMediaSelect = (media) => {
			if (!media || media.length === 0) {
				return;
			}

			const blocksToInsert = media.map((item) => {
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
				const currentBlocks = getBlocks(clientId);
				insertBlocks(blocksToInsert, currentBlocks.length, clientId);
			}
		};

		const renderMediaUploadButton = (open) => (
			<Button
				variant="secondary"
				onClick={open}
			>
				{__('Add Media', 'mai-grid-gallery')}
			</Button>
		);

		return (
			<>
				{hasInnerBlocks && (
					<BlockControls>
						<ToolbarGroup>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={handleMediaSelect}
									allowedTypes={['image', 'video']}
									multiple={true}
									gallery={true}
									value={[]}
									render={({ open }) => (
										<ToolbarButton
											onClick={open}
											icon={plus}
											label={__('Add Media', 'mai-grid-gallery')}
										>
											{__('Add Media', 'mai-grid-gallery')}
										</ToolbarButton>
									)}
								/>
							</MediaUploadCheck>
						</ToolbarGroup>
					</BlockControls>
				)}
				<InspectorControls>
					<SelectControl
						label={__('Max Visible', 'mai-grid-gallery')}
						value={attributes.maxVisible?.toString() || '0'}
						options={Array.from({ length: 9 }, (_, i) => ({
							label: i === 0 ? __('All', 'mai-grid-gallery') : i.toString(),
							value: i.toString()
						}))}
						onChange={(value) => setAttributes({ maxVisible: parseInt(value, 10) })}
					/>
					{hasInnerBlocks && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={handleMediaSelect}
								allowedTypes={['image', 'video']}
								multiple={true}
								gallery={true}
								value={[]}
								render={({ open }) => (
									<div style={{ padding: '16px' }}>
										<Button
											variant="secondary"
											onClick={open}
											size="large"
											style={{ width: '100%' }}
										>
											{__('Add Media', 'mai-grid-gallery')}
										</Button>
									</div>
								)}
							/>
						</MediaUploadCheck>
					)}
				</InspectorControls>
				<div {...blockProps}>
					{!hasInnerBlocks && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={handleMediaSelect}
								allowedTypes={['image', 'video']}
								multiple={true}
								gallery={true}
								value={[]}
								render={({ open }) => (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											justifyContent: 'center',
											minHeight: '200px',
											padding: '40px',
											textAlign: 'center',
										}}
									>
										<Button
											variant="secondary"
											onClick={open}
											size="large"
										>
											{__('Add Media', 'mai-grid-gallery')}
										</Button>
										<p style={{ marginTop: '16px', color: '#757575' }}>
											{__('Select images and videos to add to the gallery.', 'mai-grid-gallery')}
										</p>
									</div>
								)}
							/>
						</MediaUploadCheck>
					)}
					<InnerBlocks
						allowedBlocks={['core/image', 'core/video']}
						templateLock={false}
						orientation="horizontal"
					/>
				</div>
			</>
		);
	},
	save: () => {
		const blockProps = useBlockProps.save();

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
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
 * Remove InnerBlocks wrapper div from saved output
 * This removes the block-editor-inner-blocks div so images are direct children
 */
addFilter(
	'blocks.getSaveElement',
	'mai-grid-gallery/remove-inner-blocks-wrapper',
	(element, blockType) => {
		if ('mai/grid-gallery' !== blockType.name) {
			return element;
		}

		// Find and unwrap the block-editor-inner-blocks div
		if (element?.props?.children) {
			const children = element.props.children;

			// Check if children is a single div with block-editor-inner-blocks class
			if (children?.props?.className) {
				const className = children.props.className;
				if (
					className.includes('block-editor-inner-blocks') ||
					className.includes('wp-block-mai-grid-gallery')
				) {
					// Return the block wrapper with unwrapped inner content
					return cloneElement(element, {
						...element.props,
						children: children.props.children,
					});
				}
			}
		}

		return element;
	}
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
