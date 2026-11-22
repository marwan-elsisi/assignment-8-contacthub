var nameInput = document.getElementById("contactName");
var phoneInput = document.getElementById("contactPhone");
var emailInput = document.getElementById("contactEmail");
var addressInput = document.getElementById("contactAddress");
var groupInput = document.getElementById("contactGroup");
var notesInput = document.getElementById("contactNotes");
var favoriteInput = document.getElementById("contactFavorite");
var emergencyInput = document.getElementById("contactEmergency");
var photoInput = document.getElementById("photoInput");
var searchInput = document.getElementById("searchInput");

var contactModal = new bootstrap.Modal(document.getElementById("contactModal"));

var nameRegex = /^[a-zA-Z؀-ۿ\s]{2,50}$/;
var phoneRegex = /^(\+20|0020|20)?0?1[0125][0-9]{8}$/;
var emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

var contacts = [];
var updateIndex = -1;
var photoPath = "";

if (localStorage.getItem("contacts") != null) {
    contacts = JSON.parse(localStorage.getItem("contacts"));
}
console.log(contacts);

displayAll();

function saveToStorage() {
    localStorage.setItem("contacts", JSON.stringify(contacts));
}

function displayAll() {
    displayContacts();
    displayFavorites();
    displayEmergency();
    displayStats();
}

function getInitials(name) {
    var words = name.trim().split(" ");
    if (words.length >= 2) {
        return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase();
}

function getAvatar(contact, size) {
    if (contact.image != "") {
        return `<img src="${contact.image}" alt="${contact.name}" class="avatar ${size}" />`;
    }
    var color = "color-" + (contact.name.length % 8);
    return `<div class="avatar ${size} ${color} d-flex justify-content-center align-items-center">${getInitials(contact.name)}</div>`;
}

function displayContacts() {
    var term = searchInput.value.trim().toLowerCase();
    var cartona = "";
    var count = 0;

    for (var i = 0; i < contacts.length; i++) {
        if (
            contacts[i].name.toLowerCase().includes(term) ||
            contacts[i].phone.includes(term) ||
            contacts[i].email.toLowerCase().includes(term)
        ) {
            count++;

            var starBadge = "";
            var heartBadge = "";
            var emailRow = "";
            var addressRow = "";
            var details = "";
            var groupTag = "";
            var emergencyTag = "";
            var tags = "";
            var mailBtn = "";
            var starIcon = `<i class="fa-regular fa-star"></i>`;
            var heartIcon = `<i class="fa-regular fa-heart"></i>`;
            var starActive = "";
            var heartActive = "";

            if (contacts[i].isFavorite) {
                starBadge = `<span class="badge-icon star-badge position-absolute rounded-circle d-flex justify-content-center align-items-center"><i class="fa-solid fa-star"></i></span>`;
                starIcon = `<i class="fa-solid fa-star"></i>`;
                starActive = "active";
            }

            if (contacts[i].isEmergency) {
                heartBadge = `<span class="badge-icon heart-badge position-absolute rounded-circle d-flex justify-content-center align-items-center"><i class="fa-solid fa-heart-pulse"></i></span>`;
                heartIcon = `<i class="fa-solid fa-heart-pulse"></i>`;
                heartActive = "active";
                emergencyTag = `<span class="tag emergency d-flex align-items-center gap-1"><i class="fa-solid fa-heart-pulse"></i>Emergency</span>`;
            }

            if (contacts[i].email != "") {
                emailRow = `<div class="d-flex align-items-center">
                    <span class="small-icon email-icon d-flex justify-content-center align-items-center flex-shrink-0"><i class="fa-solid fa-envelope"></i></span>
                    <span class="info-text text-truncate">${contacts[i].email}</span>
                </div>`;
                mailBtn = `<a href="mailto:${contacts[i].email}" class="action-btn mail-btn d-flex justify-content-center align-items-center" title="Email"><i class="fa-solid fa-envelope"></i></a>`;
            }

            if (contacts[i].address != "") {
                addressRow = `<div class="d-flex align-items-center">
                    <span class="small-icon address-icon d-flex justify-content-center align-items-center flex-shrink-0"><i class="fa-solid fa-location-dot"></i></span>
                    <span class="info-text text-truncate">${contacts[i].address}</span>
                </div>`;
            }

            if (contacts[i].group != "") {
                groupTag = `<span class="tag ${contacts[i].group}">${contacts[i].group}</span>`;
            }

            if (emailRow != "" || addressRow != "") {
                details = `<div class="details d-flex flex-column">${emailRow}${addressRow}</div>`;
            }

            if (groupTag != "" || emergencyTag != "") {
                tags = `<div class="tags d-flex flex-wrap">${groupTag}${emergencyTag}</div>`;
            }

            cartona += `<div class="col-12 col-sm-6">
                <div class="contact-card bg-white h-100 d-flex flex-column overflow-hidden">
                    <div class="card-top flex-grow-1">
                        <div class="card-head d-flex align-items-start">
                            <div class="position-relative flex-shrink-0">
                                ${getAvatar(contacts[i], "big")}
                                ${heartBadge}
                                ${starBadge}
                            </div>
                            <div class="flex-grow-1 overflow-hidden pt-1">
                                <h3 class="text-truncate">${contacts[i].name}</h3>
                                <div class="d-flex align-items-center gap-2 mt-1">
                                    <span class="small-icon phone-icon d-flex justify-content-center align-items-center flex-shrink-0"><i class="fa-solid fa-phone"></i></span>
                                    <span class="info-text phone-text text-truncate">${contacts[i].phone}</span>
                                </div>
                            </div>
                        </div>
                        ${details}
                        ${tags}
                    </div>
                    <div class="card-actions d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <a href="tel:${contacts[i].phone}" class="action-btn call-btn d-flex justify-content-center align-items-center" title="Call"><i class="fa-solid fa-phone"></i></a>
                            ${mailBtn}
                        </div>
                        <div class="d-flex align-items-center">
                            <button onclick="toggleFavorite(${i})" class="action-btn star-btn ${starActive} d-flex justify-content-center align-items-center" title="Favorite">${starIcon}</button>
                            <button onclick="toggleEmergency(${i})" class="action-btn heart-btn ${heartActive} d-flex justify-content-center align-items-center" title="Emergency">${heartIcon}</button>
                            <button onclick="editContact(${i})" class="action-btn edit-btn d-flex justify-content-center align-items-center" title="Edit"><i class="fa-solid fa-pen"></i></button>
                            <button onclick="deleteContact(${i})" class="action-btn delete-btn d-flex justify-content-center align-items-center" title="Delete"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    }

    if (count == 0) {
        cartona = `<div class="col-12 empty-box text-center">
            <div class="empty-icon d-flex justify-content-center align-items-center"><i class="fa-solid fa-address-book"></i></div>
            <p>No contacts found</p>
            <p class="small-p">Click "Add Contact" to get started</p>
        </div>`;
    }

    document.getElementById("contactsList").innerHTML = cartona;
    // console.log(count);
}

function displayFavorites() {
    var box = "";
    var mobileBox = "";

    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].isFavorite) {
            box += `<div class="side-item fav-item d-flex align-items-center gap-3">
                <div class="flex-shrink-0">${getAvatar(contacts[i], "small")}</div>
                <div class="flex-grow-1 overflow-hidden">
                    <h4 class="text-truncate">${contacts[i].name}</h4>
                    <p class="text-truncate">${contacts[i].phone}</p>
                </div>
                <a href="tel:${contacts[i].phone}" class="side-call flex-shrink-0 d-flex justify-content-center align-items-center"><i class="fa-solid fa-phone"></i></a>
            </div>`;

            mobileBox += `<a href="tel:${contacts[i].phone}" class="mobile-item fav-item bg-white d-flex align-items-center gap-2">
                <div class="flex-shrink-0">${getAvatar(contacts[i], "mini")}</div>
                <div class="flex-grow-1 overflow-hidden">
                    <h4 class="text-truncate">${contacts[i].name}</h4>
                    <p class="text-truncate">${contacts[i].phone}</p>
                </div>
                <span class="mobile-call flex-shrink-0 d-flex justify-content-center align-items-center"><i class="fa-solid fa-phone"></i></span>
            </a>`;
        }
    }

    if (box == "") {
        box = `<p class="empty-list text-center">No favorites yet</p>`;
        mobileBox = `<p class="empty-list text-center">No favorites yet</p>`;
    }

    document.getElementById("favList").innerHTML = box;
    document.getElementById("favListMobile").innerHTML = mobileBox;
}

function displayEmergency() {
    var box = "";
    var mobileBox = "";

    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].isEmergency) {
            box += `<div class="side-item emergency-item d-flex align-items-center gap-3">
                <div class="flex-shrink-0">${getAvatar(contacts[i], "small")}</div>
                <div class="flex-grow-1 overflow-hidden">
                    <h4 class="text-truncate">${contacts[i].name}</h4>
                    <p class="text-truncate">${contacts[i].phone}</p>
                </div>
                <a href="tel:${contacts[i].phone}" class="side-call flex-shrink-0 d-flex justify-content-center align-items-center"><i class="fa-solid fa-phone"></i></a>
            </div>`;

            mobileBox += `<a href="tel:${contacts[i].phone}" class="mobile-item emergency-item bg-white d-flex align-items-center gap-2">
                <div class="flex-shrink-0">${getAvatar(contacts[i], "mini")}</div>
                <div class="flex-grow-1 overflow-hidden">
                    <h4 class="text-truncate">${contacts[i].name}</h4>
                    <p class="text-truncate">${contacts[i].phone}</p>
                </div>
                <span class="mobile-call flex-shrink-0 d-flex justify-content-center align-items-center"><i class="fa-solid fa-phone"></i></span>
            </a>`;
        }
    }

    if (box == "") {
        box = `<p class="empty-list text-center">No emergency contacts</p>`;
        mobileBox = `<p class="empty-list text-center">No emergency contacts</p>`;
    }

    document.getElementById("emergencyList").innerHTML = box;
    document.getElementById("emergencyListMobile").innerHTML = mobileBox;
}

function displayStats() {
    var favCount = 0;
    var emergencyCount = 0;

    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].isFavorite) {
            favCount++;
        }
        if (contacts[i].isEmergency) {
            emergencyCount++;
        }
    }

    document.getElementById("totalCount").innerHTML = contacts.length;
    document.getElementById("favCount").innerHTML = favCount;
    document.getElementById("emergencyCount").innerHTML = emergencyCount;
    document.getElementById("contactsText").innerHTML = "Manage and organize your " + contacts.length + " contacts";
}

function openAddModal() {
    clearForm();
    updateIndex = -1;
    document.getElementById("modalTitle").innerHTML = "Add New Contact";
    contactModal.show();
}

function clearForm() {
    nameInput.value = "";
    phoneInput.value = "";
    emailInput.value = "";
    addressInput.value = "";
    groupInput.value = "";
    notesInput.value = "";
    favoriteInput.checked = false;
    emergencyInput.checked = false;
    photoInput.value = "";
    photoPath = "";
    document.getElementById("photoPreview").innerHTML = `<i class="fa-solid fa-user"></i>`;

    nameInput.classList.remove("is-invalid");
    phoneInput.classList.remove("is-invalid");
    emailInput.classList.remove("is-invalid");
    document.getElementById("nameError").classList.add("d-none");
    document.getElementById("phoneError").classList.add("d-none");
    document.getElementById("emailError").classList.add("d-none");
}

function previewPhoto() {
    var file = photoInput.files[0];
    if (file) {
        photoPath = "images/" + file.name;
        document.getElementById("photoPreview").innerHTML = `<img src="${photoPath}" alt="Avatar" />`;
    }
}

function validateName() {
    var value = nameInput.value.trim();
    if (value == "" || nameRegex.test(value)) {
        nameInput.classList.remove("is-invalid");
        document.getElementById("nameError").classList.add("d-none");
    } else {
        nameInput.classList.add("is-invalid");
        document.getElementById("nameError").classList.remove("d-none");
    }
}

function validatePhone() {
    var value = phoneInput.value.trim();
    if (value == "" || phoneRegex.test(value)) {
        phoneInput.classList.remove("is-invalid");
        document.getElementById("phoneError").classList.add("d-none");
    } else {
        phoneInput.classList.add("is-invalid");
        document.getElementById("phoneError").classList.remove("d-none");
    }
}

function validateEmail() {
    var value = emailInput.value.trim();
    if (value == "" || emailRegex.test(value)) {
        emailInput.classList.remove("is-invalid");
        document.getElementById("emailError").classList.add("d-none");
    } else {
        emailInput.classList.add("is-invalid");
        document.getElementById("emailError").classList.remove("d-none");
    }
}

function showError(title, text, input) {
    Swal.fire({
        icon: "error",
        title: title,
        text: text,
    });
    input.focus();
}

function saveContact() {
    var name = nameInput.value.trim();
    var phone = phoneInput.value.trim();
    var email = emailInput.value.trim();

    if (name == "") {
        showError("Missing Name", "Please enter a name for the contact!", nameInput);
        return;
    }
    if (!nameRegex.test(name)) {
        showError("Invalid Name", "Name should contain only letters and spaces (2-50 characters)", nameInput);
        return;
    }
    if (phone == "") {
        showError("Missing Phone", "Please enter a phone number!", phoneInput);
        return;
    }
    if (!phoneRegex.test(phone)) {
        showError("Invalid Phone", "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)", phoneInput);
        return;
    }

    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].phone == phone && i != updateIndex) {
            showError("Duplicate Phone Number", "A contact with this phone number already exists: " + contacts[i].name, phoneInput);
            return;
        }
    }

    if (email != "" && !emailRegex.test(email)) {
        showError("Invalid Email", "Please enter a valid email address", emailInput);
        return;
    }

    var contact = {
        name: name,
        phone: phone,
        email: email,
        address: addressInput.value.trim(),
        group: groupInput.value,
        notes: notesInput.value.trim(),
        image: photoPath,
        isFavorite: favoriteInput.checked,
        isEmergency: emergencyInput.checked,
    };

    if (updateIndex == -1) {
        contacts.push(contact);
        Swal.fire({
            icon: "success",
            title: "Added!",
            text: "Contact has been added successfully.",
            timer: 1500,
            showConfirmButton: false,
        });
    } else {
        contacts[updateIndex] = contact;
        Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Contact has been updated successfully.",
            timer: 1500,
            showConfirmButton: false,
        });
    }

    // console.log(contacts);
    saveToStorage();
    displayAll();
    contactModal.hide();
    updateIndex = -1;
}

function editContact(index) {
    clearForm();
    updateIndex = index;
    document.getElementById("modalTitle").innerHTML = "Edit Contact";

    nameInput.value = contacts[index].name;
    phoneInput.value = contacts[index].phone;
    emailInput.value = contacts[index].email;
    addressInput.value = contacts[index].address;
    groupInput.value = contacts[index].group;
    notesInput.value = contacts[index].notes;
    favoriteInput.checked = contacts[index].isFavorite;
    emergencyInput.checked = contacts[index].isEmergency;
    photoPath = contacts[index].image;

    if (photoPath != "") {
        document.getElementById("photoPreview").innerHTML = `<img src="${photoPath}" alt="Avatar" />`;
    } else {
        document.getElementById("photoPreview").innerHTML = getInitials(contacts[index].name);
    }

    contactModal.show();
}

function deleteContact(index) {
    Swal.fire({
        title: "Delete Contact?",
        text: "Are you sure you want to delete " + contacts[index].name + "? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
    }).then(function (result) {
        if (result.isConfirmed) {
            contacts.splice(index, 1);
            saveToStorage();
            displayAll();
            Swal.fire({
                icon: "success",
                title: "Deleted!",
                text: "Contact has been deleted.",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    });
}

function toggleFavorite(index) {
    contacts[index].isFavorite = !contacts[index].isFavorite;
    saveToStorage();
    displayAll();
}

function toggleEmergency(index) {
    contacts[index].isEmergency = !contacts[index].isEmergency;
    saveToStorage();
    displayAll();
}
