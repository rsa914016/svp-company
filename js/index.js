const firebaseConfig = {
    apiKey: "AIzaSyBreCJDwBdF_HdIb2syX_rLgpkdLKUann0",
    authDomain: "contactform-f9a9b.firebaseapp.com",
    databaseURL: "https://contactform-f9a9b-default-rtdb.firebaseio.com",
    projectId: "contactform-f9a9b",
    storageBucket: "contactform-f9a9b.appspot.com",
    messagingSenderId: "601343494066",
    appId: "1:601343494066:web:0210cadcb1850b4dfdc6ab"
  };
  
// initialize firebase
firebase.initializeApp(firebaseConfig);
document.getElementById("contactForm").addEventListener("submit", submitForm);

function submitForm(e) {
  // alert("Hii!");
  e.preventDefault();

  var mname = getElementVal("mname");
  var emailid = getElementVal("emailid");
  var cname = getElementVal("cname");

  var name = getElementVal("name");
  var roll = getElementVal("roll");
  var start = getElementVal("start");
  var branch = getElementVal("branch");
  var driveLink = getElementVal("link");
  registerUser(mname, emailid, cname, roll, name, start, branch, driveLink);
}

// Function to register a user and check for duplicates using another unique value
function registerUser(mname, memail, cname, roll, name, start, branch, driveLink) {
  // Check if the unique value already exists in the database
  firebase.database().ref('Users').orderByChild('roll_no').equalTo(roll).once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        Swal.fire({
          icon: "error",
          title: "Duplicate User!",
          text: "Provided Roll Number Already Exists",
          confirmButtonColor:"#0d6efd",
          timer: 6000
        }).then(() => {
          document.getElementById("contactForm").reset()
        });
        console.error("User with the provided Roll Number already exists.");
        // Handle the case where a user with the provided unique value already exists
      } else {
        // Proceed with user registration if the unique value is not found
        // print(dob)
            // Add user details to the Realtime Database
            firebase.database().ref('Users/').push({
              manager_name: mname,
              manager_email: memail,  
              company_name: cname,

              roll_no: roll,
              name: name,
              g_year: start,
              branch: branch,
              link: driveLink,
              status: 0,
              // You can add more user details here if needed
            })
            .then(() => {
              Swal.fire({
                title: "Registration Successfull!",
                text: "User Added To The Verification Queue",
                icon: "success",
                confirmButtonColor:"#0d6efd",
                timer: 3000
              }).then(() => {
                document.getElementById("contactForm").reset();
            })
              // reset the form
              console.log("User added to database");
              // You can perform further actions after adding user to the database
            })
            .catch((error) => {
              console.error("Error adding user to database:", error);
              // Handle error while adding user to the database
            });
      }
    })
    .catch((error) => {
      console.error("Error checking for duplicate users:", error);
      // Handle error while checking for duplicate users
    });
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
};



function checkStatus(){
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "stapage.html"
    }
    else{
        window.location.href = "admin.html";
    }
  });
}
