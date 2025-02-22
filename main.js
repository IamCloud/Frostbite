
// Apply custom symbol to all ratings
function updateAllDiceTotals() {
    document.querySelectorAll('sl-rating.comp').forEach((rating) => {
        updCompDiceTotal(rating);
    });
}

function updCompDiceTotal(compRating) {
    const statValue = compRating.closest("sl-card").querySelector('sl-rating.stat').value;
    const total = compRating.value + statValue;
    compRating.parentElement.parentElement.querySelector('.diceTotal').textContent = total;
}

function updStatDiceTotals(statRating) {
    const compRatings = statRating.closest("sl-card").querySelectorAll('sl-rating.comp');
    compRatings.forEach((rating) => {
        updCompDiceTotal(rating);
    });
}


function setModified() {
    document.querySelector('#savedBtn').style.display = "none";
    document.querySelector('#saveBtn').style.display = "inline-flex";
}

function setSaved() {
    document.querySelector('#savedBtn').style.display = "inline-flex";
    document.querySelector('#saveBtn').style.display = "none";
}
function saveData() {
    const formData = {};

    document.querySelectorAll('[data-save-id]').forEach(input => {
        if (input.tagName === "SL-CHECKBOX") {
            formData[input.getAttribute('data-save-id')] = input.checked;
        } else {
            formData[input.getAttribute('data-save-id')] = input.value;
        }
    });

    localStorage.setItem("formData", JSON.stringify(formData));

    setSaved();
}

var intervalId = window.setInterval(function () {
    if (document.querySelector('#saveBtn').style.display === "inline-flex") {
        saveData();
    }
}, 500);

function loadLocalStorage() {
    const formData = JSON.parse(localStorage.getItem("formData"));
    if (formData) {
        Object.keys(formData).forEach(dataSaveId => {
            const input = document.querySelector(`[data-save-id="${dataSaveId}"]`);
            if (!input) return;
            switch (input.tagName) {
                case "SL-SELECT":
                    input.value = formData[dataSaveId];
                    break;
                case "SL-CHECKBOX":
                    input.checked = formData[dataSaveId];
                    break;
                default:
                    input.value = formData[dataSaveId];
                    break;
            }
        });
    }
}

function onBodyReady(compRatings){
    if (!document.body.classList.contains("ready")) {
      setTimeout(onBodyReady,100);
    } else {
      loadLocalStorage();
      updateAllDiceTotals();
    }
  }

document.addEventListener("DOMContentLoaded", () => {
    const allRatings = document.querySelectorAll('sl-rating');
    const compRatings = document.querySelectorAll('sl-rating.comp');
    const statRatings = document.querySelectorAll('sl-rating.stat');

    document.querySelector('#saveBtn').addEventListener('click', saveData);

    document.querySelectorAll("[data-save-id]").forEach(input => {
        input.addEventListener('input', setModified);
        input.addEventListener('sl-change', setModified);
    })

    allRatings.forEach((rating) => {
        rating.getSymbol = () => '<sl-icon name="square-fill"></sl-icon>';
    });
    compRatings.forEach((compRating) => {
        compRating.addEventListener('sl-change', (ev) => {
            updCompDiceTotal(ev.target);
        });
    });

    statRatings.forEach((compRating) => {
        compRating.addEventListener('sl-change', (ev) => {
            updStatDiceTotals(ev.target);
        });
    });

    document.querySelector('#deleteBtn').addEventListener('click', () => {
        const dialog = document.querySelector('.dialog-reset');
        dialog.show();
    });

    document.querySelector('.dialog-reset sl-button[variant="primary"]').addEventListener('click', () => {
        localStorage.removeItem("formData");
        location.reload();
    });

    document.querySelector('.dialog-reset sl-button[variant="secondary"]').addEventListener('click', () => {
        const dialog = document.querySelector('.dialog-reset');
        dialog.hide();
    })
    onBodyReady();
});

