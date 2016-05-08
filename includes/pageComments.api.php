<?php

class pageCommentsApi extends ApiBase {

    public function execute()
    {
        $params = $this->extractRequestParams();

        $page_id = $params['page_id'];
        $do = $params['do'];
        $user = $this->getUser();
        $formattedData = array(
            'status' => 400
        );

        switch( $do ) {

            case "pagecomments":

                $comments = pageComments::getPageComments( $page_id );
                $formattedData['comments'] = $comments;

                break;

            case "addcomment":

                // Do not allow anonymous users to comment
                if( !$user || $user->isAnon() ) {
                    return false;
                }

                $commentText = $params['comment'];
                pageComments::addPageComment( $page_id, $commentText, $user->getId() );
                $formattedData['status'] = 200;
                $formattedData['comment'] = array(
                    'user_id' => $user->getId(),
                    'user_name' => $user->getName(),
                    'created_at' => time(),
                    'comment' => $commentText,
                    'page_id' => $page_id
                );

                break;

        }

        $this->getResult()->addValue( null, $this->getModuleName(), $formattedData );

    }

    public function getAllowedParams( /* $flags = 0 */ )
    {
        return array(
            'page_id' => array(
                ApiBase::PARAM_REQUIRED => true,
                ApiBase::PARAM_TYPE => 'integer'
            ),
            'comment' => array(
                ApiBase::PARAM_REQUIRED => false,
                ApiBase::PARAM_TYPE => 'string'
            ),
            'do' => array(
                ApiBase::PARAM_REQUIRED => true,
                ApiBase::PARAM_TYPE => 'string'
            )
        );
    }

}