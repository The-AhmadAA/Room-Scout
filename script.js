/* Retrieves the current status of a room. If the building and room number are not the right
 * format will create an error alert above the search fields
 */
function fetch_room_status(bldg, room) {
  // Remove the error if it exists
  if (document.getElementById("room-error")) {
    document.getElementById("room-error").remove();
  }

  if (validate_location(bldg, room)) {
    //   construct the url to send the user to
    console.log(
      `http://splus.uq.edu.au/Signage/Reports/BootstrapList.aspx?objects=${bldg}-${room}&template=bootstrap_location_up_next&searchbydates=1&start=0&end=1018`
    );

    // remove any previous instances of the room result
    if (document.getElementById("room_result")) {
      document.getElementById("room_result").remove();
    }

    let iframe = document.createElement("iframe");
    iframe.id = "room_result";
    iframe.title = "room_result";
    iframe.className = "w-full h-screen py-10";
    iframe.src = `http://splus.uq.edu.au/Signage/Reports/BootstrapList.aspx?objects=${bldg}-${room}&template=bootstrap_location_up_next&searchbydates=1&start=0&end=1018`;

    document.getElementById("main").insertAdjacentElement("beforeend", iframe);

    iframe.onload = function () {
      document
        .getElementById("room_result")
        .scrollIntoView({ behavior: "smooth" });
    };

    return true;
  } else {
    // Code to execute if bldg and room are not valid
    console.log("Alert being generated");

    const warning = `<div role="alert" id="room-error" class="alert alert-error ">
                
                <span>Invalid building or room number - check your input</span>
            </div>`;
    document
      .getElementById("room_form")
      .insertAdjacentHTML("afterbegin", warning);
    return false;
  }
}

function single_room_multi_day(bldg, room, from, to) {
  let date_from = new Date(from);
  let date_to = new Date(to);
  if (!validate_location(bldg, room)) {
    create_error_message("Invalid building or room number - check your input");
    return false;
  } else if (!date_from < date_to) {
    create_error_message("single-room-multi", "Invalid date range");
    return false;
  } else {
    open(
      `http://splus.uq.edu.au/TimetableYear/Reports/CoreCalendar.aspx?template=location_grid_bigscreen&objects=${bldg}-${room}&days=${date_from.getDay()}-${date_to.getDay()}&weeks=t&periods=5-33`,
      "_blank"
    );
    return true;
  }
}

function multi_room_multi_day(rooms, from, to) {}

function create_error_message(element, message) {
  const error = `<div role="alert" class="alert alert-error ">
                
                <span>${message}</span>
            </div>`;
  document.getElementById(element).insertAdjacentHTML("afterbegin", error);
}

function validate_location(bldg, room) {
  const bldg_re = /(?:^[0-9]{2,2}[A-Z]{0,1}$)/;
  const room_re = /(?:^[A-Z]{0,1}[0-9]{3,3}[A-Z]{0,1}$)/; // for rooms without a letter suffix (most rooms)

  if (bldg_re.test(bldg) && room_re.test(room)) {
    return true;
  }
  return false;
}
