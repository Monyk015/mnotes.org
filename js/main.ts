/// <reference path="jquery.d.ts"/>
/// <reference path="jqueryui.d.ts"/>


$(document).ready(function ()
{
    G.present.order = G.present.order == null ? [] : G.present.order.split(' ');
    
    Tags.initialDisplay();
    
    let order = G.present['order'] ? G.present['order'] : null;
    for (let i = 0; i < order.length; i++)
        displayNote(G.present[order[i]]);
    
    
    $("#notes").sortable(
        {
            cursor: "move",
            revert: 150,
            scroll: false,
            helper: "clone",
            appendTo: document.body,
            containtment: "#notes",
            stop: updateOrder
        }
    );
    
    $("#note-creator input").resizable();
    
    $("body").selectable({
        delay: 100,
        filter: '.note',
        cancel: '#newNote, nav'
    });
    
    
    $("#notes").on("mousedown", selectionDeleter);
    
    $("#menu-button").click(function ()
    {
        menuButtonClickEventListener();
    });
    
    $("#newNote").on("click", newNoteEventListener);
    
    
    $("#noteTextWr").on("input", function ()
    {
        noteTextWrapperInputEventListener.call(this);
    });
    
    
    $("#noteNameWr").on("input", function ()
    {
        noteNameWrapperInputEventListener.call(this);
    });
    
    
    $("#signoutbutton").click(signOutButtonEventListener);
    
    
    $("#notes").on("click", "li", editNoteEventListener);
    
    
    $("#color-picker, #color-picker-button").on("mouseover", function ()
    {
        colorPickerMouseOverEventListener();
    });
    
    
    $("#color-picker, #color-picker-button").on("mouseleave", function ()
    {
        $("#color-picker").hide();
    });
    
    
    $("#color-picker").on("click", "div", function ()
    {
        colorPickerDivEventListener.call(this);
    });
    
    
    $('#delete-button').on('click', deleteSelectedEventListener);
    
    $('#tagsCreator .glyphicon-ok').on("click", tagsCreatorOkEventListener);
    
    $('#tagsNav').on('click', '.glyphicon-remove', function (e)
    {
        let target = $(e.target);
        let parent = target.parent();
        Tags.removeTag(+(parent[0].id.substring(4)));
    })
    
    $('#notemenu .glyphicon-tag').on("click", Tags.tagPickerShowEventListener);
    
    $('#tagPicker').on("click", "div", Tags.divTagPickerEventListener);
    
    $('#tagsNav').on("click", "li", Tags.tagsNavClickEventListener);
    
});


class G
{
    static currentColor:string = "white";
    static toRemove:Array<number> = [];
    static present:Array<note> = present;
    static editMode:boolean = false;
    static ifNewNote:boolean = true;
}

interface note
{
    id:number;
    label?:string;
    text:string;
    color:string;
    tags:Array<number>;
}

class Tags
{
    static tagList:Object = present.tags ? present.tags : {};
    static currentTags:Object = {};
    static allowedTags:Object = {};
    
    
    public static newTag(tagName:string):void
    {
        if (tagName == "")
            return;
        if (isThere(Tags.tagList, tagName))
            return;
        let tagId = maxId(Tags.tagList) + 1
        Tags.tagList[tagId] = tagName;
        Tags.display(tagId);
        $.get("/main/newTag?tagName=" + tagName + "&tagId=" + tagId);
        $("#tagsCreator input").val("");
    }
    
    public static display(tagId:number):void
    {
        let tagName = Tags.tagList[tagId];
        $("#tagsNav").append('<li role="presentation" id="tag_' + tagId + '" class="navTag">' +
            '<span class="glyphicon glyphicon-tag" aria-hidden="true"></span>' +
            tagName +
            '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
            '</li> ');
        let isPicked:string = Tags.currentTags[tagId] ? 'picked' : '';
        $("#tagPicker").append('<div class="pickTag ' + isPicked + '" id="pickTag_' + tagId + '">' + tagName + '</div>');
    }
    
    public static initialDisplay():void
    {
        if (Tags.tagList == null)
            return;
        for (let i in Tags.tagList)
        {
            Tags.display(+i);
        }
        Tags.refreshCurrent();
    }
    
    public static refreshCurrent():void
    {
        for (let i in Tags.tagList)
        {
            Tags.currentTags[i] = false;
            $("#tagPicker div").removeClass('picked');
        }
        Tags.displayAttached();
    }
    
    public static refreshAllowed():void
    {
        for (let i in Tags.tagList)
        {
            Tags.allowedTags[i] = false;
            $("#tagsNav li").removeClass('picked');
        }
        displayAllowed();
    }
    
    public static removeTag(tagId:number):void
    {
        $("#tag_" + tagId).remove();
        $('#pickTag_' + tagId).remove();
        delete Tags.tagList[tagId];
        delete Tags.allowedTags[tagId];
        delete Tags.currentTags[tagId];
        $.get("/main/removeTag?tagId=" + tagId);
        for (let i in G.present)//updating all notes which contained this tag
            if (G.present[i].tags != null && G.present[i].tags.indexOf(tagId) > -1)
            {
                G.present[i].tags.splice(G.present[i].tags.indexOf(tagId), 1);
                updateNote(G.present[i]);
                Tags.displayAttached($('#' + i), G.present[i]);
            }
        displayAllowed(Tags.allowedTags);
    }
    
    public static  divTagPickerEventListener(e):void
    {
        let target = $(e.target);
        let tagId:number = +target[0].id.substring(8);
        if (Tags.currentTags[tagId])
            Tags.currentTags[tagId] = false;
        else
            Tags.currentTags[tagId] = true;
        Tags.displayAttached();
        $("#pickTag_" + tagId).toggleClass('picked');
    }
    
    public static tagsNavClickEventListener(e):void
    {
        let target = $(e.target);
        if (target.is(".glyphicon"))
            return;
        let tagId:number = +target[0].id.substring(4);
        if (Tags.allowedTags[tagId])
            Tags.allowedTags[tagId] = false;
        else
            Tags.allowedTags[tagId] = true;
        $("#tag_" + tagId).toggleClass('picked');
        displayAllowed(Tags.allowedTags);
    }
    
    
    public static displayAttached(target = $('#newNote'), note:note = null):void
    {
        target.find(".tagsHolder").html("");
        if (note == null)
            for (let i in Tags.currentTags)
            {
                if (Tags.currentTags[i])
                    target.find(".tagsHolder").append('<div>' + Tags.tagList[i] + '</div>');
            }
        else if (note.tags)
            for (let i in note.tags)
            {
                target.find(".tagsHolder").append('<div>' + Tags.tagList[note.tags[i]] + '</div>');
            }
    }
    
    public static tagPickerShowEventListener():void
    {
        $('#tagPicker').toggle();
        $('body').on("mousedown", function (e)
        {
            let target = $(e.target);
            if (target.is('#notemenu .glyphicon-tag') || target.is('#tagPicker') || target.parents('#tagPicker').length > 0)
                return;
            $('#tagPicker').toggle();
            $('body').unbind('mousedown', arguments.callee);
        });
    }
    
    public static loadCurrentTags(note:note):void
    {
        for (let i in note.tags)
        {
            Tags.currentTags[note.tags[i]] = true;
            $('#pickTag_' + note.tags[i]).addClass('picked');
        }
        Tags.displayAttached();
    }
}


function changeSelectedColor(color:string)
{
    for (let i in G.present)
        if ($("#" + i).hasClass('ui-selected'))
        {
            $("#" + i).removeClass(G.present[i].color);
            G.present[i].color = color;
            $("#" + i).addClass(G.present[i].color);
            updateNote(G.present[i]);
        }
}

function changeCurrentColor(color:string)
{
    $("#color-picker ." + G.currentColor).html("");
    $("#newNote").removeClass(G.currentColor);
    G.currentColor = color;
    $("#newNote").addClass(G.currentColor);
    $("#color-picker ." + G.currentColor).html('<span class="glyphicon glyphicon-ok"></span>');
}

function newNoteEventListener():void
{
    G.editMode = true;
    $("#noteName, #notemenu").show();
    $("body, #done").mousedown(function (e)
    {
        let target = $(e.target);
        if (target.is('#newNote') || target.parents('#newNote').length && !target.is('#done')
            || target.is('#color-picker') || target.parents('#color-picker').length)
            return;
        
        
        $("body, #done").unbind('mousedown', arguments.callee)
        
        $("#noteName, #notemenu").hide();
        $("#plh1, #plh2").show();
        
        if (!$("#noteTextWr").text())
        {
            $("#noteNameWr").html("");
            return;
        }
        
        let id:number = +maxId(G.present) + 1;
    
        let tags:Array<number> = [];
    
        for (let i in Tags.currentTags)
            if (Tags.currentTags[i])
                tags.push(+i);

        let note:note = {
            'label': $("#noteNameWr").html(),
            'text': $("#noteTextWr").html(),
            'id': id,
            'color': G.currentColor,
            'tags': tags.length ? tags : null
        };

        G.present[note['id']] = note;
        
        $("#noteNameWr").html("");
        $("#noteTextWr").html("");
        newNote(note);
        
        changeCurrentColor("white");
    
        Tags.refreshCurrent();
    
        updateOrder();

        G.editMode = false;
    });
}


function newNote(note:note)
{
    displayNote(note);
    G.present[note['id'].toString()] = note;
    $.post("/main/newNote", note, function (data)
    {
        if (data == "Fine")
            return;
        else
            alert("Error adding new note");
    })
    updateOrder();
}

function defineFont(id:Number)
{
    let length = $("#" + id + " .panel-body").text().length;
    
    if (length < 8)
    {
        $("#" + id + " .noteText").css("font-size", "36px");
        $("#" + id + " .noteText").css("font-weight", "100");
    }
    else if (length < 15)
    {
        $("#" + id + " .noteText").css("font-size", "24px");
        $("#" + id + " .noteText").css("font-weight", "300");
    }
    else
    {
        $("#" + id + " .noteText").css("font-size", "14px");
        $("#" + id + " .noteText").css("font-weight", "400");
    }
}

function displayNote(note:note)
{
    if (note == undefined)
        return;
    let id = note.id;
    $("#notes").append('<li class="panel panel-default note" id = "' + id + '"> <div class="noteText panel-body"></div>' +
        '<div class="noteIcons">' +
        '<div class="remove-button"></div>' +
        '</div> ' +
        '<div class="tagsHolder"></div></li>');
    $("#" + id).addClass(note.color);
    $("#" + id + " .panel-body").html(note["text"]);
    
    defineFont(id);
    
    if (note['label'] != '')
    {
        $("#" + id).prepend('<div class="notelabel">' + note['label'] + '</div>');
    }
    
    Tags.displayAttached($('#' + id), note);
}

function deleteSelectedEventListener()
{
    for (let i = 0; i < $('.ui-selected').length; i++)
        G.toRemove.push(+$('.ui-selected')[i].id);
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
    updateOrder();
}

function updateNote(note:note)
{
    $.post("main/updateNote", {note: G.present[note.id]}, function (data)
    {
        if (data == "Nope")
            alert("Error updating");
    });
}

function updateOrder()
{
    G.present.order = $("#notes").sortable("toArray");
    $.post("main/updateOrder", {order: G.present.order.join(' ')}, function (data)
    {
        if (data == "Nope")
            alert("Error updating");
    })

}

function editNoteEventListener():void
{
    G.editMode = true;
    G.ifNewNote = false;
    
    $("#newNote").off("click");
    $("#notes li").off("click", editNoteEventListener);
    
    let id:number = +$(this)[0].id;
    let index:number = id;
    let note:note = G.present[index];
    
    $(this).css("visibility", "hidden");
    $("#noteName, #notemenu").show();
    
    $("#noteNameWr").html(note.label);
    $("#noteTextWr").html(note.text);
    changeCurrentColor(note.color);
    $("#noteTextWr").trigger("input");
    $("#noteNameWr").trigger("input");
    
    Tags.loadCurrentTags(note);
    
    $("body, #done").mousedown(function (e)
    {
        let target = $(e.target);
        if (target.is('#newNote') || (target.parents('#newNote').length && !target.is('#done'))
            || target.is('#color-picker') || target.parents('#color-picker').length)
            return;
        
        
        $("body, #done").unbind('mousedown', arguments.callee);
        
        $("#noteName, #notemenu").hide();
        $("#plh1, #plh2").show();
        
        if (!$("#noteTextWr").text())
            return;
        
        $('#' + id).removeClass(note.color);
        
        note.text = $("#noteTextWr").html();
        note.label = $("#noteNameWr").html();
        note.color = G.currentColor;
    
        note.tags = [];
    
        for (let i in Tags.currentTags)
            if (Tags.currentTags[i])
                note.tags.push(+i);
        
        $('#' + id + " .notelabel").html(note.label);
        $('#' + id + " .noteText").html(note.text);
        $('#' + id).addClass(note.color);
        Tags.displayAttached($('#' + id));
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
        
        $("#newNote").on("click", newNoteEventListener);
        $("#notes").on("click", "li", editNoteEventListener);
        
        $("#noteNameWr").html("");
        $("#noteTextWr").html("");
        
        changeCurrentColor("white");
    
        Tags.refreshCurrent();
        
        updateNote(note);
        
        G.editMode = false;
        G.ifNewNote = true;
    });
}

function tagsCreatorOkEventListener()
{
    Tags.newTag($("#tagsCreator").find("input").val());
}

function colorPickerDivEventListener()
{
    if (G.editMode)
        changeCurrentColor($(this).attr('class'));
    changeSelectedColor($(this).attr('class'));
}

function colorPickerMouseOverEventListener()
{
    $("#color-picker").show();
    $("#color-picker").css("opacity", "1");
    $("#color-picker").css("visibility", "visibile");
}

function signOutButtonEventListener()
{
    $.get("/main/signOut", function (data)
    {
        window.location.replace("/login");
    })
}

function noteNameWrapperInputEventListener()
{
    if (this.textContent != "")
        $("#plh1").hide();
    else
        $("#plh1").show();
}

function noteTextWrapperInputEventListener()
{
    if (this.textContent != "")
        $("#plh2").hide();
    else
        $("#plh2").show();
}

function menuButtonClickEventListener()
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
}

function selectionDeleter(e)
{
    let target = $(e.target);
    if (target.is(".note") || target.parents(".note").length || e.ctrlKey)
        return;
    $(".ui-selected").removeClass("ui-selected");
}

function maxId(O:Object):number
{
    let maxKey:number = 1;
    for (let key in O)
    {
        if (+key > maxKey)
            maxKey = +key;
    }
    return maxKey;
}

function isThere(O:Object, value:string)
{
    for (let i in O)
        if (O[i] == value)
            return true;
    return false;
}

function displayAllowed(allowedTags:Object = null):void
{
    $("#notes li").hide();
    if (allowedTags == null)
    {
        let order = G.present['order'] ? G.present['order'] : null;
        for (let i = 0; i < order.length; i++)
            $('#' + order[i]).show();
        $("#notes").sortable({
            disabled: false
        })
    }
    else
    {
        $("#notes").sortable({
            disabled: true
        })
        let isThereTrue = false;
        for (let i in allowedTags)
            if (allowedTags[i])
                isThereTrue = true;
        if (!isThereTrue)
        {
            displayAllowed();
            return;
        }
        for (let i in G.present)
        {
            if (G.present[i] != null && G.present[i].tags)
            {
                for (let j in G.present[i].tags)
                    if (true == allowedTags[G.present[i].tags[j]] && G.present[i].tags[j] != 0)
                    {
                        $("#" + i).show();
                        break;
                    }
            }
        }
    }
}