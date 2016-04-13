/**
 * Created by Monyk on 21.03.2016.
 */

/// <reference path="jquery.d.ts"/>
/// <reference path="jqueryui.d.ts"/>

$("#emailField").keyup
(
    function()
    {
        $.get("/register/isEmailFine/?email=" + $("#emailField").val(),function(data:string)
        {
            if(data == "Fine")
            {
                $("#emailSuccess").removeClass("invisible")
                    .text("Fine")
                    .removeClass("alert-danger")
                    .addClass("alert-success");
            }
            if(data == "Nope" || data == "Taken")
            {
                $("#emailSuccess").removeClass("invisible")
                    .text(data == "Nope" ? "Nope" : "This email is taken")
                    .removeClass("alert-success")
                    .addClass("alert-danger");
            }
        })
    }
)

$("#passwordField").keyup
(
    function()
    {
        $.get("/register/isPasswordFine/?password=" + $("#passwordField").val(),function(data:string)
        {
            if(data == "Fine")
            {
                $("#passwordSuccess").removeClass("invisible");
                $("#passwordSuccess").text("Fine");
                $("#passwordSuccess").removeClass("alert-danger");
                $("#passwordSuccess").addClass("alert-success");
            }
            if(data == "Nope")
            {
                $("#passwordSuccess").removeClass("invisible");
                $("#passwordSuccess").text("Nope");
                $("#passwordSuccess").removeClass("alert-success");
                $("#passwordSuccess").addClass("alert-danger");
            }
        })
    }
)

$("#passwordConfirmationField").keyup
(
    function()
    {
        $.get("/register/isPasswordConfirmed/?password=" + $("#passwordField").val() + "&passwordConfirmation=" +
            $("#passwordConfirmationField").val(), function(data:string)
        {
            if(data == "Fine")
            {
                $("#passwordConfirmationSuccess").removeClass("invisible");
                $("#passwordConfirmationSuccess").text("Fine");
                $("#passwordConfirmationSuccess").removeClass("alert-danger");
                $("#passwordConfirmationSuccess").addClass("alert-success");
            }
            if(data == "Nope")
            {
                $("#passwordConfirmationSuccess").removeClass("invisible");
                $("#passwordConfirmationSuccess").text("Nope");
                $("#passwordConfirmationSuccess").removeClass("alert-success");
                $("#passwordConfirmationSuccess").addClass("alert-danger");
            }
        })
    }
)

$("#signupbutton").click(function()
{
    if( $("#passwordConfirmationSuccess").text() == "Fine" &&   $("#passwordSuccess").text() == "Fine"
    &&   $("#emailSuccess").text() == "Fine")
    {
        $.post("/register/newUser",
            {
                email: $("#emailField").val(),
                password: $("#passwordField").val()
            },
            function(data)
            {
                if(data == "Fine")
                    window.location.replace("/login");
                else
                    alert("Registration error");
            }
        )
    }
}
)