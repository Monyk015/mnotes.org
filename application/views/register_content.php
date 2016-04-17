<form class="panel signgroup" id="register">
    <h1>Sign up</h1>
    <div class="input-group">
        <input id="emailField" type="text" class="form-control" placeholder="Email" aria-describedby="sizing-addon2">
        <div id="emailSuccess" class="alert alert-success invisible" role="alert">Fine!</div>
    </div>
    <div class="input-group">
        <input id="passwordField" type="password" class="form-control" placeholder="Password" aria-describedby="sizing-addon2">
        <div id="passwordSuccess" class="alert alert-success invisible" role="alert">Fine!</div>
    </div>
    <div class="input-group">
        <input id="passwordConfirmationField" type="password" class="form-control" placeholder="Confirm password" aria-describedby="sizing-addon2">
        <div id="passwordConfirmationSuccess" class="alert alert-success invisible" role="alert">Fine!</div>
    </div>
    <button type="submit" id="signupbutton" data-loading-text="Loading..." class="btn btn-primary signbutton"
            autocomplete="off">
        done.
    </button>
    <div>Already have an account? <a href="/?page=login">Sign in.</a></div>
</form>
<script src="/js/register.js"></script>