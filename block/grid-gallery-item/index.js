/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { upload as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import edit from './edit';
import save from './save';

registerBlockType(metadata.name, {
	...metadata,
	icon,
	edit,
	save,
});
