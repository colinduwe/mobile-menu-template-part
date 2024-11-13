/**
 * External dependencies
 */
import clsx from 'clsx';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	useBlockProps,
	useBlockEditingMode,
} from '@wordpress/block-editor';
import { useEntityRecords } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { useState, createInterpolateElement } from '@wordpress/element';
import {
	ComboboxControl,
	PanelBody,
	Notice,
	TextControl,
	Button
} from '@wordpress/components';
import { close, Icon } from '@wordpress/icons';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import './editor.scss';
import OverlayMenuIcon from './overlay-menu-icon';
import OverlayMenuPreview from './overlay-menu-preview';
import ResponsiveWrapper from './responsive-wrapper';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		label,
		menuSlug,
		hasIcon,
		icon = 'handle',
		overlayBackgroundColor,
		overlayTextColor,
	} = attributes;

	const overlayMenu = 'always';
	
	const blockProps = useBlockProps();

	// Get the Url for the template part screen in the Site Editor.
	const siteUrl = useSelect( ( select ) => select( 'core' ).getSite()?.url );
	const menuTemplateUrl = siteUrl
		? siteUrl +
		  '/wp-admin/site-editor.php?path=%2Fpatterns&categoryType=wp_template_part&categoryId=menu'
		: '';

	// Fetch all template parts.
	const { hasResolved, records } = useEntityRecords(
		'postType',
		'wp_template_part',
		{
			per_page: -1,
		}
	);

	let menuOptions = [];

	// Filter the template parts for those in the 'menu' area.
	if ( hasResolved ) {
		menuOptions = records
			.filter( ( item ) => item.area === 'menu' )
			.map( ( item ) => ( {
				label: item.title.rendered,
				value: item.slug,
			} ) );
	}

	const hasMenus = menuOptions.length > 0;
	const selectedMenuAndExists = menuSlug
		? menuOptions.some( ( option ) => option.value === menuSlug )
		: true;

	// Notice for when no menus have been created.
	const noMenusNotice = (
		<Notice status="warning" isDismissible={ false }>
			{ createInterpolateElement(
				__(
					'No menu templates could be found. Create a new one in the <a>Site Editor</a>.',
					'mobile-menu-template-part'
				),
				{
					a: (
						<a // eslint-disable-line
							href={ menuTemplateUrl }
							target="_blank"
							rel="noreferrer"
						/>
					),
				}
			) }
		</Notice>
	);

	// Notice for when the selected menu template no longer exists.
	const menuDoesntExistNotice = (
		<Notice status="warning" isDismissible={ false }>
			{ __(
				'The selected menu template no longer exists. Choose another.',
				'mobile-menu-template-part'
			) }
		</Notice>
	);

	const [ overlayMenuPreview, setOverlayMenuPreview ] = useState( false );

	const overlayMenuPreviewClasses = clsx(
		'wp-block-navigation__overlay-menu-preview',
		{ open: overlayMenuPreview }
	);

	const overlayMenuPreviewId = useInstanceId(
		OverlayMenuPreview,
		`overlay-menu-preview`
	);

	const blockEditingMode = useBlockEditingMode();

	const isResponsive = 'never' !== overlayMenu;

	const isHiddenByDefault = 'always' === overlayMenu;

	const [ isResponsiveMenuOpen, setResponsiveMenuVisibility ] =
		useState( false );

	const stylingInspectorControls = (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Display' ) }>
					<>
						<Button
							__next40pxDefaultSize
							className={ overlayMenuPreviewClasses }
							onClick={ () => {
								setOverlayMenuPreview(
									! overlayMenuPreview
								);
							} }
							aria-label={ __( 'Overlay menu controls' ) }
							aria-controls={ overlayMenuPreviewId }
							aria-expanded={ overlayMenuPreview }
						>
							{ hasIcon && (
								<>
									<OverlayMenuIcon icon={ icon } />
									<Icon icon={ close } />
								</>
							) }
							{ ! hasIcon && (
								<>
									<span>{ __( 'Menu' ) }</span>
									<span>{ __( 'Close' ) }</span>
								</>
							) }
						</Button>
						<div id={ overlayMenuPreviewId }>
							{ overlayMenuPreview && (
								<OverlayMenuPreview
									setAttributes={ setAttributes }
									hasIcon={ hasIcon }
									icon={ icon }
									hidden={ ! overlayMenuPreview }
								/>
							) }
						</div>
					</>
				</PanelBody>
			</InspectorControls>
		</>
	);

	return (
		<>
			<InspectorControls group="settings">
				<PanelBody
					className="cdc-mobile-menut-template-part__settings-panel"
					title={ __( 'Settings', 'mobile-menu-template-part' ) }
					initialOpen={ true }
				>
					<TextControl
						label={ __( 'Label', 'mobile-menu-template-part' ) }
						type="text"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						autoComplete="off"
					/>
					<ComboboxControl
						label={ __( 'Menu Template', 'mobile-menu-template-part' ) }
						value={ menuSlug }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( { menuSlug: value } )
						}
						help={
							hasMenus &&
							createInterpolateElement(
								__(
									'Create and modify menu templates in the <a>Site Editor</a>.',
									'mobile-menu-template-part'
								),
								{
									a: (
									<a // eslint-disable-line
											href={ menuTemplateUrl }
											target="_blank"
											rel="noreferrer"
										/>
									),
								}
							)
						}
					/>
					{ ! hasMenus && noMenusNotice }
					{ hasMenus &&
						! selectedMenuAndExists &&
						menuDoesntExistNotice }
				</PanelBody>
			</InspectorControls>
			{ blockEditingMode === 'default' && stylingInspectorControls }
			<div { ...blockProps } >
				<ResponsiveWrapper
					id={ clientId }
					onToggle={ setResponsiveMenuVisibility }
					hasIcon={ hasIcon }
					icon={ icon }
					isOpen={ isResponsiveMenuOpen }
					isResponsive={ isResponsive }
					isHiddenByDefault={ isHiddenByDefault }
					overlayBackgroundColor={
						overlayBackgroundColor
					}
					overlayTextColor={ overlayTextColor }
				>
					
				</ResponsiveWrapper>
			</div>
		</>
	);
}
