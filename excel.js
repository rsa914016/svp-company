// Initialize Firebase with your Firebase project configuration
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
  
  
  // Function to handle file upload
  document.getElementById('uploadButton').addEventListener('click', () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
  
        // Iterate through the data and add to Firebase
        jsonData.forEach(row => {
            console.log(row)
            firebase.database().ref('Excel/').push({
                manager_name: row['Manager Name'],
                manager_email: row['Manger Mail'],  
                company_name: row['Company Name'],
                roll_no: row['Student Roll.No'],
                link: row['Link'],
                status: 0,
              }).catch((error) => {
                console.error("Error adding user to database:", error);
                // Handle error while adding user to the database
              });
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      console.error('No file selected.');
    }
  });
  