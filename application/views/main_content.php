<?php include 'header.php'; ?>
<nav>
    <ul class="nav nav-pills nav-stacked noselect">
        <div id="tagsNav">
            <div id="tagsNavHeader">Tags</div>
        </div>
        <div id="tagsCreator">
            <input type="text" placeholder="Create new tag..." aria-label="Create new tag...">
            <span class="glyphicon glyphicon-ok" aria-hidden="true"></span>
        </div>
        <li role="presentation">
            </div>
            <a id="signoutbutton" href="#">Sign Out</a>
        </li>
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
            <span class="glyphicon glyphicon-tag" aria-hidden="true"></span>
            <div id="tagPicker"></div>
            <button type="button" id="done" data-loading-text="Loading..." class="btn btn-primary" autocomplete="off">
                done.
            </button>
            <div class="tagsHolder">
            </div>
        </div>
    </div>
    <ul id="notes">
    </ul>
</div>
<script src="/js/main.js"></script>
