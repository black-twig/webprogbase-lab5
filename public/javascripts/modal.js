function showModal(htmlContent) {

    let modal = document.getElementById("museumInfoModal");

    let modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = htmlContent;
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close")[0];
    span.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function hideModal () {
    let modal = document.getElementById("museumInfoModal");

    let modalContent = document.getElementById("modalContent");
    modalContent.innerHTML = '';
    modal.style.display = "none";
    let span = document.getElementsByClassName("close")[0];
    span.style.display = "none";
}

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }