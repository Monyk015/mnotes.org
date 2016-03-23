/**
 * Created by Monyk on 22.03.2016.
 */

$("#signinbutton").click(function()
{
    $.post("index.php?page=login&ajax=isAuthorizationCorrect",
    {
        email: $("#emailField").val(),
        password: $("#passwordField").val()
    },function(data:string)
        {
            if(data == "Fine")
            {
                window.location.replace("/?page=main");
            }
            else
                alert("Authorization error");
        }
    )
}
)