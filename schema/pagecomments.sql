CREATE TABLE /*_*/pagecomments (
  page_id int NOT NULL,
  user_id int NOT NULL,
  comment varchar(2048) NOT NULL,
  created_at int(11) NOT NULL
) /*$wgDbTableOptions*/;