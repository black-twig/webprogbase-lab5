
async function GetUser(id) {
    // Standard XHR to load the user data
    const xhttp = new XMLHttpRequest();
     // When the request loads, check whether it was successful
    xhttp.addEventListener('load', function (e) {
        const target = e.target;
        console.log('User Load satus:',target.status);
        //console.log(target.responseURL);
        //console.log(target.getAllResponseHeaders());
        //console.log(target.responseText);
        console.log(target.responseText);
        // If successful, parse the request response
        if (target.status = 200) {
            const user = JSON.parse(target.responseText);
            console.log(user);
            document.getElementById("user_fullname").innerHTML = user.fullname;
            document.getElementById("user_login").innerHTML = user.login;
            document.getElementById("user_registeredAt").innerHTML = user.registeredAt;
        }
        else{
            // If it fails, reject the promise with a error message
            console.log('User info didn\'t load successfully; error code:' + request.statusText);
        }
    });
    xhttp.addEventListener('onerror', function() {
        // Also deal with the case when the entire request fails to begin with
        // This is probably a network error, so reject the promise with an appropriate message
            console.log('There was a network error in the GetUser function.');
    });

    xhttp.open("GET", "/api/users/" + id, true);
    // Send the request
    xhttp.send();
}