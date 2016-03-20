/**
 * Created by Monyk on 19.03.2016.
 */

var isMenuHidden: boolean = true;

$("#menu-button").click(function()
{
    if(isMenuHidden)
    {
        $("nav").show("slide");
        isMenuHidden = false;
    }
    else
    {
        $("nav").hide("slide");
        isMenuHidden = true;
    }
}
)

$(document).ready(function()
{
    $("#notes").sortable();
    $("#notes").disableSelection();
    $("#note-creator input").resizable();
})
