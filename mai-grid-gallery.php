<?php
/**
 * Plugin Name:       Mai Grid Gallery
 * Description:       A responsive, stylish, and lightweight grid gallery with lightbox support",
 * Version:           0.1.0
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

add_action( 'render_block_mai/grid-gallery', __NAMESPACE__ . '\render_block_mai_grid_gallery', 10, 3 );
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

	return $block_content;
}

add_action( 'render_block_core/image', __NAMESPACE__ . '\render_block_core_image', 10, 3 );
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

	// Bail if not in a gallery.
	$max_visible = $instance->context['mai/grid-gallery/maxVisible'] ?? null;
	if ( is_null( $max_visible ) ) {
		return $block_content;
	}

	// Bail if this is a visible item.
	if ( (int) item_count() <= (int) $max_visible ) {
		return $block_content;
	}

	// Remove image if no ID.
	$image_id = $block['attrs']['id'] ?? null;
	if ( is_null( $image_id ) ) {
		return '';
	}

	// Get attachment data.
	$attachment = get_post( $image_id );
	if ( ! $attachment ) {
		return '';
	}

	// Get image source and srcset.
	$src     = wp_get_attachment_image_url( $image_id, 'full' );
	$srcset  = wp_get_attachment_image_srcset( $image_id, 'full' );
	$sizes   = wp_get_attachment_image_sizes( $image_id, 'full' );
	$alt     = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
	$alt     = $alt ?: $block['attrs']['alt'] ?? '';
	$caption = wp_get_attachment_caption( $image_id );

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
	$updater->setBranch( 'main' );
}
