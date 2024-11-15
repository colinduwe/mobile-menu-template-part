/**
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

const { state, actions } = store( 'cdc/mobile-menu-template-part', {
	state: {
		get isMenuOpen() {
			// The menu is opened if either `click` or `focus` is true.
			return (
				Object.values( state.menuOpenedBy ).filter( Boolean ).length > 0
			);
		},
		get menuOpenedBy() {
			const context = getContext();
			return context.menuOpenedBy;
		},
		get roleAttribute() {
			return state.isMenuOpen
				? 'dialog'
				: null;
		},
		get ariaModal() {
			return state.isMenuOpen
				? 'true'
				: null;
		},
		get ariaLabel() {
			const context = getContext();
			return state.isMenuOpen
				? 'Menu'
				: null;
		}
	},
	actions: {
		toggleMenuOnClick() {
			const context = getContext();
			const { ref } = getElement();
			// Safari won't send focus to the clicked element, so we need to manually place it: https://bugs.webkit.org/show_bug.cgi?id=22261
			if ( window.document.activeElement !== ref ) ref.focus();

			if ( state.menuOpenedBy.click || state.menuOpenedBy.focus ) {
				actions.closeMenu( 'click' );
				actions.closeMenu( 'focus' );
			} else {
				context.previousFocus = ref;
				actions.openMenu( 'click' );
			}
		},
		closeMenuOnClick() {
			actions.closeMenu( 'click' );
			actions.closeMenu( 'focus' );
		},
		handleMenuKeydown( event ) {
			if ( state.menuOpenedBy.click ) {
				// If Escape close the menu.
				if ( event?.key === 'Escape' ) {
					actions.closeMenu( 'click' );
					actions.closeMenu( 'focus' );
				}
			}
		},
		handleMenuFocusout( event ) {
			const context = getContext();
			const menuContainer = context.mobileModalMenu?.querySelector(
				'.wp-block-cdc-mobile-menu-template-part__menu-container'
			);
			// If focus is outside menu, and in the document, close menu
			// event.target === The element losing focus
			// event.relatedTarget === The element receiving focus (if any)
			// When focusout is outside the document,
			// `window.document.activeElement` doesn't change.

			// The event.relatedTarget is null when something outside the navigation menu is clicked. This is only necessary for Safari.
			// TODO: There is still an issue in Safari where clicking on the menu link closes the menu. We don't want this. The toggleMenuOnClick callback should handle this.
			if (
				event.relatedTarget === null ||
				( ! menuContainer?.contains( event.relatedTarget ) &&
					event.target !== window.document.activeElement )
			) {
				//actions.closeMenu( 'click' );
				//actions.closeMenu( 'focus' );
			}
		},
		openMenu( menuOpenedOn = 'click' ) {
			state.menuOpenedBy[ menuOpenedOn ] = true;
			document.documentElement.classList.add('has-modal-open');
		},
		closeMenu( menuClosedOn = 'click' ) {
			const context = getContext();
			state.menuOpenedBy[ menuClosedOn ] = false;

			if ( ! state.isMenuOpen ) {
				context.previousFocus = null;
				context.mobileModalMenu = null;
				document.documentElement.classList.remove('has-modal-open');
			}
		},
	},
	callbacks: {
		initMenu() {
			const context = getContext();
			const { ref } = getElement();

			// Set the menu reference when initialized.
			if ( state.isMenuOpen ) {
				context.mobileModalMenu = ref;
			}
		},
	},
} );

