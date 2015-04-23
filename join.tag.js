<join>

  <div id="join" class="row">

    <div class="col-sm-12">
      <h2>So you want to get access to all our tutorials? Smart choice.</h2>
      <form class="form-horizontal" onsubmit={ submit }>

        <div class="form-group">
          <label for="join-plan" class="col-sm-3 control-label">Subscription Plan</label>
          <div class="col-sm-9">
            <select id="select-plan" class="form-control">
              <option value="monthly">9€ per month</option>
              <option value="yearly">86€ per year. Save 20%</option>
              <option value="business">299€ per year. No limits</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="join-username" class="col-sm-3 control-label">Username</label>
          <div class="col-sm-9">
            <input type="username" class="form-control" id="join-username" placeholder="Username">
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="col-sm-3 control-label">Password</label>
          <div class="col-sm-9">
            <input type="password" class="form-control" id="join-password" placeholder="Password">
          </div>
        </div>

        <div class="form-group">
          <div class="col-sm-offset-3 col-sm-9">
            <button type="submit" class="btn btn-default">Join Tutorials</button>
          </div>
        </div>

      </form>
    </div>

  </div>

  submit(e) {

    var
      self = this,
      username = $('#join-username').val();

    e.preventDefault();

    $('#join-form .alert').hide();
    $('button[type="submit"]').prop('disabled', true);

    parse('/users', {
      method: 'POST',
      data: {
        username: username,
        password: $('#join-password').val()
      },
      success: function (response) {
        localStorage['user.sessionToken'] = response.sessionToken;
        localStorage['user.username'] = username;

        isLoggedIn();

        toplevelAlert('Welcome. Now, start learning');
      },
      error: function (response, responseStatus, responseMessage) {
        var message;

        isAnonymous();

        if (response.status == 400) {
          message = response.responseJSON.error;
        }
        else {
          message = responseStatus + ': ' + responseMessage;
        }

        toplevelAlert('There was an error: ' + ucfirst(message), 'danger');
      },
      complete: function () {
        $('button[type="submit"]').prop('disabled', false);
        $('#toplevel-alert').slideDown();
      }
    });
  });

</join>
