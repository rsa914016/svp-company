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
var file = ""
document.getElementById("contactForm").addEventListener("submit", submitForm);
fileInput.addEventListener('change', function(e) {
  file = e.target.files[0];
});

function submitForm(e) {
  // alert("Hii!");
  e.preventDefault();

  var mname = getElementVal("mname");
  var emailid = getElementVal("emailid");
  var phno = getElementVal("phno")
  var cname = getElementVal("cname");

  var name = getElementVal("name");
  var roll = getElementVal("roll");
  var start = getElementVal("start");
  var branch = getElementVal("branch");
  registerUser(mname, emailid, phno, cname, roll, name, start, branch, file);
}


function isValueInRollField(roll, cname) {
  // console.log('Hi')
  return new Promise((resolve, reject) => {
    var ref = firebase.database().ref('Users'); // Reference to the root of your database
    ref.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        // console.log('Hi')
        var childData = childSnapshot.val();
        console.log(childData['company_name'], childData['roll_no'])
        // Check if the email exists in the 'email' field
        if (childData['company_name'] === cname && childData['roll_no'] === roll) {
          console.log(childData['company_name'], childData['roll_no'])
          resolve(true); // Resolve the promise if value is found
        }
      });
      resolve(false); // Resolve false if value is not found in any record
    }, function(error) {
      reject(error); // Reject the promise if there's an error
    });
  });
}


// Function to register a user and check for duplicates using another unique value
function registerUser(mname, memail, phno, cname, roll, name, start, branch, file) {
  // Check if the unique value already exists in the database
  isValueInRollField(roll, cname).then((result) => {
    if (result) {
        Swal.fire({
          icon: "error",
          title: "Duplicate User!",
          text: "Provided Roll Number Already Exists",
          confirmButtonColor:"#0d6efd",
          timer: 6000
        }).then(() => {
          // document.getElementById("contactForm").reset()
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
              manager_phone: phno, 
              company_name: cname.toUpperCase(),

              roll_no: roll,
              name: name,
              g_year: start,
              branch: branch,
              status: 0,
              dateTime: getCurrentDateTime()
              // You can add more user details here if needed
            })
            .then(() => {
              const storageRef = firebase.storage().ref();
              const pdfRef = storageRef.child('pdfs/' + roll);
              pdfRef.put(file).then((snapshot) => {
                console.log('PDF uploaded successfully!');
                Swal.fire({
                  title: "Registration Successfull!",
                  text: "User Added To The Verification Queue",
                  icon: "success",
                  confirmButtonColor:"#0d6efd",
                  timer: 3000
                }).then(() => {
                  document.getElementById("contactForm").reset();
                  console.log("User added to database");
              // You can perform further actions after adding user to the database
                  }).catch((error) => {
                console.error('Error uploading PDF:', error);
                alert('Error uploading PDF');
            });
            })
              
            })
            .catch((error) => {
              console.error("Error adding user to database:", error);
              // Handle error while adding user to the database
            });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const getElementVal = (id) => {
  return document.getElementById(id).value;
};

function getCurrentDateTime() {
  // Get current date and time
  var currentDate = new Date();

  // Get day, month, year
  var day = ('0' + currentDate.getDate()).slice(-2);
  var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  var year = currentDate.getFullYear();



  // Return formatted date and time
  return day + '/' + month + '/' + year;
}


function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  

  const storageRef = firebase.storage().ref();
  const pdfRef = storageRef.child('pdfs/' + file.name);

  pdfRef.put(file).then((snapshot) => {
      console.log('PDF uploaded successfully!');
      alert('PDF uploaded successfully!');
  }).catch((error) => {
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF');
  });
}


function checkStatus(){
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html"
    }
    else{
        window.location.href = "status.html";
    }
  });
}
