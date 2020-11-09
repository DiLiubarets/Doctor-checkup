$(document).ready(function () {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  var clinicPasswordContainer = $("#clinicPasswordInput");
  var nameInput = $("#name");
  var genderInput = $("#gender");
  var provinceInput = $("#province");
  var phoneInput = $("#phone");

  var clinicPasswordInput = $("#passwordClinic");
  var tab = $("#myTab");

  let role = "patient";

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function (event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      name: nameInput.val().trim(),
      gender: genderInput.val().trim(),
      province: provinceInput.val().trim(),
      phone: phoneInput.val().trim(),
    };

    if (clinicPasswordInput.val()) {
      userData.clinicPassword = clinicPasswordInput.val().trim();
    } else {
      userData.clinicPassword = "";
    }

    if (!userData.email || !userData.password) {
      return;
    }

    console.log("works");

    // If we have an email and password, run the signUpUser function
    signUpUser(
      userData.email,
      userData.password,
      userData.clinicPassword,
      userData.name,
      userData.gender,
      userData.province,
      userData.phone
    );
    emailInput.val("");
    passwordInput.val("");
    clinicPasswordInput.val("");
    nameInput.val("");
    genderInput.val("");
    provinceInput.val("");
    phoneInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors

  //signUpUser("dina.liubarets@gmail.com", "12345", "", "Dina", "F", "ON", "8193284965")

  function signUpUser(
    email,
    password,
    clinicPassword,
    name,
    gender,
    province,
    phone
  ) {
    $.post("/api/signup", {
      email: email,
      password: password,
      role: role,
      clinicPassword: clinicPassword,
      name: name,
      gender: gender,
      province: province,
      phone: phone,
    })
      .then(function (data) {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }

  tab.on("click", (event) => {
    role = event.target.id;
    role = role.slice(0, -4);

    console.log(role);

    if (role == "doctor") {
      clinicPasswordContainer.html(
        "<label for='exampleInputPassword1'>Clinic Password*</label><input type='password' class='form-control' id='passwordClinic' placeholder='Password'/>"
      );
      clinicPasswordInput = $("#passwordClinic");
    } else {
      clinicPasswordContainer.html("");
    }
  });

  //loginUser("diana.liubarets@gmail.com", "123456");
});

function loginUser(email, password) {
  $.post("/api/login", {
    email: email,
    password: password,
  })
    .then(function () {
      window.location.replace("/members");
      // If there's an error, log the error
    })
    .catch(function (err) {
      console.log(err);
    });
}
