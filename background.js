console.log("Running one:none v0.1")

var email = ""

chrome.identity.getProfileUserInfo(function(info) { email = info.email; });

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("Sending email:", email);
  sendResponse( {email: email})
});

