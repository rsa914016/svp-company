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
const ref = database.ref('Users');

const key = sessionStorage.getItem('roll_no');
if(!key){
    window.location.href = "status.html"
}



function generatePDF() {
  var dataelement = document.getElementById('data_');
  var dateelement = document.getElementById('date_');
  dateelement.innerHTML = printTodayDate();

  ref.orderByChild('roll_no').equalTo(key).once('value', (snapshot) => {
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
        dataelement.innerHTML = `This is to certify that <b>${sname}</b>, with Roll No. <b>${roll}</b>,
        is a genuine student of this college. He/She pursued his graduation in the field
        of <b>${branch}</b> during the academic year <b>${gyear-4} - ${gyear}</b>.
        This certificate confirms that the student is validly enrolled and is affiliated 
        with the University JNTUK.`
    })
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
