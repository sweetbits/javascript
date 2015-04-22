/**
 */
var
  parseApplicationId = 'ygEbxjFA6M5VAFaSQMW4R0RgIgYvCZ5fuBVnZSzH',
  parseRestKey = 'fduNvH7jFZ0aHFtFHnJkAcaf84oDiyDte5xeuiGB',

  PARSE_ERROR_INVALID_SESSION = 209;

jQuery(function ($) {

  /**
   * Helper function to call the Parse.com REST API
   */
  function parse(url, settings) {
    var
      parseBaseUrl = 'https://api.parse.com/1',
      headers = {
        'X-Parse-Application-Id': parseApplicationId,
        'X-Parse-REST-API-Key': parseRestKey
      };

    if (typeof settings.headers === 'undefined') {
      settings.headers = headers;
    }
    else {
      for (h in headers) {
        settings.headers[h] = headers[h];
      }
    }

    settings.cache = false;
    settings.dataType = 'json'; // From the server

    if (typeof settings.method === 'undefined') {
      settings.method = 'GET';
    }

    if (settings.method === 'POST' && typeof settings.data !== 'undefined') {
      settings.contentType = 'application/json'; // To the server
      settings.processData = false;
      settings.data = JSON.stringify(settings.data);
    }

    $.ajax(parseBaseUrl + url, settings);
  }

  function isAnonymous() {
    console.log('Anonymous');

    delete localStorage['user.sessionToken'];

    $('#profile-link .username').text('');
    $('#login-link').show();
    $('#profile-link').hide();

    $('section#logged-in').hide();
    $('section#anonymous').show();
  }

  function isLoggedIn() {
    console.log('Logged in as ' + localStorage['user.username']);
    $('#profile-link .username').text(localStorage['user.username']);
    $('#login-link').hide();
    $('#profile-link').show();

    $('section#logged-in').show();
    $('section#anonymous').hide();
  }

  function ucfirst(str) {
    var first = str.charAt(0).toUpperCase();
    return first + str.substr(1);
  }

  /*
   *------------------------------------------------------------------
   */

  if (typeof localStorage['user.sessionToken'] === 'undefined') {
    isAnonymous();
  }
  else {
    parse('/users/me', {
      headers: {
        'X-Parse-Session-Token': localStorage['user.sessionToken']
      },
      success: function (response) {
        if (response.code === PARSE_ERROR_INVALID_SESSION) {
          isAnonymous();
        }
        else {
          isLoggedIn();
        }
      },
      complete: function () {
        isAnonymous();
      }
    });
  }

  $('#logout').click(function (e) {
    e.preventDefault();

    parse('/logout', {
      method: 'POST',
      headers: {
        'X-Parse-Session-Token': localStorage['user.sessionToken']
      },
      complete: function () {
        isAnonymous();
      }
    });
  });

  /*
   * Login
   */
  $('#login-form .alert').on('click', '.close', function () {
    $(this).hide();
  });

  $('#login-form').on('hidden.bs.modal', function (e) {
    $('#login-form .alert').hide();
    e.stopImmediatePropagation(); // prevent setting the focus on the trigger
  });

  $('#login-form').submit(function (e) {

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

        $('#toplevel-alert .message').text('Welcome back');
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

        $('.alert .message', self).text(message);
        $('.alert', self).slideDown();
      },
      complete: function () {
        $('button[type="submit"]').prop('disabled', false);
      }
    });
  });

  $('a[href="#choose-plan"]').click(function (e) {
    $('#login-form').modal('hide');
    $('#choose-plan').focus();
  });

  /*
   * Join
   */
  $('a.join').click(function (e) {
    var plan = $(this).data('plan');
    $('#select-plan').val(plan);
  });

  $('#join-form').submit(function (e) {

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

        $('#toplevel-alert .message').text('Welcome. Now, start learning');
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

        console.log("Joining failed", message);

        $('.alert .message', self).text(message);
        $('.alert', self).slideDown();
      },
      complete: function () {
        $('button[type="submit"]').prop('disabled', false);
      }
    });
  });

});

riot.mount('tutorials', {
  title: 'Free tutorials',
  tutorials: [
    { title: 'Setting up a web site', description: 'Staring up...' },
    { title: 'Creating an account with parse.com', description: 'The server side...' },
    { title: 'Coding your app', description: 'Tying it together...' }
  ]
});


