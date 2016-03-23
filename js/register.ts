/**
 * Created by Monyk on 21.03.2016.
 */
$("#emailField").keyup
(
    function()
    {
        $.get("index.php?page=register&ajax=isEmailFine&email=" + $("#emailField").val(),function(data:string)
        {
            if(data == "Fine")
            {
                $("#emailSuccess").removeClass("invisible");
                $("#emailSuccess").text("Fine");
                $("#emailSuccess").removeClass("alert-danger");
                $("#emailSuccess").addClass("alert-success");
            }
            if(data == "Nope" || data == "Taken")
            {
                $("#emailSuccess").removeClass("invisible");
                $("#emailSuccess").text(data == "Nope" ? "Nope" : "This email is taken");
                $("#emailSuccess").removeClass("alert-success");
                $("#emailSuccess").addClass("alert-danger");
            }
        })
    }
)

$("#passwordField").keyup
(
    function()
    {
        $.get("index.php?page=register&ajax=isPasswordFine&password=" + $("#passwordField").val(),function(data:string)
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
        $.get("index.php?page=register&ajax=isPasswordConfirmed&password=" + $("#passwordField").val() + "&passwordConfirmation=" +
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
        $.post("index.php?page=register&ajax=newUser",
            {
                email: $("#emailField").val(),
                password: $("#passwordField").val()
            },
            function(data)
            {
                if(data == "Fine")
                    window.location.replace("/?page=login");
                else
                    alert("Registration error");
            }
        )
    }
}
)