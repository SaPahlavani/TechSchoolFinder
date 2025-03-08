var map = L.map('map').setView([36.2978, 59.6057], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var schools = [];
var markers = [];

function loadSchools() {
    fetch("schools.json")
        .then(response => response.json())
        .then(data => {
            schools = data;
            addMarkers();
        })
        .catch(error => console.error("خطا در بارگذاری داده‌ها:", error));
}

function addMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    schools.forEach(school => {
        var gender = school.Status.includes("دخترانه") ? "دخترانه" : "پسرانه";
        var iconUrl = gender === "پسرانه" ? "image/boy.png" : "image/girl.png";
        
        var marker = L.marker([school.Lat, school.Lan], {
            icon: L.icon({ iconUrl: iconUrl, iconSize: [32, 32] })
        }).addTo(map)
        .bindPopup(`<b>${school.SchoolName}</b><br>📍 ${school.Address}<br>🎓 ${school.Branch}<br>👨‍🎓 جنسیت: ${gender}`);

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
        var gender = school.Status.includes("دخترانه") ? "دخترانه" : "پسرانه";
        var matchName = school.SchoolName.toLowerCase().includes(nameFilter);
        var matchAddress = school.Address.toLowerCase().includes(addressFilter);
        var matchGender = (genderFilter === "all" || gender === genderFilter);
        var matchField = (fieldFilter === "all" || school.Branch === fieldFilter);

        if (matchName && matchAddress && matchGender && matchField) {
            var iconUrl = gender === "پسرانه" ? "image/boy.png" : "image/girl.png";
            
            var marker = L.marker([school.Lat, school.Lan], {
                icon: L.icon({ iconUrl: iconUrl, iconSize: [32, 32] })
            }).addTo(map)
            .bindPopup(`<b>${school.SchoolName}</b><br>📍 ${school.Address}<br>🎓 ${school.Branch}<br>👨‍🎓 جنسیت: ${gender}`);

            markers.push(marker);
        }
    });
}

// مقداردهی اولیه با فایل JSON
loadSchools();
