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
const database = firebase.database();
const ref = database.ref('Students');
const key = localStorage.getItem('mail');
if(!key){
    window.location.href = "login.html"
}
const key1 = localStorage.getItem('certificate')
if(!key1){
    window.location.href = "status.html"
}


const branchMap = new Map([
  ['CSE', 'Computer Science and Engineering'],
  ['ECE', 'Electronics and Communication Engineering'],
  ['ME', 'Mechanical Engineering'],
  ["EEE", "Electrical and Electronics Engineering"],
  ["CE", "Civil Engineering"]
]);

function logOut(){
    Swal.fire({
        title: "Are you sure?",
        text: "You need to login again...",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:"#0d6efd",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, LogOut!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "LogOut Success!",
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            firebase.auth().signOut().then(() => {
                localStorage.removeItem(mail);
                window.location.href = "login.html"
              }).catch((error) => {
                    console.error(error)
              });
        });
    }
      });
}


function generatePDF() {
  var dataelement = document.getElementById('data_');
  var dateelement = document.getElementById('date_');
  dateelement.innerHTML = printTodayDate();

  ref.orderByChild('emailid').equalTo(key).once('value', (snapshot) => {
    const userData = snapshot.val();
    Object.keys(userData).forEach(key => {
        const record = userData[key];
        if(record.status != 1){
          window.location.href = "status.html"
        }
        sname=record.name;
        roll=record.roll_no;
        branch = record.branch;
        gyear = record.g_year;
        dataelement.innerHTML = `This is to certify that ${sname}, with Roll No. ${roll},
        is a genuine student of this college. He/She pursued his graduation in the field
        of ${branchMap.get(branch)} during the academic year ${gyear-4} - ${gyear}.
        This certificate confirms that the student is validly enrolled and is affiliated 
        with the University.`
    })
  });
}


function checkAuthentication() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "login.html"
        } else{
            if(user.email == "admin@jntucek.ac.in"){
              window.location.href = "admin.html";
            }
          }
      });
    }

function printTodayDate() {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns 0-based month index
    const year = today.getFullYear().toString();

    const formattedDate = `Date: ${day}-${month}-${year}`;
    return formattedDate;
}

window.onload = function() {
  displayLoadingOverlay();
    generatePDF();
    checkAuthentication();
};

function displayLoadingOverlay() {
  document.getElementById('loadingOverlay').style.display = 'flex';
  setTimeout(function () {
      document.getElementById('loadingOverlay').style.display = 'none';
  }, 1500);
}

function download(){
  var element = document.getElementById('certificate');
  var opt = {
  filename:     'myfile.pdf',
  html2canvas:  { scale: 5 },
  jsPDF:        { unit: 'in', orientation: 'portrait' }
  };
  // New Promise-based usage:
  html2pdf().from(element).set(opt).save();
  localStorage.removeItem('certificate');
}
