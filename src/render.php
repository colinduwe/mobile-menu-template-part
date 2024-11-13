<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */
$menu_slug	= esc_attr( $attributes['menuSlug'] ?? '');
$unique_id = wp_unique_id( );

// Don't display the mega menu link if there is no menu slug.
if ( ! $menu_slug ) {
	return null;	
}

$wrapper_attributes = get_block_wrapper_attributes();

$menu_classes  = 'wp-block-cdc-mobile-menu-template-part__menu-container';

// Icons.
$close_icon  = '<svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none" aria-hidden="true" focusable="false">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M8.51375 6.24187C8.12322 5.85134 7.49006 5.85134 7.09953 6.24187C6.70901 6.63239 6.70901 7.26556 7.09953 7.65608L15.4434 15.9999L7.09954 24.3438C6.70902 24.7343 6.70902 25.3675 7.09954 25.758C7.49007 26.1485 8.12323 26.1485 8.51376 25.758L16.8576 17.4142L25.2015 25.758C25.592 26.1485 26.2252 26.1485 26.6157 25.758C27.0062 25.3675 27.0062 24.7343 26.6157 24.3438L18.2718 15.9999L26.6157 7.65608C27.0062 7.26556 27.0062 6.6324 26.6157 6.24187C26.2252 5.85135 25.592 5.85135 25.2015 6.24187L16.8576 14.5857L8.51375 6.24187Z" fill="#1D1D1C"/>
</svg>';
$toggle_icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false" fill="none"><path d="M1.50002 4L6.00002 8L10.5 4" stroke-width="1.5"></path></svg>';

$should_display_icon_label = isset( $attributes['hasIcon'] ) && true === $attributes['hasIcon'];
$toggle_button_icon        = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="7.5" width="16" height="1.5" /><rect x="4" y="15" width="16" height="1.5" /></svg>';
if ( isset( $attributes['icon'] ) ) {
	if ( 'menu' === $attributes['icon'] ) {
		$toggle_button_icon = '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 5v1.5h14V5H5zm0 7.8h14v-1.5H5v1.5zM5 19h14v-1.5H5V19z" /></svg>';
	}
}
$toggle_button_content       = $should_display_icon_label ? $toggle_button_icon : __( 'Menu' );
$toggle_close_button_icon    = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06L12 13.06l6.47 6.47 1.06-1.06L13.06 12Z"></path></svg>';
$toggle_close_button_content = $should_display_icon_label ? $toggle_close_button_icon : __( 'Close' );
$toggle_aria_label_open      = $should_display_icon_label ? 'aria-label="' . __( 'Open menu' ) . '"' : ''; // Open button label.
$toggle_aria_label_close     = $should_display_icon_label ? 'aria-label="' . __( 'Close menu' ) . '"' : ''; // Close button label.

?>

<nav
	<?php echo $wrapper_attributes; ?>
	aria-label="Navigation <?php echo $unique_id; ?>"
	data-wp-interactive='{ "namespace": "cdc/mobile-menu-template-part" }'
	data-wp-context='{ "menuOpenedBy": {} }'
	data-wp-on--focusout="actions.handleMenuFocusout"
	data-wp-on--keydown="actions.handleMenuKeydown"
	data-wp-watch="callbacks.initMenu"
>
	<?php echo sprintf(
		'<button aria-haspopup="dialog" %1$s class="%2$s" %4$s>%3$s</button>',
		$toggle_aria_label_open,
		'wp-block-cdc-mobile-menu-template-part__responsive-container-open always-shown',
		$toggle_button_content,
		'data-wp-on--click="actions.toggleMenuOnClick" data-wp-bind--aria-expanded="state.isMenuOpen"'
	); ?>
	<div
		class="<?php echo $menu_classes; ?>"
		tabindex="-1"
		data-wp-class--is-modal-open="state.isMenuOpen"
	>
		<div class="wp-block-cdc-mobile-menu-template-part__responsive-close" tabindex="-1">
			<div 
				class="wp-block-cdc-mobile-menu-template-part__responsive-dialog"
				data-wp-bind--aria-modal="state.ariaModal"
				data-wp-bind--aria-label="state.ariaLabel"
				data-wp-bind--role="state.roleAttribute"
			>
				<?php echo sprintf( '<button %1$s class="wp-block-cdc-mobile-menu-template-part__responsive-container-close" %3$s>%2$s</button>', 
					$toggle_aria_label_close,
					$toggle_close_button_content,
					'data-wp-on--click="actions.closeMenuOnClick"'
				); ?>
				<?php echo block_template_part( $menu_slug ); ?>
			</div>
		</div>
	</div>
</nav>
