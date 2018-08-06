/**
 * WordPress dependencies
 */
import { getSettings } from '@wordpress/date';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { DateTimePicker } from '@wordpress/components';

export function PostSchedule( { date, onUpdateDate } ) {
	const settings = getSettings();
	// To know if the current timezone is a 12 hour time with look for "a" in the time format
	// We also make sure this a is not escaped by a "/"
	const is12HourTime = /a(?!\\)/i.test(
		settings.formats.time
			.toLowerCase() // Test only the lower case a
			.replace( /\\\\/g, '' ) // Replace "//" with empty strings
			.split( '' ).reverse().join( '' ) // Reverse the string and test for "a" not followed by a slash
	);

	return (
		<DateTimePicker
			key="date-time-picker"
			currentDate={ date }
			onChange={ onUpdateDate }
			locale={ settings.l10n.locale }
			is12Hour={ is12HourTime }
		/>
	);
}

export default compose( [
	withSelect( ( select ) => {
		return {
			date: select( 'core/editor' ).getEditedPostAttribute( 'date' ),
			dateFloating: select( 'core/editor' ).getEditedPostAttribute( 'date_floating' ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		return {
			onUpdateDate( date, dateFloating = false ) {
				dispatch( 'core/editor' ).editPost( { date, date_floating: dateFloating } );
			},
		};
	} ),
] )( PostSchedule );
