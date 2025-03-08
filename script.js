var map = L.map('map').setView([36.2978, 59.6057], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var schools = [];
var markers = [];
var fields = ["کامپیوتر", "برق", "معماری", "مکانیک", "حسابداری", "گرافیک", "الکترونیک", "مدیریت", "نقشه‌کشی", "صنایع غذایی", "تربیت بدنی"];
var genders = ["پسرانه", "دخترانه"];

function loadSchools(fileType) {
    fetch(`schools.${fileType}`)
        .then(response => {
            if (fileType === "json") {
                return response.json();
            } else if (fileType === "csv") {
                return response.text();
            } else if (fileType === "xml") {
                return response.text();
            }
        })
        .then(data => {
            if (fileType === "json") {
                schools = data;
            } else if (fileType === "csv") {
                parseCSV(data);
            } else if (fileType === "xml") {
                parseXML(data);
            }
            addMarkers();
        })
        .catch(error => console.error("خطا در بارگذاری داده‌ها:", error));
}

function parseCSV(csvData) {
    let rows = csvData.split("\n").map(row => row.split(","));
    let headers = rows.shift();
    schools = rows.map(row => {
        let obj = {};
        headers.forEach((header, i) => obj[header.trim()] = row[i].trim());
        obj.lat = parseFloat(obj.lat);
        obj.lon = parseFloat(obj.lon);
        obj.students = parseInt(obj.students);
        return obj;
    });
}

function parseXML(xmlString) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlString, "text/xml");
    let schoolNodes = xmlDoc.getElementsByTagName("school");
    schools = Array.from(schoolNodes).map(school => ({
        name: school.getElementsByTagName("name")[0].textContent,
        lat: parseFloat(school.getElementsByTagName("lat")[0].textContent),
        lon: parseFloat(school.getElementsByTagName("lon")[0].textContent),
        gender: school.getElementsByTagName("gender")[0].textContent,
        field: school.getElementsByTagName("field")[0].textContent,
        students: parseInt(school.getElementsByTagName("students")[0].textContent),
        address: school.getElementsByTagName("address")[0].textContent
    }));
}

function addMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    schools.forEach(school => {
        var iconUrl = school.gender === "پسرانه" ? "images/boy.png" : "images/girl.png";

        var marker = L.marker([school.lat, school.lon], {
            icon: L.icon({ iconUrl: iconUrl, iconSize: [32, 32] })
        }).addTo(map)
        .bindPopup(`<b>${school.name}</b><br>📍 ${school.address}<br>🎓 رشته: ${school.field}<br>👨‍🎓 جنسیت: ${school.gender}<br>📊 تعداد هنرجویان: ${school.students}`);

        markers.push(marker);
    });
}

document.querySelectorAll("input, select").forEach(element => {
    element.addEventListener("input", filterSchools);
});

function filterSchools() {
    var nameFilter = document.getElementById("searchName").value.toLowerCase();
    var addressFilter = document.getElementById("searchAddress").value.toLowerCase();
    var genderFilter = document.getElementById("gender").value;
    var fieldFilter = document.getElementById("field").value;

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    schools.forEach(school => {
        var matchName = school.name.toLowerCase().includes(nameFilter);
        var matchAddress = school.address.toLowerCase().includes(addressFilter);
        var matchGender = (genderFilter === "all" || school.gender === genderFilter);
        var matchField = (fieldFilter === "all" || school.field === fieldFilter);

        if (matchName && matchAddress && matchGender && matchField) {
            var iconUrl = school.gender === "پسرانه" ? "images/boy.png" : "images/girl.png";
            
            var marker = L.marker([school.lat, school.lon], {
                icon: L.icon({ iconUrl: iconUrl, iconSize: [32, 32] })
            }).addTo(map)
            .bindPopup(`<b>${school.name}</b><br>📍 ${school.address}<br>🎓 رشته: ${school.field}<br>👨‍🎓 جنسیت: ${school.gender}<br>📊 تعداد هنرجویان: ${school.students}`);

            markers.push(marker);
        }
    });
}

// مقداردهی اولیه با فایل JSON (می‌توانید CSV یا XML را انتخاب کنید)
loadSchools("json");
