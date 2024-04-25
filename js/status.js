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
var searchString= "";
const company = sessionStorage.getItem('company');
if(!company){
    window.location.href = "stapage.html"
}

function GetData(){
    window.location.reload();
}

// Fetch data from Firebase
ref.orderByChild('company_name').equalTo(company).once('value', gotData, errData);


function searchTable(){
    var inputField = document.getElementById("search");
    searchString = inputField.value;
    ref.orderByChild('company_name').equalTo(company).once('value', gotData, errData);
}


function gotData(data) {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = `
                            <tr>
                            <th>Roll No</th>
                            <th>Name</th>
                            <th>Branch</th>
                            <th>Graduation Year</th>
                            <th>Status</th>
                            </tr>
                          `; // Clear previous data

    const records = data.val();
    const s_dict = {"1": "ACCEPTED", "-1": "REJECTED", "0": "PENDING"}
    const c_dict = {"1": "green", "-1": "red", "0": "blue"}
    if (records) {
        Object.keys(records).forEach(key => {
            const record = records[key];
            if(searchString != ''){
                const regex = new RegExp(searchString);
                if(regex.test(`${record.roll_no}`) || regex.test(`${record.name}`.toLocaleLowerCase())){
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${record.roll_no}</td>
                        <td style="text-align: left">${record.name}</td>
                        <td>${record.branch}</td>
                        <td>${record.g_year}</td>
                        <td style="color:${c_dict[record.status]}">${s_dict[record.status]}</td>
                    `;
                    tableBody.appendChild(row);
                    }
                }
            else{
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record.roll_no}</td>
                    <td style="text-align: left">${record.name}</td>
                    <td>${record.branch}</td>
                    <td>${record.g_year}</td>
                    <td style="color:${c_dict[record.status]}">${s_dict[record.status]}</td>
                `;
                tableBody.appendChild(row);
            }
        });
    }
}
   
function errData(err) {
    console.error(err);
}

