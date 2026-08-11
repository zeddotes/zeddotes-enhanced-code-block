/**
 * Frontend: Prism highlighting + copy button injection.
 */
import Prism from './prism';
import './style.scss';

const COPY_LABEL = 'Copy';
const COPIED_LABEL = 'Copied';
const COPIED_MS = 2000;

/**
 * Copy text with Clipboard API and execCommand fallback.
 *
 * @param {string} text Text to copy.
 * @return {Promise<boolean>} Whether copy succeeded.
 */
async function copyText( text ) {
	if ( navigator.clipboard && window.isSecureContext ) {
		try {
			await navigator.clipboard.writeText( text );
			return true;
		} catch ( err ) {
			// Fall through to execCommand.
		}
	}

	const textarea = document.createElement( 'textarea' );
	textarea.value = text;
	textarea.setAttribute( 'readonly', '' );
	textarea.style.position = 'fixed';
	textarea.style.opacity = '0';
	document.body.appendChild( textarea );
	textarea.select();

	let ok = false;
	try {
		ok = document.execCommand( 'copy' );
	} catch ( err ) {
		ok = false;
	}

	document.body.removeChild( textarea );
	return ok;
}

/**
 * Insert a copy toolbar before or after the code block (never inside it).
 *
 * @param {HTMLElement} blockEl .wp-block-code element.
 */
function enhanceCopyButton( blockEl ) {
	if (
		blockEl.previousElementSibling?.classList.contains(
			'zeddotes-enhanced-code-block-copy-bar'
		) ||
		blockEl.nextElementSibling?.classList.contains( 'zeddotes-enhanced-code-block-copy-bar' )
	) {
		return;
	}

	const codeEl = blockEl.querySelector( 'code' );
	if ( ! codeEl || ! blockEl.parentNode ) {
		return;
	}

	const placement =
		blockEl.getAttribute( 'data-copy-placement' ) === 'before'
			? 'before'
			: 'after';
	const align = blockEl.getAttribute( 'data-copy-align' ) || 'right';
	const safeAlign = [ 'left', 'center', 'right' ].includes( align )
		? align
		: 'right';

	const bar = document.createElement( 'div' );
	bar.className = `zeddotes-enhanced-code-block-copy-bar copy-align-${ safeAlign }`;

	const button = document.createElement( 'button' );
	button.type = 'button';
	button.className = 'zeddotes-enhanced-code-block-copy';
	button.textContent = COPY_LABEL;
	button.setAttribute( 'aria-label', COPY_LABEL );

	button.addEventListener( 'click', async () => {
		const ok = await copyText( codeEl.textContent || '' );
		if ( ! ok ) {
			return;
		}

		button.textContent = COPIED_LABEL;
		button.classList.add( 'is-copied' );

		window.setTimeout( () => {
			button.textContent = COPY_LABEL;
			button.classList.remove( 'is-copied' );
		}, COPIED_MS );
	} );

	bar.appendChild( button );

	if ( placement === 'before' ) {
		blockEl.parentNode.insertBefore( bar, blockEl );
	} else {
		blockEl.parentNode.insertBefore( bar, blockEl.nextSibling );
	}
}

/**
 * Apply tab-size from data attribute when inline style is missing.
 *
 * @param {HTMLElement} blockEl .wp-block-code element.
 */
function applyTabSize( blockEl ) {
	const tabSize = blockEl.getAttribute( 'data-tab-size' );
	if ( ! tabSize ) {
		return;
	}
	blockEl.style.tabSize = tabSize;
	blockEl.style.MozTabSize = tabSize;
}

/**
 * Initialize Prism and copy buttons.
 */
function init() {
	const blocks = document.querySelectorAll( '.wp-block-code' );

	blocks.forEach( ( blockEl ) => {
		applyTabSize( blockEl );
		if ( blockEl.classList.contains( 'has-copy-button' ) ) {
			enhanceCopyButton( blockEl );
		}
	} );

	Prism.highlightAll();
}

if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', init );
} else {
	init();
}
