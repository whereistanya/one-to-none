console.log("Running one:none v1.1")

var logged_in_user;
var logged_in_email;

chrome.extension.sendMessage({}, function(response) {
  if (response.emails) {
    // TODO: don't just use the first one.
    logged_in_email = response.emails[0];
    logged_in_user = logged_in_email.split('@')[0];
  } else {
    console.log("Couldn't get email address of active user.");
  }
});


function checkEvent() {
  console.log("Location is", location.hash);
  if(!location.hash.match(/^#eventpage_6/)) return;  // the 'create' page.

  var meeting_title = $(".ep-title > input").val();
  $(".ep-title > input").on('change', function() {
    console.log("Meeting title changed to:", this.value);
    meeting_title = this.value;
  });

  var guestList = $(".ep-gl-guest");
  console.log("guestlist is", guestList);
  $(".ep-gl-guest").on('change', function() {
    console.log("Guestlist changed to:", this.value);
    guestList = this.value
  });

  // Check for attendees when the Save button is clicked.
  $("div[id*='.save_top'].action-btn-wrapper").click(function() {

    console.log("Meeting title is", meeting_title);
    var titleRE = /([\w\.]+):([\w\.]+)/g;
    var match = titleRE.exec(meeting_title);
    if (!match || match.length !== 3) {
      console.log("Not a 1:1");
      return;
    }
    console.log("Looks like a 1:1 between", match[1], "and", match[2]);

    var invitednames = []
    for (i = 0; i < guestList.length; i++) {
      // TODO: This is hacky. Better to pull out the email address and parse properly.
      console.log("invited", guestList[i]["title"], ",", guestList[i]["id"]);
      invitednames.push(guestList[i]["title"])
      invitednames.push(guestList[i]["id"])
    }
    console.log("Invited people:", invitednames);

    console.log("Logged in user is:", logged_in_user, "(" + logged_in_email + ")");

    for (i = 1; i <= 2; i++) {
      var invitee = match[i];
      if (invitee === logged_in_user) {
        console.log("Not checking invitees for myself,", invitee)
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
      } else {
        console.log("already invited", invitee);
      }
    }
  });
}

window.addEventListener('hashchange', checkEvent, false);
window.addEventListener('ready', checkEvent, false);
