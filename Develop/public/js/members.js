let appointmentData = {
  clientID: null,
  doctorID: null,
  doctorName: null,
  year: null,
  month: null,
  day: null,
  hour: null,
  healthcardNum: null,
  height: null,
  weight: null,
  currentMed: null,
  checkup: null,
};

let role;
let doctorSchedule = [];
let doctorArray = [];
let daysArray = [];
let timeSlots = [];

$(document).ready(function () {
  const userContainer = $("#userContainer");
  const userHeader = $(".userHeader");
  const doctorScheduleSelect = $("#doctorScheduleSelect");
  const apptContainer = $("#appointment-form");

  getUserData();

  function getUserData() {
    $.get("/api/user_data").then(function (data) {
      $(".member-name").text(data.name);
      appointmentData.clientID = data.id;
      appointmentData.clientName = data.name;
      role = data.role;

      if (data.doctorSchedule) {
        doctorSchedule = JSON.parse(data.doctorSchedule);
      }

      if (role == "patient" || role == "doctor") {
        getAppointments(role, appointmentData.clientID);
      }
      getDoctors(role);
    });
  }

  function getAppointments(role, id) {
    $.post("/api/getUserAppointments", {
      id: id,
      role: role,
    }).then(function (data) {
      if (data) {
        if (data.role == "patient") {
          for (appointment of data.appointments) {
            userHeader.html(
              "<p> Your booked appointment on " +
                appointment.month +
                "/" +
                appointment.day +
                "/" +
                appointment.year +
                " at " +
                appointment.hour +
                ":00" +
                " with " +
                appointment.doctorName +
                "</p>"
            );
          }
        }
        if (data.role == "doctor" || data.role == "admin") {
          getWorkingData(doctorSchedule);
          for (appointment of data.appointments) {
            userContainer.append(
              ` <div class="col-lg-6 col-sm-12 ">
              <div class="card border-success h-100 p-2 mt-2">
                <div class="card-body flex-column align-items-center">
              <div><h5> ${appointment.month}/${appointment.day}/${appointment.year} at ${appointment.hour}:00</h5></div>
              <div><p>Appointments with: <h4>${appointment.clientName}</h4></p>
             
              <ul>
                <li>Healthcard Number: ${appointment.healthcardNum}</li>
                <li>Height: ${appointment.height}</li>
                <li>Weight: ${appointment.weight}</li>                
                <li> Medication client taking: ${appointment.currentMed}</li>
                <li>The patient here for: ${appointment.checkup}</li>
              </ul>
              </div></div></div></div>`
            );
          }
        }
      }
    });
  }

  function getWorkingData(doctorSchedule) {
    let exists = false;
    if (doctorSchedule.length > 0) {
      exists = true;
    }

    $.get("/api/getWorkingData").then(function (data) {
      for (day of data.workingDays) {
        if (!exists) {
          let obj = {
            day: day,
            hours: data.workingHours,
          };
          doctorSchedule.push(JSON.parse(JSON.stringify(obj)));
        }

        apptContainer.append(`<h3 class='font-weight-bold' >${day}</h3>`);
        for (hour of data.workingHours) {
          apptContainer.append(`
         
            <div class="form-check form-check-inline" >
          <input type="checkbox" class="form-check-input" id=${
            day + "_" + hour.hour
          }>
          <label class="form-check-label lg" for=${day} value=${hour.hour}>${
            hour.name
          }</label>
        </div>`);
        }
      }

      doctorScheduleSelect.append(
        "<button class='btn btn-success' id='scheduleSubmit'>Submit schedule<button>"
      );

      if (role == "admin") {
        userContainer.append("<button class='btn btn-success' id='back'>Back</button>");
      }

      applySchedule();
      function applySchedule() {
        if (exists) {
          for (i in doctorSchedule) {
            for (j in doctorSchedule[i].hours) {
              if (doctorSchedule[i].hours[j].avail) {
                let day = doctorSchedule[i].day;
                let hour = doctorSchedule[i].hours[j].hour;
                let checkboxID = "#" + day + "_" + hour;
                $(checkboxID).prop("checked", true);
              }
            }
          }
        }
      }

      $("input:checkbox").change(function (event) {
        var isChecked = $(this).is(":checked");
        str = event.target.id.split("_");
        dayName = str[0];
        hour = str[1];
        updateSchedule();
        function updateSchedule() {
          for (entry of doctorSchedule) {
            if (entry.day === dayName) {
              for (h of entry.hours) {
                if (h.hour == hour) {
                  h.avail = isChecked;
                  return;
                }
              }
            }
          }
        }
      });

      function createSubmitObject() {
        let doctorID = ""
        if (role == "doctor") {
          doctorID = appointmentData.clientID
        }
        if (role == "admin") {
          doctorID = appointmentData.doctorID
        }
        
        let obj = {
          schedule: JSON.stringify(doctorSchedule),
          doctorID: doctorID
        }
        return obj
      }

      $("#scheduleSubmit").on("click", () => {
        $.post("/api/submitDoctorSchedule", createSubmitObject()).then(function (data) {
          doctorScheduleSelect.append(data);
        });
      });
    });
  }

  function getDoctors(role) {
    if (role == "patient" || role == "admin") {
      let buttonText = "Book now";

      if (role == "admin") {
        buttonText = "View";
      }

      $.get("/api/getdoctors").then(function (data) {
        doctorArray = data;
        for (doctor of data) {
          userContainer.append(
            "<div class='col my-2'><div class='card bg-success h-100'><div id='showdocs' class='card-body text-light'><h5 class='card-title font-weight-bold'>" +
              doctor.name +
              "</h5><p>Gender: " +
              doctor.gender +
              "</p><p>Province: " +
              doctor.province +
              "</p><p>Email: <a class='text-warning' href=mailto:" +
              doctor.email +
              ">" +
              doctor.email +
              "</a></p><p>Phone number: <a class='text-warning' href=tel:" +
              doctor.phone +
              "> " +
              doctor.phone +
              "</a></p><button class='booknow btn btn-outline-light'id=" +
              doctor.name +
              " value=" +
              doctor.id +
              "> " +
              buttonText +
              "</button></div></div></div>"
          );
        }
      });
    }
  }

  function getDays() {
    $.post("/api/getDates", {
      doctorID: appointmentData.doctorID,
    }).then(function (data) {
      daysArray = data;
      if (daysArray.length != 0) {
        for (index in daysArray) {
          userContainer.append(
            "<div class='col my-2'><div class='card bg-success h-100'><div class='card-body text-light'><h5 class='card-title font-weight-bold'><button class='btn btn-outline-light' value='days' id=" +
            index +">"+daysArray[index].name +"</button></div></div></div>"
          );
        }
      } else {
        userContainer.append("<h3 class='font-weight-bold text-center'>The doctor you have chosen is unavailable on this date</h3>");
      }
      userContainer.append("<div class='col my-2'><div class='card bg-primary h-100'><div class='card-body text-light'><h5 class='card-title font-weight-bold'>Select a different doctor</h5><a class='btn btn-outline-light' id='back'>Go Back</a></div></div></div>");
    });
  }

  function getSchedule(doctorID, dayID) {
    let day = daysArray[dayID];
    appointmentData.doctorName = getDoctorName(doctorID, doctorArray);
    appointmentData.year = day.year;
    appointmentData.month = day.month;
    appointmentData.day = day.day;
    $.post("/api/getSchedule", {
      id: doctorID,
      year: day.year,
      month: day.month,
      day: day.day,
      dayOfWeek: day.name.substring(0, 3),
    }).then(function (data) {
      userContainer.append(
        "<div class='col my-2'><div class='card bg-white border-0 h-100'><div class='card-body text-success'><h3 id='doctor-name' class='card-title font-weight-bold'>" + appointmentData.doctorName + "'s availability:</h3></div></div></div>"
      );
      timeSlots = data;
      if (timeSlots.length != 0) {
        for (index in timeSlots) {
          userContainer.append(
            "<div class='col my-2'><div class='card bg-success h-100'><div class='card-body text-light'><h5 class='card-title font-weight-bold'>Select this time</h5><button type='submit' class='btn btn-outline-light' value='timeslot' id=" +
               index+
              ">" +timeSlots[index].name+"</button></div></div></div>"
          );
        }
      } else {
        userContainer.append("<h3 class='font-weight-bold text-center'>The doctor you have chosen is unavailable on this date</h3>");
      }

      userContainer.append("<div class='col my-2'><div class='card bg-primary h-100'><div class='card-body text-light'><h5 class='card-title font-weight-bold'>Select a different doctor</h5><a class='btn btn-outline-light' id='back'>Go Back</a></div></div></div>");
    });
  }

  function showAppointmentForm() {
    userContainer.append(`<form class="appointment mt-1 text-success font-weight-bold">
      <div class="form-group">
        <label for="heaithcardnumber">Healthcard Number:</label>
        <input type="text" class="form-control" id="heaithcardnumber" aria-describedby="healthcardHelp" placeholder="1234-567-890-XX">
        <small id="questionHelp1" class="form-text text-muted">We'll never share your information with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="height">Height:</label>
        <input type="text" class="form-control" id="height" aria-describedby="medicalQuestion" placeholder="Please enter your height">
        <small id="questionHelp2" class="form-text text-muted">Ex. 5'10</small>
      </div>
      <div class="form-group">
        <input type="text" class="form-control-inline" id="weightUnit" aria-describedby="medicalQuestion" placeholder="Weight in lbs">
       
      </div>
      <div class="form-group form-check">
        <input type="checkbox" class="form-check-input" id="medicationCheck" onclick="showMedication()">
        <label class="form-check-label" for="medicationCheck"> Are you taking any medication?</label>
      </div>
      <div class="form-group" id="medicationList" style="display:none">
        <label for="medicationList">Please list any current or recent medication:</label>
        <input type="text" class="form-control" id="medicationListInput" aria-describedby="medicalQuestion" placeholder="Painkillers, Antibiotics, etc.">
        <small id="questionHelp4" class="form-text text-muted">Make sure to include everything so doctors can safely make recommendations.</small>
      </div>
      <div class="form-group">
        <label for="checkup">What brought you in today?</label>
        <select class="form-control" id="checkup">
          <option>General Check-Up</option>
          <option>Prescription Renewal</option>
          <option>Acute Pain</option>
          <option>Doctor's Note</option>
          <option>Referral</option>
        </select>
        <small id="questionHelp5" class="form-text text-muted">Check-Up, Prescriptions, etc.</small>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>`);
    var heaithcardInput = $("#heaithcardnumber");
    var heightInput = $("#height");
    var weightInput = $("#weightUnit");
    var medicationListInput = $("#medicationListInput");
    var checkupInput = $("#checkup");
    var appointmentForm = $(".appointment");

    appointmentForm.on("submit", function (event) {
      event.preventDefault();

      appointmentData.healthcardNum = heaithcardInput.val().trim();
      appointmentData.height = heightInput.val().trim();
      appointmentData.weight = weightInput.val().trim();
      appointmentData.currentMed = medicationListInput.val().trim();
      appointmentData.checkup = checkupInput.val().trim();

      createAppointment(appointmentData);
    });
  }

  function createAppointment(appointmentData) {
    $.post("/api/createAppointment", appointmentData).then(function (data) {
      userContainer.html(data);
      apptContainer.html("<img src='./assets/sick_teddy_bear.png' alt='A very sick teddy bear' class='img-fluid mb-3'/><h3 class='font-weight-bold text-success text-center'>" + data + "</h3>");

      userContainer.append("<button id='back' class='btn btn-success' >Back</button>");
    });
  }

  userContainer.on("click", (event) => {
    if (role === "patient" || role === "admin") {

      if ($(event.target).attr("class") == "booknow btn btn-outline-light") {
        if (role == "patient") {
          appointmentData.doctorID = event.target.value;
          userContainer.html("");
          getDays();
        }
        if (role === "admin") {
          userContainer.html("");
          appointmentData.doctorID = event.target.value
          $.post("/api/getDoctorSchedule", {
            doctorID: appointmentData.doctorID,
          }).then(function (data) {
            doctorSchedule = data
            getAppointments(role, appointmentData.doctorID)
          });

        }
      }

      if (event.target.value == "days") {
        userContainer.html("");
        getSchedule(appointmentData.doctorID, event.target.id);
        return;
      }

      if (event.target.value == "timeslot") {
        userContainer.html("");
        appointmentData.hour = timeSlots[event.target.id].hour;
        showAppointmentForm();
        return;
      }

      if (event.target.id == "back") {
        apptContainer.html("");
        userContainer.html("");
        doctorScheduleSelect.html("")
        getDoctors(role);
        if (role != "admin") {
          getAppointments(role, appointmentData.clientID);
        }
        return;
      }
    }
  });
});

function getDoctorName(doctorID, array) {
  for (doctor of array) {
    if (doctor.id == doctorID) {
      return doctor.name;
    }
  }
}

function showMedication() {
  const medicationCheck = document.getElementById("medicationCheck");
  const medicationList = document.getElementById("medicationList");

  if (medicationCheck.checked == true) {
    medicationList.style.display = "block";
  } else {
    medicationList.style.display = "none";
  }
}
