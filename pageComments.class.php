<?php

/**
 * Class for pageComments extension
 *
 * @file
 * @ingroup Extensions
 */
class pageComments
{

    /**
     * @param Parser $parser
     * @return array
     */
    public static function render( $parser )
    {
        $html = '';

//        $html .= $parser->insertStripItem( '<a href="#" class="page-comments-wrapper" id="show-comments-link"><i class="fa fa-comment-o"></i>  '.
//            wfMessage( 'pagecomments-comment-link' )->plain()
//            .'</a>' );

        // We already have comments popup form in our skin, lets keep it simple and let it be there

	    $html = '<div class="right-col-comments-block"></div>';

        $parser->getOutput()->addModules('ext.pagecomments.foo');

        return array(
            $html,
            'markerType' => 'nowiki'
        );
    }

    /**
     * @param int $page_id
     * @return array
     */
    public static function getPageComments( $page_id )
    {
        $dbr = wfGetDB(DB_SLAVE);
        $result = $dbr->select(
            'pagecomments',
            '*',
            array(
                'page_id' => $page_id
            ),
            __METHOD__,
            array(
                'ORDER BY' => 'created_at DESC'
            )
        );
        $comments = array();
        while( $row = $result->fetchRow() ) {
            $username = User::newFromId( $row['user_id'] )->getName();
            $row['user_name'] = $username;
            $comments[] = $row;
        }
        return $comments;
    }

    /**
     * @param int $page_id
     * @param string $comment
     * @param int $user_id
     */
    public static function addPageComment( $page_id, $comment, $user_id )
    {
        $dbw = wfGetDB(DB_MASTER);
        $dbw->insert(
            'pagecomments',
            array(
                'page_id' => $page_id,
                'user_id' => $user_id,
                'comment' => $comment,
                'created_at' => time()
            )
        );
    }

}
