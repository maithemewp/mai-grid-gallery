<?php
/**
 * Plugin Name:       Mai Grid Gallery
 * Description:       A responsive, stylish, and lightweight grid gallery with lightbox support
 * Version:           0.3.0
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
	register_block_type( __DIR__ . '/block' );

	// Localize the editor assets.
	wp_localize_script(
		'mai-grid-gallery-editor-script',
		'maiGridGalleryVars',
		[
			'pluginUrl' => plugin_dir_url(__FILE__)
		]
	);

}

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\maybe_enqueue_styles' );
/**
 * Enqueues the styles for the grid gallery block.
 *
 * @since 0.1.0
 *
 * @return void
 */
function maybe_enqueue_styles() {
	// Bail if not a single post/page.
	if ( ! is_singular() ) {
		return;
	}

	// Bail if the page doesn't have the grid gallery block.
	if ( ! has_block( 'mai/grid-gallery' ) ) {
		return;
	}

	// Enqueue the styles.
	enqueue_styles();
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


add_filter( 'block_type_metadata', __NAMESPACE__ . '\add_gallery_context_to_blocks_metadata', 10, 1 );
/**
 * Adds usesContext to core/image and core/video blocks.
 *
 * @since 0.1.0
 *
 * @param array $metadata Block metadata.
 * @return array
 */
function add_gallery_context_to_blocks_metadata( $metadata ) {
	// Bail if not a core/image or core/video block.
	if ( ! isset( $metadata['name'] ) || ! in_array( $metadata['name'], [ 'core/image', 'core/video' ], true ) ) {
		return $metadata;
	}

	// Add the context to the block.
	$metadata['usesContext']   = $metadata['usesContext'] ?? [];
	$metadata['usesContext'][] = 'mai/grid-gallery/maxVisible';

	return $metadata;
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

add_filter( 'render_block_mai/grid-gallery', __NAMESPACE__ . '\render_block_mai_grid_gallery', 10, 3 );
/**
 * Renders the grid gallery block.
 *
 * @since 0.1.0
 *
 * @return void
 */
function render_block_mai_grid_gallery( $block_content, $block, $instance ) {
	// Reset the item count.
	item_count( true );

	// Return empty string if there are no inner blocks.
	if ( ! isset( $block['innerBlocks'] ) || empty( $block['innerBlocks'] ) ) {
		return '';
	}

	// Build badge.
	$badge = sprintf( '<span class="wp-block-mai-grid-gallery__badge"><span class="wp-block-mai-grid-gallery__badge-icon"></span><span class="wp-block-mai-grid-gallery__badge-count">%s</span></span>', count( $block['innerBlocks'] ?? [] ) );

	// Add badge before the last closing div.
	$block_content = preg_replace( '/<\/div>$/', $badge . '</div>', $block_content, 1 );

	return $block_content;
}

add_filter( 'render_block_core/image', __NAMESPACE__ . '\render_block_core_image', 10, 3 );
/**
 * Renders the core image block.
 *
 * @since 0.1.0
 *
 * @return void
 */
function render_block_core_image( $block_content, $block, $instance ) {
	if ( ! isset( $instance->context ) ) {
		return $block_content;
	}

	// Get max visible.
	$max_visible = $instance->context['mai/grid-gallery/maxVisible'] ?? 0;
	$max_visible = 0 === $max_visible ? 8 : $max_visible;

	// Get current item.
	$count = item_count();

	// Bail if this is a visible item.
	if ( $count <= $max_visible ) {
		return $block_content;
	}

	// Remove image if no ID.
	$image_id = $block['attrs']['id'] ?? null;
	if ( is_null( $image_id ) ) {
		return '';
	}

	// Bail if no post object.
	$attachment = get_post( $image_id );
	if ( ! $attachment ) {
		return '';
	}

	// Get image source and srcset.
	$src    = wp_get_attachment_image_url( $image_id, 'full' );
	$srcset = wp_get_attachment_image_srcset( $image_id, 'full' );
	$sizes  = wp_get_attachment_image_sizes( $image_id, 'full' );
	$alt    = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
	$alt    = $alt ?: $block['attrs']['alt'] ?? '';

	// Get caption from first figcaption element in the content if it exists, otherwise use attachment caption.
	if ( preg_match( '/<figcaption[^>]*>(.*?)<\/figcaption>/is', $block_content, $matches ) ) {
		$caption = wp_strip_all_tags( $matches[1] );
	} else {
		$caption = wp_get_attachment_caption( $image_id );
	}

	// Build span with data attributes.
	$span = sprintf( '<span style="display:none!important;" class="mai-grid-gallery-hidden" data-src="%s" data-srcset="%s" data-sizes="%s" data-alt="%s" data-caption="%s"></span>',
		esc_attr( $src ),
		esc_attr( $srcset ),
		esc_attr( $sizes ),
		esc_attr( $alt ),
		esc_attr( $caption )
	);

	return $span;
}

add_filter( 'render_block_core/video', __NAMESPACE__ . '\render_block_core_video', 10, 3 );
/**
 * TODO: Make sure video block actually works with the plugin.
 * Renders the core video block.
 *
 * @since 0.1.0
 *
 * @return void
 */
function render_block_core_video( $block_content, $block, $instance ) {
	if ( ! isset( $instance->context ) ) {
		return $block_content;
	}

	// Get max visible.
	$max_visible = $instance->context['mai/grid-gallery/maxVisible'] ?? 0;
	$max_visible = 0 === $max_visible ? 8 : $max_visible;

	// Get current item.
	$count = item_count();

	// Bail if this is a visible item.
	if ( $count <= $max_visible ) {
		return $block_content;
	}

	// Remove video if no ID.
	$video_id = $block['attrs']['id'] ?? null;
	if ( is_null( $video_id ) ) {
		return '';
	}

	// Bail if no post object.
	$attachment = get_post( $video_id );
	if ( ! $attachment ) {
		return '';
	}

	// Bail if no source.
	$src = wp_get_attachment_url( $video_id );
	if ( ! $src ) {
		return '';
	}

	// Get caption from first figcaption element in the content if it exists, otherwise use attachment caption.
	$caption = '';
	if ( preg_match( '/<figcaption[^>]*>(.*?)<\/figcaption>/is', $block_content, $matches ) ) {
		$caption = wp_strip_all_tags( $matches[1] );
	} elseif ( $video_id ) {
		$caption = wp_get_attachment_caption( $video_id );
	}

	// Build span with data attributes for video.
	$span = sprintf( '<span style="display:none!important;" class="mai-grid-gallery-hidden" data-src="%s" data-caption="%s"></span>',
		esc_attr( $src ),
		esc_attr( $caption )
	);

	return $span;
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
