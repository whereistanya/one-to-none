
function xhrWithAuth(callback) {
  var access_token;
  var retry = true;
  var url = 'https://www.googleapis.com/plus/v1/people/me';
  getToken();

  function getToken() {
      chrome.identity.getAuthToken({ interactive: false }, function(token) {
        if (chrome.runtime.lastError) {
          callback(chrome.runtime.lastError);
          console.log("Error", chrome.runtime.lastError);
          return;
        }
        access_token = token;

        var xhr = new XMLHttpRequest();
        xhr.open('get', url);
        xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
        xhr.onload = requestComplete;
        xhr.send();
      });
    }

    function requestComplete() {
      if (this.status == 401 && retry) {
        retry = false;
        chrome.identity.removeCachedAuthToken({ token: access_token },
                                              getToken);
      } else {
        callback(null, this.status, this.response);
      }
    }
}

function onUserInfoFetched(error, status, response) {
  if (!error && status == 200) {
    var user_info = JSON.parse(response);
    if (user_info.emails) {
      for (i = 0; i < user_info.emails.length; i++) {
        emails.push(user_info.emails[i].value);
      }
      console.log("Found emails:", emails);
    }
  } else {
    console.log("Error:", error);
  }
}

/*** Return the email addresses to content.js ***/
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Sending emails:", emails);
  sendResponse( {emails: emails})
});


/*** Main ***/
console.log("Running one:none v1.3")
var emails = [];
xhrWithAuth(onUserInfoFetched);
