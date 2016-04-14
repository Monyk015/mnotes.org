/// <reference path="jquery.d.ts"/>
/// <reference path="jqueryui.d.ts"/>

class G
{
    static currentColor:string = "white";
    static toRemove:Array<number> = [];
    static present:Array<note> = present;
    static editMode:boolean = false;
}

interface note
{
    id:number;
    label?:string;
    text:string;
    color:string;
}

function changeColor(color:string, changeSelected:boolean = true)
{
    if(changeSelected)
        for(let i = 0; i < G.present.length; i++)
            if($("#" + G.present[i].id).attr("class").indexOf('ui-selected') > -1)
            {
                $("#" + G.present[i].id).removeClass(G.present[i].color);
                G.present[i].color = color;
                $("#" + G.present[i].id).addClass(G.present[i].color);
                update();
            }

    if(G.editMode)
    {
        $("#color-picker ." + G.currentColor).html("");
        $("#newnote").removeClass(G.currentColor);
        G.currentColor = color;
        $("#newnote").addClass(G.currentColor);
        $("#color-picker ." + G.currentColor).html('<span class="glyphicon glyphicon-ok"></span>');
    }
}

function newNoteEventListener():void
{
    G.editMode = true;
    $("#notename, #notemenu").show();
    $("body, #done").mousedown(function (e)
    {
        let target = $(e.target);
        if (target.is('#newnote') || target.parents('#newnote').length && !target.is('#done')
            || target.is('#color-picker') || target.parents('#color-picker').length)
            return;


        $("body, #done").unbind('mousedown', arguments.callee)
        
        $("#notename, #notemenu").hide();
        $("#plh1, #plh2").show();
        
        if (!$("#notetextwr").text())
            return;
        
        let id = 1;
        
        if (G.present[G.present.length - 1] != undefined)
        {
            id = +G.present[G.present.length - 1]['id'] + 1;
        }
        
        
        let note:note = {
            'label': $("#notenamewr").text(),
            'text': $("#notetextwr").text(),
            'id': id,
            'color': G.currentColor
        };
        
        G.present.push(note);
        
        $("#notenamewr").text("");
        $("#notetextwr").text("");
        newNote(note);
        
        changeColor("white",false);

        G.editMode = false;
    });
}


function newNote(note:note)
{
    displayNote(note);
    present.push(note);
    $.post("/main/newNote", note, function (data)
    {
        if (data == "Fine")
            return;
        else
            alert("Error adding new note");
    })
}

function defineFont(id:Number)
{
    let length = $("#" + id + " .panel-body").text().length;
    
    if (length < 8)
    {
        $("#" + id + " .notetext").css("font-size", "36px");
        $("#" + id + " .notetext").css("font-weight", "100");
    }
    else if (length < 15)
    {
        $("#" + id + " .notetext").css("font-size", "24px");
        $("#" + id + " .notetext").css("font-weight", "300");
    }
    else
    {
        $("#" + id + " .notetext").css("font-size", "14px");
        $("#" + id + " .notetext").css("font-weight", "400");
    }
}

function displayNote(note:note)
{
    let id = note['id'];
    $("#notes").append('<li class="panel panel-default note" id = "' + id + '"> <div class="notetext panel-body"></div>' +
        '<div class="noteIcons">' +
        '<div class="remove-button"></div>' +
        '</div> </li>');
    $("#" + id).addClass(note.color);
    $("#" + id + " .panel-body").text(note["text"]);
    $("#" + id + " .remove-button").click(function ()
    {
        toRemove.push(+$(this).parent().parent()[0].id);
        $(this).parent().parent().remove();
    });
    
    defineFont(id);
    
    if (note['label'] != '')
    {
        $("#" + id).prepend('<div class="notelabel">' + note['label'] + '</div>');
    }
    
    
}

function deleteSelected()
{
    for(let i = 0;  i < $('.ui-selected').length;  i++)
        G.toRemove.push(+$('.ui-selected')[ i].id);
    $('.ui-selected').hide();
    removeAllThatHaveToBe(G.toRemove);
}

function removeAllThatHaveToBe(notes:Array<number>)
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

function update()
{
    $.post("main/update", {present: G.present}, function (data)
    {
        if (data == "Nope")
            alert("Error updating");
    })
}

function editNote():void
{
    G.editMode = true;
    $("#newnote").off("click");
    $("#notes li").off("click", editNote);
    
    let id:number = +$(this)[0].id;
    let index:number = G.present.findIndex(x => x['id'] == id);
    let note:note = G.present[index];
    
    $(this).css("visibility", "hidden");
    $("#notename, #notemenu").show();
    
    $("#notenamewr").text(note.label);
    $("#notetextwr").text(note.text);
    changeColor(note.color, false);
    $("#notetextwr").trigger("input");
    $("#notenamewr").trigger("input");
    
    
    $("body, #done").mousedown(function (e)
    {
        let target = $(e.target);
        if (target.is('#newnote') || (target.parents('#newnote').length && !target.is('#done'))
            || target.is('#color-picker') || target.parents('#color-picker').length)
            return;

        
        $("body, #done").unbind('mousedown', arguments.callee);
        
        $("#notename, #notemenu").hide();
        $("#plh1, #plh2").show();
        
        if (!$("#notetextwr").text())
            return;
        
        $('#' + id).removeClass(note.color);
        
        note.text = $("#notetextwr").text();
        note.label = $("#notenamewr").text();
        note.color = G.currentColor;
        
        $('#' + id + " .notelabel").text(note.label);
        $('#' + id + " .notetext").text(note.text);
        $('#' + id).addClass(note.color);
        if (note['label'] != '' && !$("#" + id + " .notelabel").length)
        {
            $("#" + id).prepend('<div class="notelabel">' + note['label'] + '</div>');
        }
        if (note['label'] == '')
        {
            $("#" + id + " .notelabel").remove();
        }
        
        defineFont(id);
        
        $('#' + id).css("visibility", "visible");
        
        $("#newnote").on("click", newNoteEventListener);
        $("#notes").on("click", "li", editNote);
        
        $("#notenamewr").text("");
        $("#notetextwr").text("");
        
        changeColor("white", false);
        
        update();

        G.editMode = false;
    });
}

$(document).ready(function ()
{
    $("#notes").sortable(
        {
            cursor: "move",
            revert: true,
            scroll: false,
            helper: "clone",
            appendTo: document.body,
            containtment: "#notes"
        }
    );
    $("#note-creator input").resizable();
    $("body").selectable({
        delay : 100,
        filter: '.note',
        cancel: '#newnote'
    });
    $("#menu-button").click(function ()
    {
        $("nav").toggle("slide", "200");
        setTimeout(function ()
        {
            $(document).mousedown(function (e)
            {
                let target = $(e.target);
                if (target.is('nav') || target.parents('nav').length
                    || target.is('#menu-button') || target.parents('#menu-button').length)
                    return;
                $(document).unbind("mousedown", arguments.callee);
                $("nav").hide("slide", "200");
            });
        }, 1);
    });
    
    //NEWNOTE MODULE
    $("#newnote").on("click", newNoteEventListener);
    
    $("#notetextwr").on("input", function ()
    {
        if (this.textContent != "")
            $("#plh2").hide();
        else
            $("#plh2").show();
    });
    
    
    $("#notenamewr").on("input", function ()
    {
        if (this.textContent != "")
            $("#plh1").hide();
        else
            $("#plh1").show();
    });
    
    //SIGNOUT
    $("#signoutbutton").click(
        function ()
        {
            $.get("/main/signOut");
        }
    );
    
    //DISPLAYNOTES
    
    for (let i = 0; i < G.present.length; i++)
    {
        displayNote(G.present[i]);
    }
    
    $("#notes").on("click", "li", editNote);
    
    
    $("#color-picker, #color-picker-button").on("mouseover", function ()
    {
        $("#color-picker").show();
        $("#color-picker").css("opacity", "1");
        $("#color-picker").css("visibility", "visibile");
        setTimeout(hideColorPickerOnMouseLeave, 1000);
    });
    
    function hideColorPickerOnMouseLeave()
    {
        $("#color-picker, #color-picker-button").on("mouseleave", function ()
        {
            $("#color-picker").hide();
            //$("#color-picker").css("opacity","0");
            //$("#color-picker").css("visibility","hidden");
        });
    }
    
    hideColorPickerOnMouseLeave();
    
    $("#color-picker").on("click", "div", function ()
    {
        changeColor($(this).attr('class'));
    });

    $('#delete-button').on('click', deleteSelected);

    /*$("body").click(function(e)
    {
        let target = $(e.target);
        if(target.is(".note") || target.parents(".note").length)
            return;
        $(".ui-selected").removeClass("ui-selected");
    })*/ //TODO: disable selection on click
})