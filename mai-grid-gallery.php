<?php
/**
 * Plugin Name:       Mai Grid Gallery
 * Description:       A responsive, stylish, and lightweight grid gallery with lightbox support
 * Version:           0.4.4
 * Requires at least: 6.7
 * Requires PHP:      8.2
 * Author:            BizBudding
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       mai-grid-gallery
 */

namespace Mai\GridGallery;

use YahnisElsts\PluginUpdateChecker\v5\PucFactory;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'init', __NAMESPACE__ . '\init' );
/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @since 0.1.0
 *
 * @return void
 */
function init() {
	// Register parent block.
	register_block_type( __DIR__ . '/block/grid-gallery', [
		'render_callback' => __NAMESPACE__ . '\render_mai_grid_gallery',
	] );

	// Register child block.
	register_block_type( __DIR__ . '/block/grid-gallery-item', [
		'render_callback' => __NAMESPACE__ . '\render_mai_grid_gallery_item',
	] );

	// Localize the editor assets.
	wp_localize_script(
		'mai-grid-gallery-editor-script',
		'maiGridGalleryVars',
		[
			'pluginUrl' => plugin_dir_url(__FILE__)
		]
	);
}

/**
 * Renders the grid gallery block.
 *
 * @since 0.3.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 *
 * @return string
 */
function render_mai_grid_gallery( $attributes, $content, $block ) {
	// Reset the item count.
	item_count( true );

	// Return empty string if there are no inner blocks.
	if ( ! isset( $block->inner_blocks ) || empty( $block->inner_blocks ) ) {
		return '';
	}

	// Maybe enqueue the styles.
	static $enqueued = false;
	if ( ! $enqueued ) {
		$styles_asset = include( plugin_dir_path( __FILE__ ) . 'build/styles.asset.php' );
		$script_asset = include( plugin_dir_path( __FILE__ ) . 'build/front.asset.php' );

		// Enqueue the styles.
		wp_enqueue_style(
			'mai-grid-gallery-styles',
			plugins_url( 'build/styles.css', __FILE__ ),
			$styles_asset['dependencies'],
			$styles_asset['version']
		);

		// Enqueue the script.
		wp_enqueue_script(
			'mai-grid-gallery-front',
			plugins_url( 'build/front.js', __FILE__ ),
			$script_asset['dependencies'],
			$script_asset['version'],
			[
				'strategy'  => 'defer',
				'in_footer' => false,
			]
		);

		$enqueued = true;
	}

	// Set attributes.
	$max_visible    = $attributes['maxVisible'] ?? 0;
	$max_visible    = 0 === $max_visible ? 8 : $max_visible;
	$block_count    = count( $block->inner_blocks );
	$visible_images = min( $block_count, $max_visible ?: 8 );
	$hidden_images  = $block_count - $visible_images;
	$attributes     = [
		'data-count'   => $block_count,
		'data-visible' => $visible_images,
	];

	// Maybe add hidden images.
	if ( $hidden_images > 0 ) {
		$attributes['data-hidden'] = $hidden_images;
	}

	// Build wrapper attributes.
	$wrapper_attributes = get_block_wrapper_attributes( $attributes );

	// Render inner blocks.
	$inner_content = '';
	foreach ( $block->inner_blocks as $inner_block ) {
		$inner_content .= $inner_block->render();
	}

	// Build badge.
	$badge = '<span class="wp-block-mai-grid-gallery__badge"><span class="wp-block-mai-grid-gallery__badge-icon"></span>';
		if ( $hidden_images > 0 ) {
			$badge .= sprintf( '<span class="wp-block-mai-grid-gallery__badge-count">%s</span>', $hidden_images );
		}
	$badge .= '</span>';

	// Render block.
	return sprintf(
		'<div %s>%s%s</div>',
		$wrapper_attributes,
		$inner_content,
		$badge
	);
}

/**
 * Renders a grid gallery item block.
 *
 * @since 0.3.0
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 *
 * @return string
 */
function render_mai_grid_gallery_item( $attributes, $content, $block ) {
	$id       = $attributes['id'] ?? 0;
	$url      = $attributes['url'] ?? '';
	$url_full = $url;
	$type     = $attributes['type'] ?? null;
	$type     = $type ?: get_type( $id, $url );
	$caption  = $attributes['caption'] ?? '';
	$caption  = empty( $caption ) && $id ? wp_get_attachment_caption( $id ) : '';
	$focal    = $attributes['focalPoint'] ?? [ 'x' => 0.5, 'y' => 0.5 ];

	// Bail if no URL or type is not image or video.
	if ( ! $url || ! $type || ! in_array( $type, [ 'image', 'video' ] ) ) {
		return '';
	}

	// Get max visible from context.
	$max_visible = $block->context['mai/grid-gallery/maxVisible'] ?? 0;
	$max_visible = 0 === $max_visible ? 8 : $max_visible;

	// Get current item count.
	$count = item_count();

	// If this item is beyond max visible, render as hidden data.
	if ( $count > $max_visible ) {
		// Get manual data for placeholder span.
		switch ( $type ) {
			case 'image':
				if ( $id ) {
					$src     = wp_get_attachment_image_url( $id, 'full' );
					$srcset  = wp_get_attachment_image_srcset( $id, 'full' );
					$sizes   = wp_get_attachment_image_sizes( $id, 'full' );
					$alt     = get_post_meta( $id, '_wp_attachment_image_alt', true );
					$caption = $caption ?: '';
				} else {
					$src     = $url;
					$srcset  = '';
					$sizes   = '';
					$alt     = '';
					$caption = $caption ?: '';
				}
				break;
			case 'video':
				$src     = $url;
				$srcset  = '';
				$sizes   = '';
				$alt     = '';
				$caption = $caption ?: '';
				break;
		}

		return sprintf( '<span style="display:none!important;" class="mai-grid-gallery-hidden" data-src="%s" data-srcset="%s" data-sizes="%s" data-alt="%s" data-caption="%s"></span>',
			esc_attr( $src ),
			esc_attr( $srcset ),
			esc_attr( $sizes ),
			esc_attr( $alt ),
			esc_attr( $caption )
		);
	}

	// Get data.
	switch ( $type ) {
		case 'image':
			// Handle style.
			$attr = [];
			if ( 0.5 !== $focal['x'] || 0.5 !== $focal['y'] ) {
				$attr['style'] = sprintf(
					' style="--object-position:%s%% %s%%"',
					$focal['x'] * 100,
					$focal['y'] * 100
				);
			}

			// Get inner HTML.
			if ( $id ) {
				$url_full         = wp_get_attachment_image_url( $id, 'full' );
				$attr['data-src'] = $url_full;
				$inner_html       = wp_get_attachment_image( $id, 'large', false, $attr );
			} else {
				$inner_html = sprintf( '<img src="%s" data-src="%s" alt="" style="%s" />', esc_url( $url ), esc_url( $url_full ), esc_attr( $attr['style'] ) );
			}
			break;
		case 'video':
			// Get autoplay attribute.
			$autoplay = $attributes['autoplay'] ?? false;
			$autoplay_attr = $autoplay ? ' autoplay' : '';

			// Get inner HTML.
			$inner_html = sprintf(
				'<video src="%s" data-src="%s"%s muted loop playsinline></video>',
				esc_url( $url ),
				esc_url( $url ),
				$autoplay_attr
			);
			break;
	}

	// Maybe add caption.
	if ( ! empty( $caption ) ) {
		$inner_html .= sprintf( '<figcaption>%s</figcaption>', wp_kses_post( $caption ) );
	}

	// Attributes.
	$attr = [
		'class' => 'wp-block-mai-grid-gallery-item--' . $type,
	];

	// Build HTML.
	$html = sprintf( '<figure %s>%s</figure>', get_block_wrapper_attributes( $attr ), $inner_html );

	return $html;
}

/**
 * Enqueues the styles for the grid gallery block.
 *
 * @since 0.1.0
 *
 * @return void
 */
function enqueue_styles() {
	// Get the version of the stylesheet.
	$ver = filemtime( plugin_dir_path( __FILE__ ) . 'build/styles.css' );

	// Enqueue the styles in the head if the block is on the page.
	wp_enqueue_style( 'mai-grid-gallery-styles', plugin_dir_url(__FILE__) . 'build/styles.css', [], $ver );
}

/**
 * Gets the type of the item.
 *
 * @since 0.3.0
 *
 * @param int    $id  The ID of the item.
 * @param string $url The URL of the item.
 *
 * @return string
 */
function get_type( $id, $url = '' ) {
	$type = null;

	// Check if id is an attachment.
	if ( $id ) {
		$mime = get_post_mime_type( $id );

		// Check if mime is image or video.
		if ( str_starts_with( $mime, 'image/' ) ) {
			$type = 'image';
		}
		elseif ( str_starts_with( $mime, 'video/' ) ) {
			$type = 'video';
		}
	}

	// If no type and we have a url.
	if ( ! $type && $url ) {
		$ext        = strtolower( wp_parse_url( $url, PHP_URL_PATH ) );
		$image_exts = [ 'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'heic', 'svg' ];
		$video_exts = [ 'mp4', 'mov', 'webm', 'avi', 'mkv', 'm4v' ];

		if ( in_array( $ext, $image_exts, true ) ) {
			$type = 'image';
		}
		elseif ( in_array( $ext, $video_exts, true ) ) {
			$type = 'video';
		}
	}

	return $type;
}

/**
 * Gets the item count.
 *
 * @since 0.1.0
 *
 * @return int
 */
function item_count( $reset = false ) {
	static $count = 0;
	if ( $reset ) {
		$count = 0;
	}
	return $count++;
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\updater' );
/**
 * Setup the updater.
 *
 * composer require yahnis-elsts/plugin-update-checker
 *
 * @since 0.1.0
 *
 * @uses https://github.com/YahnisElsts/plugin-update-checker/
 *
 * @return void
 */
function updater() {
	$updater = PucFactory::buildUpdateChecker( 'https://github.com/maithemewp/mai-grid-gallery', __FILE__, 'mai-grid-gallery' );

	// Maybe set github api token.
	if ( defined( 'MAI_GITHUB_API_TOKEN' ) ) {
		$updater->setAuthentication( MAI_GITHUB_API_TOKEN );
	}

	// Add icons for Dashboard > Updates screen.
	if ( function_exists( 'mai_get_updater_icons' ) && $icons = mai_get_updater_icons() ) {
		$updater->addResultFilter(
			function ( $info ) use ( $icons ) {
				$info->icons = $icons;
				return $info;
			}
		);
	}
}
