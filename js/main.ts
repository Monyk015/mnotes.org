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
		
		let note:note = {
			'label': $("#noteNameWr").html(),
			'text': $("#noteTextWr").html(),
			'id': id,
			'color': G.currentColor
		};
		
		G.present[note['id']] = note;
		
		$("#noteNameWr").html("");
		$("#noteTextWr").html("");
		newNote(note);
		
		changeCurrentColor("white");
		
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
		'</div> </li>');
	$("#" + id).addClass(note.color);
	$("#" + id + " .panel-body").html(note["text"]);
	
	defineFont(id);
	
	if (note['label'] != '')
	{
		$("#" + id).prepend('<div class="notelabel">' + note['label'] + '</div>');
	}
	
	
}

function deleteSelected()
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
	$.post("main/updateOrder", {order: $("#notes").sortable("toArray").join(' ')}, function (data)
	{
		if (data == "Nope")
			alert("Error updating");
	})
}

function editNote():void
{
	G.editMode = true;
	
	$("#newNote").off("click");
	$("#notes li").off("click", editNote);
	
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
		
		$('#' + id + " .notelabel").html(note.label);
		$('#' + id + " .noteText").html(note.text);
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
		
		$("#newNote").on("click", newNoteEventListener);
		$("#notes").on("click", "li", editNote);
		
		$("#noteNameWr").html("");
		$("#noteTextWr").html("");
		
		changeCurrentColor("white");
		
		updateNote(note);
		
		G.editMode = false;
	});
}

$(document).ready(function ()
{
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
		cancel: '#newNote'
	});
	
	$("#notes").on("mousedown", function (e)
	{
		let target = $(e.target);
		if (target.is(".note") || target.parents(".note").length || e.ctrlKey)
			return;
		$(".ui-selected").removeClass("ui-selected");
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
	
	//newNote MODULE
	$("#newNote").on("click", newNoteEventListener);
	
	
	$("#noteTextWr").on("input", function ()
	{
		if (this.textContent != "")
			$("#plh2").hide();
		else
			$("#plh2").show();
	});
	
	
	$("#noteNameWr").on("input", function ()
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
			$.get("/main/signOut", function (data)
			{
				if (data == "Fine")
					window.location.replace("/login");
				else
					alert("Signout error");
			})
		}
	);
	
	//DISPLAYNOTES
	let order = G.present['order'] ? G.present['order'].split(' ') : null;
	for (let i = 0; i < order.length; i++)
	{
		displayNote(G.present[order[i]]);
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
		if (G.editMode)
			changeCurrentColor($(this).attr('class'));
		changeSelectedColor($(this).attr('class'));
	});
	
	
	$('#delete-button').on('click', deleteSelected);
	
	
});

function maxId(O:Object)
{
	let maxKey:Number = 1;
	for (let key in O)
	{
		if (+key > maxKey)
			maxKey = +key;
	}
	return maxKey;
}