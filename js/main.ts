/**
 * Created by Monyk on 19.03.2016.
 */

/// <reference path="jquery.d.ts"/>

function newNote():void
{
    $("#notename, #notemenu").show();
    $("body, #done").mousedown(function (e)
    {
        var target = $(e.target);
        if (target.is('#newnote') || target.parents('#newnote').length && !target.is('#done'))
            return;

        $("body, #done").unbind('mousedown', arguments.callee)

        $("#notename, #notemenu").hide();
        $("#plh1, #plh2").show();

        if(!$("#notetextwr").text())
            return;

        if (present[present.length - 1] != undefined)
            var id = +present[present.length - 1]['id'] + 1;
        else
            var id = 1;

        var note = {
            'label': $("#notenamewr").text(),
            'text': $("#notetextwr").text(),
            'id': id
        };
        $("#notenamewr").text("");
        $("#notetextwr").text("");
        addNote(note);
    });
}

var toRemove:Array<number> = [];
$(document).ready(function ()
{
    $("#notes").sortable(
        {
            cursor: "move",
            revert: true,
            scroll: false,
            helper: "clone",
            appendTo:document.body,
            containtment: "ul"
        }
    );
    $("#notes").disableSelection();
    $("#note-creator input").resizable();
    $("#menu-button").click(function ()
    {
        $("nav").toggle("slide", 200);
        setTimeout(function ()
        {
            $(document).mousedown(function (e)
            {
                var target = $(e.target);
                if (target.is('nav') || target.parents('nav').length
                    || target.is('#menu-button') || target.parents('#menu-button').length)
                    return;
                $(document).unbind("mousedown", arguments.callee);
                $("nav").hide("slide", 200);
            });
        }, 1);
    });

    //NEWNOTE MODULE



    $("#newnote").on("click",newNote);

    $("#notetextwr").on("input", function ()
    {
        if (this.textContent != "") $("#plh2").hide();
        else $("#plh2").show();
    });


    $("#notenamewr").on("input", function ()
    {
        if (this.textContent != "") $("#plh1").hide();
        else $("#plh1").show();
    });

    //SIGNOUT
    $("#signoutbutton").click(
        function ()
        {
            $.get("/main/signOut",
                function (data:string)
                {
                    if (data == "Fine")
                        window.location.replace("/login");
                    else
                        alert("signout error");
                })
        }
    );

    //DISPLAYNOTES

    for (var i = 0; i < present.length; i++)
    {
        displayNote(present[i]);
    }

    $("#notes").on("click","li", editNote);



    $("#color-picker, #color-picker-button").on("mouseover", function()
    {
        $("#color-picker").show();
        //$("#color-picker").css("opacity","1");
        //$("#color-picker").css("visibility","visibile");
    });

    $("#color-picker, #color-picker-button").on("mouseleave", function()
    {
        $("#color-picker").hide();
        //$("#color-picker").css("opacity","0");
        //$("#color-picker").css("visibility","hidden");
    });
})

function addNote(note:Object)
{
    displayNote(note);
    present.push(note);
    $.post("/main/addNote", note, function (data)
    {
        if (data == "Fine")
            return;
        else
            alert("Error adding new note");
    })
}

function displayNote(note:Object)
{
    var id = note['id'];
    $("#notes").append('<li class="panel panel-default" id = "' + id + '"> <div class="notetext panel-body"></div>' +
        '<div class="noteIcons">' +
        '<div class="remove-button"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div>' +
        '</div> </li>');

    $("#" + id + " .panel-body").text(note["text"]);
    $("#" + id + " .remove-button").click(function ()
    {
        toRemove.push($(this).parent().parent()[0].id);
        $(this).parent().parent().remove();
        RemoveAllThatHaveToBe(toRemove);
    });

    if (note['label'] != '')
    {
        $("#" + id).prepend('<div class="notelabel">' + note['label'] + '</div>');
    }


}

function RemoveAllThatHaveToBe(notes:Array<number>)
{
    if (notes.length > 0)
    {
        $.post("main/removeNotes", {ids: notes}, function (data)
        {
            if (data == "Nope")
                alert("Error deleting");
        });
    }
}


function editNote()
{
    $("#newnote").off("click");
    $("#notes li").off("click", editNote);
    var id = $(this)[0].id;
    $(this).css("visibility","hidden");
    $("#notename, #notemenu").show();

    $("#notenamewr").text($("#" + id +  " .notelabel").text());
    $("#notetextwr").text($("#" + id +  " .notetext").text());
    $("#notetextwr").trigger("input");
    $("#notenamewr").trigger("input");

    $("body, #done").mousedown(function (e)
    {
        var target = $(e.target);
        if (target.is('#newnote') || target.parents('#newnote').length && !target.is('#done'))
            return;

        $("body, #done").unbind('mousedown', arguments.callee);

        $("#notename, #notemenu").hide();
        $("#plh1, #plh2").show();

        if(!$("#notetextwr").text())
            return;

        var index = present.findIndex(x => x['id'] == id);

        present[index]['text'] = $("#notetextwr").text();
        present[index]['label'] = $("#notenamewr").text();

        $('#'+id+" .notelabel").text(present[index]['label']);
        $('#'+id+" .notetext").text(present[index]['text']);

        $('#'+id).css("visibility","visible");

        $("#newnote").on("click", newNote);
        $("#notes li").on("click", editNote);

        $("#notenamewr").text("");
        $("#notetextwr").text("");

    });
}