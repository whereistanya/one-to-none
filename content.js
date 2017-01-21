console.log("Running one:none v1.3")

var dom_user;
var profile_user;

// Use identity API to get the logged in user.
chrome.extension.sendMessage({}, function(response) {
  if (response.emails.length > 0) {
    console.log("response.emails is", response.emails);
    profile_user = response.emails[0].split('@')[0];
    console.log("Got profile user:", profile_user);
  } else {
    console.log("Couldn't get email address of chrome user.");
  }
});

// Try scraping the user out of the DOM.
dom_user = $("#onegoogbar .gb_vb").text().split('@')[0];
console.log("Got user from DOM:", dom_user);

function checkEvent() {
  if(!location.hash.match(/^#eventpage_6/)) return;  // the 'create' page.

  var meeting_title = $(".ep-title > input").val();
  $(".ep-title > input").on('change', function() {
    meeting_title = this.value;
  });

  var guestList = $(".ep-gl-guest");
  $(".ep-gl-guest").on('change', function() {
    guestList = this.value
  });

  // Check for attendees when the Save button is clicked.
  $("div[id*='.save_top'].action-btn-wrapper").click(function() {

    var titleRE = /([\w\.]+):([\w\.]+)/g;
    var match = titleRE.exec(meeting_title);
    if (!match || match.length !== 3) {
      return;
    }
    console.log("Looks like a 1:1 between", match[1], "and", match[2]);

    var invitednames = []
    for (i = 0; i < guestList.length; i++) {
      // TODO: This is hacky. Better to pull out the email address and parse properly.
      invitednames.push(guestList[i]["title"])
      invitednames.push(guestList[i]["id"])
    }
    console.log("Invited people:", invitednames);

    for (i = 1; i <= 2; i++) {
      var invitee = match[i];
      if (invitee === dom_user || invitee === profile_user) {
        continue;
      }
      var found = false;
      for (j = 0; j < invitednames.length; j++) {
        if (invitednames[j].includes(invitee)) {
          found = true;
          break;
        }
      }
      if (found === false) {
        alert("Did you mean to invite " + invitee + "?");
      }
    }
  });
}

window.addEventListener('hashchange', checkEvent, false);
window.addEventListener('ready', checkEvent, false);
