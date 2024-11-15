=== Mobile Menu Template Part ===
Contributors:      Colin Duwe
Tags:              block
Tested up to:      6.6
Stable tag:        0.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A block that displays a hamburger to reveal a template part in its modal rather than a navigation menu.

== Description ==

This block emulates the core/navigation block to display a hamburger to toggle the display of a modal. 
However, rather than display a navigation menu in that modal, it displays a selected template part. 
Via the site editor, you can design the template part to your liking with any blocks.

This block was inspired by and works well with the Mega Menu Block (https://developer.wordpress.org/news/2024/02/29/an-introduction-to-block-based-mega-menus/)
You can add Mega Menu template parts in the site Editor and then add them to the desktop horizonatl menu and also add the same
mega menu items in a navigation block placed within the mobile menu modal template part.

TODO:
1. Add color controls
2. Display template part in the editor
3. Support for sticky header in the modal, ideally with show/hide on scroll direction.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/mobile-menu-template-part` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Create a template part for this block to display via the Site Editor (WP Admin > Appearance > Edit > Patterns > Add New Pattern)
4. On the Add New Template Part modal, be sure to choose the "Menu" area
5. Add blocks you'd like to show on the modal such as buttons, navigation, and/or the seach form.
6. With the template part created, you can add this block to your site, perhaps in the Header template part.
7. After inseting the block use the block settings sidebar to select the menu template part you created earlier.

== Changelog ==

= 0.1.0 =
* Release
