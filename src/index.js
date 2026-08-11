/**
 * Extends core/code with language, copy button, editor highlighting, and tabs.
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';
import { cloneElement, Children, isValidElement } from '@wordpress/element';

import ZeddotesEnhancedCodeBlockEdit from './edit';
import './style.scss';
import './editor.scss';

const BLOCK_NAME = 'core/code';

/**
 * Merge class names, dropping empties.
 *
 * @param {...string} classNames Class name fragments.
 * @return {string} Merged className.
 */
function mergeClassNames( ...classNames ) {
	return classNames.filter( Boolean ).join( ' ' ).replace( /\s+/g, ' ' ).trim();
}

/**
 * Register Zeddotes Enhanced Code Block attributes on core/code.
 *
 * @param {Object} settings Block settings.
 * @param {string} name     Block name.
 * @return {Object} Filtered settings.
 */
function addZeddotesEnhancedCodeBlockAttributes( settings, name ) {
	if ( name !== BLOCK_NAME ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...settings.attributes,
			language: {
				type: 'string',
				default: '',
			},
			showCopy: {
				type: 'boolean',
				default: true,
			},
			copyPlacement: {
				type: 'string',
				default: 'after',
			},
			copyAlign: {
				type: 'string',
				default: 'right',
			},
			tabSize: {
				type: 'number',
				default: 4,
			},
			indentWithSpaces: {
				type: 'boolean',
				default: true,
			},
			showLineNumbers: {
				type: 'boolean',
				default: false,
			},
		},
	};
}

addFilter(
	'blocks.registerBlockType',
	'zeddotes-enhanced-code-block/attributes',
	addZeddotesEnhancedCodeBlockAttributes
);

/**
 * Add copy-related classes/data attrs and tab-size on the saved <pre>.
 *
 * @param {Object} props      Extra props.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Block attributes.
 * @return {Object} Filtered props.
 */
function addZeddotesEnhancedCodeBlockExtraProps( props, blockType, attributes ) {
	if ( blockType.name !== BLOCK_NAME ) {
		return props;
	}

	const {
		showCopy = true,
		copyPlacement = 'after',
		copyAlign = 'right',
		tabSize = 4,
		showLineNumbers = false,
	} = attributes;

	const resolvedTabSize = Number( tabSize ) || 4;
	const placement = copyPlacement === 'before' ? 'before' : 'after';
	const align = [ 'left', 'center', 'right' ].includes( copyAlign )
		? copyAlign
		: 'right';
	const extraClasses = [];

	if ( showLineNumbers ) {
		extraClasses.push( 'line-numbers' );
	}

	if ( showCopy ) {
		extraClasses.push(
			'has-copy-button',
			`copy-placement-${ placement }`,
			`copy-align-${ align }`
		);
	}

	const next = {
		...props,
		className: mergeClassNames( props.className, ...extraClasses ),
		style: {
			...( props.style || {} ),
			tabSize: resolvedTabSize,
			MozTabSize: resolvedTabSize,
		},
		'data-tab-size': String( resolvedTabSize ),
	};

	if ( showCopy ) {
		next[ 'data-copy-placement' ] = placement;
		next[ 'data-copy-align' ] = align;
	}

	return next;
}

addFilter(
	'blocks.getSaveContent.extraProps',
	'zeddotes-enhanced-code-block/extra-props',
	addZeddotesEnhancedCodeBlockExtraProps
);

/**
 * Add language-* class on the inner <code> element for Prism.
 *
 * @param {Object} element    Save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Block attributes.
 * @return {Object} Filtered element.
 */
function addZeddotesEnhancedCodeBlockSaveElement( element, blockType, attributes ) {
	if ( blockType.name !== BLOCK_NAME || ! element || ! attributes?.language ) {
		return element;
	}

	const languageClass = `language-${ attributes.language }`;

	const children = Children.map( element.props.children, ( child ) => {
		if ( ! isValidElement( child ) || child.type !== 'code' ) {
			return child;
		}

		return cloneElement( child, {
			className: mergeClassNames( child.props.className, languageClass ),
		} );
	} );

	return cloneElement(
		element,
		{
			className: mergeClassNames( element.props.className, languageClass ),
		},
		children
	);
}

addFilter(
	'blocks.getSaveElement',
	'zeddotes-enhanced-code-block/save-element',
	addZeddotesEnhancedCodeBlockSaveElement
);

/**
 * Replace core Code edit with the Zeddotes Enhanced Code Block editor.
 */
const withZeddotesEnhancedCodeBlockEdit = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		if ( props.name !== BLOCK_NAME ) {
			return <BlockEdit { ...props } />;
		}

		return <ZeddotesEnhancedCodeBlockEdit { ...props } />;
	};
}, 'withZeddotesEnhancedCodeBlockEdit' );

addFilter(
	'editor.BlockEdit',
	'zeddotes-enhanced-code-block/edit',
	withZeddotesEnhancedCodeBlockEdit
);
