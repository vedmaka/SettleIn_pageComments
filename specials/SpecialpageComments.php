<?php

/**
 * pageComments SpecialPage for pageComments extension
 *
 * @file
 * @ingroup Extensions
 */
class SpecialpageComments extends SpecialPage
{
    public function __construct()
    {
        parent::__construct( 'pageComments' );
    }

    /**
     * Show the page to the user
     *
     * @param string $sub The subpage string argument (if any).
     *  [[Special:pageComments/subpage]].
     */
    public function execute( $sub )
    {
        $out = $this->getOutput();

        $out->setPageTitle( $this->msg( 'pagecomments-helloworld' ) );

        $out->addHelpLink( 'How to become a MediaWiki hacker' );

        $out->addWikiMsg( 'pagecomments-helloworld-intro' );
    }

    protected function getGroupName()
    {
        return 'other';
    }
}
