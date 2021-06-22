let mst_templates = new Object();


async function loadMstTemplate(templateURL) {
      // Create new promise with the Promise() constructor;
      // This has as its argument a function
      // with two parameters, resolve and reject
      return new Promise(function(resolve, reject) {
  
          if (mst_templates[templateURL]){ //if template's already preloaded - use it
              console.log ('already preloaded mst',templateURL);
              //console.log('mst_templates',mst_templates);
              resolve(mst_templates[templateURL]); 
              return;
          }
        // Standard XHR to load an image
        const request = new XMLHttpRequest();
        request.open('GET', templateURL);
        // When the request loads, check whether it was successful
        request.onload = function() {
          if (request.status === 200) {
              // If successful, resolve the promise by passing back the request response
              mst_templates[templateURL]=request.response;
              console.log('loaded template',templateURL);
              resolve(request.response);
          } else {
              // If it fails, reject the promise with a error message
              reject(Error('Template didn\'t load successfully; error code:' + request.statusText));
          }
        };
        request.onerror = function() {
        // Also deal with the case when the entire request fails to begin with
        // This is probably a network error, so reject the promise with an appropriate message
            reject(Error('There was a network error in the loadMstTemplate function.'));
        };
        // Send the request
        request.send();
      });
    }
  

function showLoader() {
    let loader = document.getElementById("loader");
    console.log(loader.id);
    if (loader)
        loader.style.display = "block";

}

function hideLoader() {
    let loader = document.getElementById("loader");
    //console.log(loader.id);
    if (loader)
        loader.style.display = "none";
}

function DateTimeInUAFormat(value)
{
  const datetime = new Date(value);
  let dd = datetime.getDate();
  if(dd<10) 
  {
        dd='0'+dd;
  } 
  let mm = datetime.getMonth()+1; 
  if(mm<10) 
  {
        mm='0'+mm;
  } 
  const yyyy = datetime.getFullYear();

  let hh = datetime.getHours(); 
  if(hh<10) 
  {
        hh='0'+hh;
  } 
  let mn = datetime.getMinutes(); 
  if(mn<10) 
  {
        mn='0'+mn;
  } 
  let ss = datetime.getSeconds(); 
  if(ss<10) 
  {
        ss='0'+ss;
  }
  return dd+'-'+mm+'-'+yyyy+' '+hh+':'+mn+':'+ss;
}

