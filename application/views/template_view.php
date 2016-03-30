<!DOCTYPE html>
<html>
  <head>
      <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>MNotes</title>
    <link href="/bootstrap/css/bootstrap.min.css" rel="stylesheet">
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
      <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
      <script src="/bootstrap/js/bootstrap.min.js"></script>
      <link href='https://fonts.googleapis.com/css?family=Roboto+Slab:400,300,700|Roboto:400,300,500,700|Roboto+Condensed:400,300,700'
            rel='stylesheet' type='text/css'>
      <link href="/css/template_view.css" rel="stylesheet">
  </head>
  <body>
    <?php include 'header.php'; ?>
    <nav>
        <ul class="nav nav-pills nav-stacked noselect">
            <li role="presentation" class="active"><a href="#">Home</a></li>
            <li role="presentation"><a href="#">Profile</a></li>
            <li role="presentation"><a id="signoutbutton" href="#">Sign Out</a></li>
        </ul>
    </nav>
    <?php include 'application/views/'.$content_view; ?>
    <!-- javascript calls-->
  </body>
</html>
