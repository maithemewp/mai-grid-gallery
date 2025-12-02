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
import { useState } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { View } from '@wordpress/primitives';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import metadata from '../block/grid-gallery/block.json';
import '../block/grid-gallery-item/index.js';

/**
 * Add gallery icon to metadata.
 */
metadata.icon = icon;

/**
 * Register the Grid Gallery block.
 */
registerBlockType('mai/grid-gallery', {
	...metadata,
	edit: ({ clientId, attributes, setAttributes }) => {
		// Editor-only state for showing/hiding extra images.
		const [editorShowAll, setEditorShowAll] = useState(false);

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

		const { insertBlocks, replaceInnerBlocks } = useDispatch('core/block-editor');

		const hasInnerBlocks = blockCount > 0;
		const visibleImages = attributes.maxVisible ? attributes.maxVisible : Math.min(blockCount, 8);
		const hasHiddenImages = blockCount > visibleImages;

		const blockProps = useBlockProps({
			'data-count': blockCount,
			'data-visible': visibleImages,
		});

		const mediaIds = innerBlocks
			.filter((block) => block.attributes?.id)
			.map((block) => block.attributes.id);
		const hasMediaIds = mediaIds.length > 0;

		const handleMediaSelect = (media) => {
			if (!media || media.length === 0) {
				return;
			}

			const newFileUploads = Object.prototype.toString.call(media) === '[object FileList]';
			const mediaArray = newFileUploads ? Array.from(media) : media;

			const blocksToInsert = mediaArray.map((item) => {
				const mediaType = item.type && item.type.startsWith('video/') ? 'video' : 'image';

				return createBlock('mai/grid-gallery-item', {
					id: item.id,
					url: item.url,
					type: mediaType,
				});
			});

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

		const innerBlocksProps = useInnerBlocksProps(blockProps, {
			allowedBlocks: ['mai/grid-gallery-item'],
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
								mediaIds={mediaIds}
								addToGallery={hasMediaIds}
							/>
						</ToolbarGroup>
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
				<InspectorControls>
					<PanelBody title={__('Settings', 'mai-grid-gallery')}>
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
				{!hasInnerBlocks ? (
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
					<div
						{...innerBlocksProps}
						{...(hasHiddenImages && !editorShowAll ? { 'data-hide-extra': 'true' } : {})}
					/>
				)}
			</>
		);
	},
	save: ({ attributes }) => {
		const blockProps = useBlockProps.save();

		return (
			<div {...blockProps}>
				<InnerBlocks.Content />
			</div>
		);
	},
});
