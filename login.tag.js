<login>

  <div id="login-form" class="modal fade">
    <div class="modal-dialog modal-sm">
      <form class="modal-content" onsubmit={ submit }>
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Login</h4>
        </div>
        <div class="modal-body">
          <div style="display:none" class="alert fade in alert-danger" role="alert">
            <button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <strong>There was a problem:</strong> <span class="message"></span>
          </div>
          <p>Already registered? Please log in.</p>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="username" class="form-control" id="username" placeholder="Enter username">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password" placeholder="Password">
          </div>
          <p>Not registered yet? Please <a href="#choose-plan">join.</a>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Log In</button>
        </div>
      </form>
    </div>
  </div>

  this.on('mount', function () {

    $('a[href="#choose-plan"]').click(function (e) {
      $('#login-form').modal('hide');
      $('#choose-plan').focus();
    });

    $('#login-form').on('hidden.bs.modal', function (e) {
      $('#login-form .alert').hide();
      e.stopImmediatePropagation(); // prevent setting the focus on the trigger
    });

  });

  submit(e) {

    var self = this;

    e.preventDefault();

    $('#login-form .alert').hide();
    $('button[type="submit"]').prop('disabled', true);

    parse('/login', {
      data: {
        username: $('#username').val(),
        password: $('#password').val()
      },
      success: function (response) {
        localStorage['user.sessionToken'] = response.sessionToken;
        localStorage['user.username'] = response.username;

        $('#login-form').modal('hide');
        isLoggedIn();

        toplevelAlert('Welcome back');
      },
      error: function (response, responseStatus, responseMessage) {
        var message;

        isAnonymous();

        if (response.status == 404) {
          message = response.responseJSON.error;
        }
        else {
          message = responseStatus + ': ' + responseMessage;
        }

        console.log("Login failed", message);

        $('.alert .message', self.root).text(ucfirst(message));
        $('.alert', self.root).slideDown();
      },
      complete: function () {
        $('button[type="submit"]').prop('disabled', false);
      }
    });
  }

</login>
