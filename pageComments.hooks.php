<?php

/**
 * Hooks for pageComments extension
 *
 * @file
 * @ingroup Extensions
 */
class pageCommentsHooks
{

	public static function onExtensionLoad()
	{
		
	}

	public static function onNameOfHook()
	{
		
	}

	/**
	 * @param Parser $parser
	 */
	public static function onParserFirstCallInit( $parser )
	{
		$parser->setFunctionHook('pagecomments', 'pageComments::render');
	}

	/**
	 * @param DatabaseUpdater $updater
	 */
	public static function onLoadExtensionSchemaUpdates( $updater )
	{
		$updater->addExtensionTable(
			'pagecomments',
			dirname( __FILE__ ) . '/schema/pagecomments.sql'
		);
	}

}
