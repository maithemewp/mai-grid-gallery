/**
 * WordPress dependencies
 */
import { useBlockProps, MediaReplaceFlow, InspectorControls, BlockControls, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Placeholder, ToolbarGroup, ToolbarButton, FocalPointPicker, ToggleControl, PanelBody } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { upload as icon, caption as captionIcon } from '@wordpress/icons';

export default function Edit({ attributes, setAttributes }) {
	const { id, url, type, alt, caption, focalPoint, autoplay } = attributes;
	const [localFocalPoint, setLocalFocalPoint] = useState(focalPoint);
	const [showCaption, setShowCaption] = useState(!!caption);

	/**
	 * Determines media type from URL extension.
	 *
	 * @param {string} url The media URL.
	 * @return {string} 'video' or 'image'.
	 */
	const getTypeFromUrl = (url) => {
		if (!url) {
			return 'image';
		}

		// Extract extension from URL path (before query string)
		const urlPath = url.split('?')[0].toLowerCase();
		const lastDot = urlPath.lastIndexOf('.');

		if (lastDot === -1) {
			return 'image';
		}

		const extension = urlPath.substring(lastDot);
		const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.mkv', '.m4v'];

		return videoExtensions.includes(extension) ? 'video' : 'image';
	};

	// Get the effective type (use attribute or detect from URL)
	const effectiveType = type || (url ? getTypeFromUrl(url) : 'image');

	const blockProps = useBlockProps({
		className: `wp-block-mai-grid-gallery-item--${effectiveType || 'empty'}`,
	});

	// Auto-detect type from URL if type is not set or doesn't match the URL.
	useEffect(() => {
		if (url) {
			const detectedType = getTypeFromUrl(url);
			// Update if type is not set, or if it doesn't match the detected type.
			if (!type || type !== detectedType) {
				setAttributes({ type: detectedType });
			}
		}
	}, [url, type, setAttributes]);

	const onSelectMedia = (media) => {
		if (!media || !media.url) {
			return;
		}

		const mediaType = media.type && media.type.startsWith('video/') ? 'video' : 'image';
		const mediaCaption = media.caption || '';

		setAttributes({
			id: media.id,
			url: media.url,
			type: mediaType,
			alt: media.alt || '',
			caption: mediaCaption,
		});

		// Show caption if media has one
		if (mediaCaption) {
			setShowCaption(true);
		}
	};

	const handleFocalPointChange = (newFocalPoint) => {
		setLocalFocalPoint(newFocalPoint);
		setAttributes({ focalPoint: newFocalPoint });
	};

	const toggleCaption = () => {
		setShowCaption(!showCaption);
		// If hiding caption, clear it
		if (showCaption) {
			setAttributes({ caption: '' });
		}
	};

	// If no media selected yet
	if (!url) {
		return (
			<figure {...blockProps}>
				<Placeholder
					icon={icon}
					label={__('Grid Gallery Item', 'mai-grid-gallery')}
					instructions={__('Select an image or video', 'mai-grid-gallery')}
				>
					<MediaReplaceFlow
						allowedTypes={['image', 'video']}
						accept="image/*,video/*"
						onSelect={onSelectMedia}
						name={__('Select Media', 'mai-grid-gallery')}
					/>
				</Placeholder>
			</figure>
		);
	}

	return (
		<>
			<BlockControls group="other">
				<ToolbarGroup>
					<MediaReplaceFlow
						allowedTypes={['image', 'video']}
						accept="image/*,video/*"
						onSelect={onSelectMedia}
						name={__('Replace', 'mai-grid-gallery')}
						mediaId={id}
					/>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						icon={captionIcon}
						label={showCaption ? __('Remove caption', 'mai-grid-gallery') : __('Add caption', 'mai-grid-gallery')}
						onClick={toggleCaption}
						isPressed={showCaption}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				{'image' === effectiveType && url && (
					<div style={{ padding: '0 16px 16px' }}>
						<FocalPointPicker
							__nextHasNoMarginBottom
							label={__('Focal Point', 'mai-grid-gallery')}
							url={url}
							value={localFocalPoint}
							onDragStart={handleFocalPointChange}
							onDrag={handleFocalPointChange}
							onChange={handleFocalPointChange}
						/>
					</div>
				)}
				{'video' === effectiveType && url && (
					<PanelBody title={__('Video Settings', 'mai-grid-gallery')}>
						<ToggleControl
							label={__('Autoplay', 'mai-grid-gallery')}
							checked={autoplay || false}
							onChange={(value) => setAttributes({ autoplay: value })}
							help={__('Video will always be muted and loop when autoplay is enabled.', 'mai-grid-gallery')}
						/>
					</PanelBody>
				)}
			</InspectorControls>

			<figure {...blockProps}>
				{'image' === effectiveType ? (
					<img
						src={url}
						alt={alt}
						style={{
							objectPosition: `${localFocalPoint.x * 100}% ${localFocalPoint.y * 100}%`,
						}}
					/>
				) : (
					<video
						src={url}
						{...(autoplay ? { autoPlay: true } : {})}
						playsInline
						muted
						loop
					/>
				)}
				{showCaption && (
					<RichText
						tagName="figcaption"
						placeholder={__('Add caption…', 'mai-grid-gallery')}
						value={caption}
						onChange={(value) => setAttributes({ caption: value })}
						inlineToolbar
					/>
				)}
			</figure>
		</>
	);
}
