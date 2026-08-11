=== Zeddotes Enhanced Code Block ===
Contributors: zeddotes
Tags: code, syntax highlighting, prism, copy, gutenberg
Requires at least: 6.0
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Extends the core Code block with language selection (Prism.js) and a configurable copy button.

== Description ==

Zeddotes Enhanced Code Block adds inspector controls to the WordPress core Code block:

* Language select with Prism.js highlighting in the editor and on the frontend
* Optional line numbers
* Tab key indents inside the block (Shift+Tab outdents); optional spaces instead of tabs
* Configurable tab size (2 / 4 / 8)
* Optional copy button before or after the code block, aligned left / center / right (or hidden)

No separate block type — authors keep using the standard Code block.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/zeddotes-enhanced-code-block` (or this directory name).
2. Run `npm install` and `npm run build` if `build/` is not present.
3. Activate the plugin through the Plugins screen.
4. Insert a Code block and open the **Zeddotes Enhanced Code Block** panel in the sidebar.

== Frequently Asked Questions ==

= Does this replace the core Code block? =

No. It extends `core/code` via block filters.

= Where does highlighting run? =

In the block editor and on the frontend, via a bundled Prism.js build.

== Changelog ==

= 1.0.0 =
* Initial release: language select, Prism highlighting, configurable copy button.
