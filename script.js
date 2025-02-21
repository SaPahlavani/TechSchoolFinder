var map = L.map('map').setView([36.2978, 59.6057], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var schools = [];
var fields = ["کامپیوتر", "برق", "معماری", "مکانیک", "حسابداری", "گرافیک", "الکترونیک", "مدیریت", "نقشه‌کشی", "صنایع غذایی", "تربیت بدنی"];
var genders = ["پسرانه", "دخترانه"];

for (var i = 0; i < 50; i++) {
    schools.push({
        name: "هنرستان شماره " + (i + 1),
        lat: 36.2 + Math.random() * 0.2,
        lon: 59.5 + Math.random() * 0.2,
        gender: genders[Math.floor(Math.random() * genders.length)],
        field: fields[Math.floor(Math.random() * fields.length)],
        students: Math.floor(Math.random() * 200) + 50,
        address: "خیابان " + (10 + i) + "، مشهد"
    });
}

var markers = [];
function addMarkers() {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    schools.forEach(school => {
        var iconUrl = school.gender === "پسرانه" ? "image/boy.png" : "image/girl.png";

        var marker = L.marker([school.lat, school.lon], {
            icon: L.icon({ iconUrl: iconUrl, iconSize: [32, 32] })
        }).addTo(map)
        .bindPopup(`<b>${school.name}</b><br>📍 ${school.address}<br>🎓 رشته: ${school.field}<br>👨‍🎓 جنسیت: ${school.gender}<br>📊 تعداد هنرجویان: ${school.students}`);

        markers.push(marker);
    });
}
addMarkers();

function showSuggestions() {
    var input = document.getElementById("searchName").value.toLowerCase();
    var suggestionsDiv = document.getElementById("suggestions");

    if (input === "") {
        suggestionsDiv.style.display = "none";
        return;
    }

    var suggestions = schools.filter(s => s.name.toLowerCase().includes(input));
    suggestionsDiv.innerHTML = "";
    suggestions.forEach(school => {
        var div = document.createElement("div");
        div.innerHTML = school.name;
        div.onclick = function() {
            document.getElementById("searchName").value = school.name;
            filterSchools();
            suggestionsDiv.style.display = "none";
        };
        suggestionsDiv.appendChild(div);
    });

    suggestionsDiv.style.display = suggestions.length ? "block" : "none";
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
