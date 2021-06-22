function closeNotification(notificationDivId) {
  console.log('closeNotification', notificationDivId);
  // Get the snackbar DIV
  let notif = document.getElementById(notificationDivId);

  // hide  DIV
  if (notif) {
    //notif.className = "toast fade hide";
    notif.className = "toast fade";

    setTimeout(function () { notif.className = "toast fade hide"; }, 505);
  }
};

function showNotification(messageObject) {

  Promise.all([loadMstTemplate('/templates/notification_item.mst').then(x => x),])
    .then(templateStr => {
      //console.log('templateStr', templateStr);

      if (templateStr && messageObject) {
        //gen container for notifictions        
        const list = document.getElementById('toasts');
        if (list) {
          const notificationItem = { notification: messageObject };
          const renderedNotification = Mustache.render(templateStr[0], notificationItem);
          // create the snackbar DIV
          let newI = document.createElement('div');
          newI.className = 'toast';
          newI.id = 'toast' + messageObject.Id;

          newI.innerHTML = renderedNotification;
          list.insertBefore(newI, list.firstChild);

          // Add the "show" class to the created DIV
          //newI.className = "toast fade show";
          newI.className = "toast fade";

          setTimeout(function () { newI.className = "toast fade show"; }, 505);


          // After 7 seconds, remove the show class from DIV
          setTimeout(closeNotification, 7000, newI.id);
        }
      }
    })
    .catch(err => console.error(err));


};


function initNotificationSocket() {
  console.log("initNotif");
  const connection = new WebSocket('ws://localhost:3000');

  connection.addEventListener('open', () => console.log('Connected to ws server'));
  connection.addEventListener('error', () => console.error('ws error'));

  connection.addEventListener('message', (message) => {
    console.log('message', message.data)
    try {
      const messageObject = JSON.parse(message.data);
      /*    const p = document.createElement('P');
        p.innerText = messageObject.Text;
        document.getElementById('toasts').appendChild(p); */
      showNotification(messageObject);
    }catch (e) {
      console.log(e);
    }

  });

  connection.addEventListener('close', () => console.log('Disconnected from ws server'));
};

//show museums page when 
document.onload = initNotificationSocket();