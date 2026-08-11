<?php
/**
 * Plugin Name:       Zeddotes Enhanced Code Block
 * Description:       Extends the core Code block with language selection (Prism) and a configurable copy button.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Zain Syed
 * Author URI:        https://github.com/zeddotes
 * Plugin URI:        https://github.com/zeddotes/zeddotes-enhanced-code-block
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       zeddotes-enhanced-code-block
 *
 * @package ZeddotesEnhancedCodeBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ZEDDOTES_ENHANCED_CODE_BLOCK_VERSION', '1.0.0' );
define( 'ZEDDOTES_ENHANCED_CODE_BLOCK_FILE', __FILE__ );
define( 'ZEDDOTES_ENHANCED_CODE_BLOCK_DIR', plugin_dir_path( __FILE__ ) );
define( 'ZEDDOTES_ENHANCED_CODE_BLOCK_URL', plugin_dir_url( __FILE__ ) );

/**
 * Enqueue editor script that extends core/code.
 */
function zeddotes_enhanced_code_block_enqueue_editor_assets() {
	$asset_file = ZEDDOTES_ENHANCED_CODE_BLOCK_DIR . 'build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	wp_enqueue_script(
		'zeddotes-enhanced-code-block-editor',
		ZEDDOTES_ENHANCED_CODE_BLOCK_URL . 'build/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_set_script_translations( 'zeddotes-enhanced-code-block-editor', 'zeddotes-enhanced-code-block' );
}
add_action( 'enqueue_block_editor_assets', 'zeddotes_enhanced_code_block_enqueue_editor_assets' );

/**
 * Load editor canvas styles (iframe-safe via enqueue_block_assets).
 */
function zeddotes_enhanced_code_block_enqueue_editor_styles() {
	if ( ! is_admin() ) {
		return;
	}

	$asset_file = ZEDDOTES_ENHANCED_CODE_BLOCK_DIR . 'build/index.asset.php';
	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset       = include $asset_file;
	$shared_css  = ZEDDOTES_ENHANCED_CODE_BLOCK_DIR . 'build/style-index.css';
	$editor_css  = ZEDDOTES_ENHANCED_CODE_BLOCK_DIR . 'build/index.css';
	$style_deps  = array();

	if ( file_exists( $shared_css ) ) {
		wp_enqueue_style(
			'zeddotes-enhanced-code-block-style',
			ZEDDOTES_ENHANCED_CODE_BLOCK_URL . 'build/style-index.css',
			array(),
			$asset['version']
		);
		$style_deps[] = 'zeddotes-enhanced-code-block-style';
	}

	if ( file_exists( $editor_css ) ) {
		wp_enqueue_style(
			'zeddotes-enhanced-code-block-editor',
			ZEDDOTES_ENHANCED_CODE_BLOCK_URL . 'build/index.css',
			$style_deps,
			$asset['version']
		);
	}
}
add_action( 'enqueue_block_assets', 'zeddotes_enhanced_code_block_enqueue_editor_styles' );

/**
 * Enqueue frontend Prism + copy-button assets on singular views.
 */
function zeddotes_enhanced_code_block_enqueue_frontend_assets() {
	if ( ! is_singular() ) {
		return;
	}

	$asset_file = ZEDDOTES_ENHANCED_CODE_BLOCK_DIR . 'build/view.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	wp_enqueue_script(
		'zeddotes-enhanced-code-block-view',
		ZEDDOTES_ENHANCED_CODE_BLOCK_URL . 'build/view.js',
		$asset['dependencies'],
		$asset['version'],
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	$view_css = ZEDDOTES_ENHANCED_CODE_BLOCK_DIR . 'build/view.css';
	if ( file_exists( $view_css ) ) {
		wp_enqueue_style(
			'zeddotes-enhanced-code-block-prism',
			ZEDDOTES_ENHANCED_CODE_BLOCK_URL . 'build/view.css',
			array(),
			$asset['version']
		);
	}

	// Shared styles may be emitted as style-view.css or style-index.css.
	$style_file = ZEDDOTES_ENHANCED_CODE_BLOCK_DIR . 'build/style-view.css';
	$style_url  = ZEDDOTES_ENHANCED_CODE_BLOCK_URL . 'build/style-view.css';
	if ( ! file_exists( $style_file ) ) {
		$style_file = ZEDDOTES_ENHANCED_CODE_BLOCK_DIR . 'build/style-index.css';
		$style_url  = ZEDDOTES_ENHANCED_CODE_BLOCK_URL . 'build/style-index.css';
	}

	if ( file_exists( $style_file ) ) {
		wp_enqueue_style(
			'zeddotes-enhanced-code-block-view',
			$style_url,
			array( 'zeddotes-enhanced-code-block-prism' ),
			$asset['version']
		);
	}
}
add_action( 'wp_enqueue_scripts', 'zeddotes_enhanced_code_block_enqueue_frontend_assets' );
