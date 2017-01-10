console.log("Running one:none v0.1")

let isCreatePage = () => location.hash.match(/^#eventpage_6/);

function checkEvent() {
  console.log('checking for 1:1s');
  if(!isCreatePage()) return;

  console.log('got create page');

  var title = $(".ep-title").children().val();
  console.log("Meeting title is ", title);

  var requirednames = []

  var titleRE = /(\w+):(\w+)/g;
  var match = titleRE.exec(title);
  if (match.length == 3) {
    console.log("Looks like a 1:1 between", match[1], "and", match[2]);
    // TODO: exclude the person who's adding the event.
    requirednames.push(match[1]);
    requirednames.push(match[2]);
  }

  var guestList = $(".ep-gl-guest");

  var invitednames = []

  console.log("Invited ", guestList.length, " people");
  for (i = 0; i < guestList.length; i++) {
    // TODO: This is hacky. Better to pull out the email address and parse properly.
    console.log("invited", guestList[i]["title"], ",", guestList[i]["id"]);
    invitednames.push(guestList[i]["title"])
    invitednames.push(guestList[i]["id"])
  }

  console.log("invited names are", invitednames);

  // Check for attendees when the Save button is clicked.
  $("div[id*='.save_top'].action-btn-wrapper").click(function() {
    console.log("Saved event with ", requirednames.length, "expected and", invitednames.length, "invited!");

    for (i = 0; i < requirednames.length; i++) {
      var found = false;
      for (j = 0; j < invitednames.length; j++) {
        if (invitednames[j].includes(requirednames[i])) {
          found = true;
          break;
        }
      }
      if (found === false) {
        alert("Did you mean to invite " + requirednames[i] + "?");
      } else {
        console.log("invited", requirednames[i]);
      }
    }
  });
}

window.addEventListener('hashchange', checkEvent, false);
window.addEventListener('ready', checkEvent, false);
