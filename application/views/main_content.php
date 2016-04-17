<?php include 'header.php'; ?>
<nav>
    <ul class="nav nav-pills nav-stacked noselect">
        <li role="presentation"><a id="signoutbutton" href="#">Sign Out</a></li>
    </ul>
</nav>
<div id="content">
    <div class="panel" id="newNote">
        <div id="noteName">
            <div id="plh1">Title</div>
            <div id="noteNameWr" contenteditable="true"></div>
        </div>
        <div id="noteText">
            <div id="plh2">Note...</div>
            <div id="noteTextWr" contenteditable="true"></div>
        </div>
            <div id="notemenu">
                <button type="button" id="done" data-loading-text="Loading..." class="btn btn-primary" autocomplete="off">
                    done.
                </button>
            </div>
        </div>
        <ul id="notes">
        </ul>
    
</div>
<script src="/js/main.js"></script>