/**
 */
var
  parseApplicationId = 'ygEbxjFA6M5VAFaSQMW4R0RgIgYvCZ5fuBVnZSzH',
  parseRestKey = 'fduNvH7jFZ0aHFtFHnJkAcaf84oDiyDte5xeuiGB',

  PARSE_ERROR_INVALID_SESSION = 209;


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

  $('.logged-in').hide();
  $('.anonymous').show();
}

function isLoggedIn() {
  console.log('Logged in as ' + localStorage['user.username']);
  $('#profile-link .username').text(localStorage['user.username']);
  $('#login-link').hide();
  $('#profile-link').show();

  $('.logged-in').show();
  $('.anonymous').hide();
}

function ucfirst(str) {
  var first = str.charAt(0).toUpperCase();
  return first + str.substr(1);
}

jQuery(function ($) {
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

  $(document).on('click', '.alert .close', function () {
    $(this).parents('.alert').hide();
  });

  /*
   * Join
   */
  $('a.join').click(function (e) {
    var plan = $(this).data('plan');
    $('#select-plan').val(plan);
  });

});

riot.mount('login, join');

riot.mount('tutorials', {
  title: 'Free tutorials',
  tutorials: [
    { title: 'Setting up a web site', description: 'Staring up...' },
    { title: 'Creating an account with parse.com', description: 'The server side...' },
    { title: 'Coding your app', description: 'Tying it together...' }
  ]
});

