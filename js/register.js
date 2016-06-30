/**
 * Created by Monyk on 21.03.2016.
 */
/// <reference path="jquery.d.ts"/>
/// <reference path="jqueryui.d.ts"/>
var G = (function () {
    function G() {
    }
    G.passwordPattern = "(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[a-zа-я]).*$";
    G.emailPattern = "^[A-Za-z0-9-_]+@[A-Za-z0-9]+\\.[a-z]{2,4}$";
    return G;
}());
$("#emailField").keyup(isEmailFine);
$("#passwordField").keyup(isPasswordFine);
$("#passwordConfirmationField").keyup(isPasswordConfirmed);
$("#signupbutton").click(function () {
    if ($("#passwordConfirmationSuccess").text() == "Fine" && $("#passwordSuccess").text() == "Fine"
        && $("#emailSuccess").text() == "Fine") {
        $.post("/register/newUser", {
            email: $("#emailField").val(),
            password: $("#passwordField").val()
        }, function (data) {
            if (data == "Fine")
                window.location.replace("/login");
            else
                alert("Registration error");
        });
    }
});
function isPasswordConfirmed() {
    if ($("#passwordField").val() == $("#passwordConfirmationField").val()) {
        $("#passwordConfirmationSuccess").removeClass("invisible")
            .text("Fine")
            .removeClass("alert-danger")
            .addClass("alert-success");
    }
    else {
        $("#passwordConfirmationSuccess").removeClass("invisible")
            .text("Nope")
            .removeClass("alert-success")
            .addClass("alert-danger");
    }
}
function isPasswordFine() {
    var regEx = new RegExp(G.passwordPattern);
    if (regEx.test($("#passwordField").val())) {
        $("#passwordSuccess").removeClass("invisible")
            .text("Fine")
            .removeClass("alert-danger")
            .addClass("alert-success");
    }
    else {
        $("#passwordSuccess").removeClass("invisible")
            .text("Nope")
            .removeClass("alert-success")
            .addClass("alert-danger");
    }
}
function isEmailFine() {
    var regEx = new RegExp(G.emailPattern);
    if (regEx.test($("#emailField").val()))
        $.get("/register/isEmailFine/?email=" + $("#emailField").val(), function (data) {
            if (data == "Fine") {
                $("#emailSuccess").removeClass("invisible")
                    .text("Fine")
                    .removeClass("alert-danger")
                    .addClass("alert-success");
            }
            if (data == "Nope") {
                $("#emailSuccess").removeClass("invisible")
                    .text("This email is taken")
                    .removeClass("alert-success")
                    .addClass("alert-danger");
            }
        });
    else
        $("#emailSuccess").removeClass("invisible")
            .text("Nope")
            .removeClass("alert-success")
            .addClass("alert-danger");
}
//# sourceMappingURL=register.js.map