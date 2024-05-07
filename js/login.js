const firebaseConfig = {
    apiKey: "AIzaSyBreCJDwBdF_HdIb2syX_rLgpkdLKUann0",
    authDomain: "contactform-f9a9b.firebaseapp.com",
    databaseURL: "https://contactform-f9a9b-default-rtdb.firebaseio.com",
    projectId: "contactform-f9a9b",
    storageBucket: "contactform-f9a9b.appspot.com",
    messagingSenderId: "601343494066",
    appId: "1:601343494066:web:0210cadcb1850b4dfdc6ab"
  };
  
firebase.initializeApp(firebaseConfig);
const ref = firebase.database().ref('Users');
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const mmail = loginForm.mmail.value;
    const company = loginForm.company.value;
    signInUser(mmail, company);
});

const company = sessionStorage.getItem('company');
if(company){
    window.location.href = "status.html"
}

function isValueInEmailField(mmail, cname) {
    return new Promise((resolve, reject) => {
      var ref = firebase.database().ref('Users'); // Reference to the root of your database
      ref.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var childData = childSnapshot.val();
          // Check if the email exists in the 'email' field
          if (childData['company_name'] === cname && childData['manager_email'] === mmail) {
            resolve(true); // Resolve the promise if value is found
          }
        });
        resolve(false); // Resolve false if value is not found in any record
      }, function(error) {
        reject(error); // Reject the promise if there's an error
      });
    });
  }

// Function to sign in a user
function signInUser(email, company) {
  
    if(isValidEmailWithDomainList(email)){

      isValueInEmailField(email, company).then((result) => {
      if (result) {
          Swal.fire({
              title: "Login Success!",
              text: "Welcome To UCEK Portal",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            }).then(() => {
                document.getElementById("loginForm").reset();
                window.location.href = "status.html";
                sessionStorage.setItem('company', company);
            });
      } else {
          Swal.fire({
              icon: "error",
              title: "Login Failed!",
              confirmButtonColor:"#0d6efd",
              text: "Check Your Credentials",
              timer: 1500
            }).then(() => {
              document.getElementById("loginForm").reset();
            });
        console.log("Value does not exist in the email field of Firebase records.");
      }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else{
    Swal.fire({
      icon: "error",
      title: "Login Failed!",
      confirmButtonColor:"#0d6efd",
      text: "Not A Registered Comapany With UCEK!",
      timer: 1500
    }).then(() => {
      document.getElementById("loginForm").reset();
    });
  }
}

function isValidEmailWithDomainList(email) {
  var validDomains = ["gmail.com", "tcs.com", "accenture.com", "apxor.com"]; 
  var emailDomain = email.split('@')[1];
  return validDomains.includes(emailDomain);
}