const percentageSelect = document.getElementById("percentage");
const presentInput = document.getElementById("present-input");
const totalInput = document.getElementById("total-input");
const btn = document.getElementById("btn");
const outputDiv = document.getElementById("output-div");
const errorMessageElement = document.getElementById('error-msg');
const subjectInput = document.getElementById('subject-input');

let target = null; // Stores the selected subject (e.g., "Subject-1")

// Listen for subject item clicks
$("ul.list-unstyled li a").on("click", function(){
  target = $(this).text().trim(); // "Subject-1", "Subject-2", etc.
});

btn.addEventListener("click", () => {
  let present = parseInt(presentInput.value);
  let total = parseInt(totalInput.value);
  let percentage = parseInt(percentageSelect.value);
  
  // Set table % and subject name if subject selected
  if (target) {
    let tablePercentage = (present / total) * 100;
    if (!isNaN(tablePercentage) && isFinite(tablePercentage)) {
      // Update percentage in the correct table cell
      $("#" + target).text(tablePercentage.toFixed(2) + "%");
      // Update subject name in the table
      let subjectName = subjectInput.value.trim();
      if (subjectName) {
        // Get table row for subject
        let subjectRow = document.getElementById(target).parentNode;
        // Set subject name cell (second cell in row)
        subjectRow.children[1].textContent = subjectName;
      }
    }
  }

  // Error validation
  if (
    isNaN(present) || isNaN(total) ||
    present < 0 || total <= 0 || present > total
  ) {
    outputDiv.innerText = "";
    errorMessageElement.textContent = "Please enter proper values 🙂";
    errorMessageElement.classList.add("shake");
    setTimeout(() => {
      errorMessageElement.classList.remove("shake");
    }, 400);
    return;
  }

  // Clear error if valid
  errorMessageElement.textContent = "";

  // Attendance calculation logic
  if (present / total >= percentage / 100) {
    outputDiv.innerHTML = daysToBunkText(
      daysToBunk(present, total, percentage),
      present,
      total
    );
    return;
  }
  outputDiv.innerHTML = daysToAttendClassText(
    reqAttendance(present, total, percentage),
    present,
    total,
    percentage
  );
});

// Calculation helpers
function reqAttendance(present, total, percentage) {
  return Math.ceil((percentage * total - 100 * present) / (100 - percentage));
}
function daysToBunk(present, total, percentage) {
  return Math.floor((100 * present - percentage * total) / percentage);
}
function daysToBunkText(daysAvailableToBunk, present, total) {
  return `You can bunk for <strong>${daysAvailableToBunk}</strong> more days.<br>
    Current Attendance: <strong>${present}/${total}</strong> -> <strong>${((present / total) * 100).toFixed(2)}%</strong><br>
    Attendance Then: <strong>${present}/${daysAvailableToBunk + total}</strong> -> <strong>${((present / (daysAvailableToBunk + total)) * 100).toFixed(2)}%</strong>`;
}
function daysToAttendClassText(attendanceNeeded, present, total, percentage) {
  return `You need to attend <strong>${attendanceNeeded}</strong> more classes to attain ${percentage}% attendance<br>
    Current Attendance: <strong>${present}/${total}</strong> -> <strong>${((present / total) * 100).toFixed(2)}%</strong><br>
    Attendance Required: <strong>${attendanceNeeded + present}/${attendanceNeeded + total}</strong> -> <strong>${(((attendanceNeeded + present) / (attendanceNeeded + total)) * 100).toFixed(2)}%</strong>`;
}