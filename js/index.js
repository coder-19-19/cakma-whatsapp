window.onload = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBJFXkLkSeMrvV3KC_Ulsw0zz9plX19ATo",
    authDomain: "cakma-whatsapp.firebaseapp.com",
    projectId: "cakma-whatsapp",
    storageBucket: "cakma-whatsapp.appspot.com",
    messagingSenderId: "647824828329",
    appId: "1:647824828329:web:1096791dfed7c00df386b8"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth()
  const database = firebase.database()
  auth.onAuthStateChanged((user) => {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const infoRef = database.ref('users').child('info')
    const messageRef = database.ref('users').child('messages')
    if (user) {
      const userId = user.uid
      const notification = new Audio('../notification.mp3')
      //get current user info
      infoRef.child(userId).on('value', (snapshot) => {
        $('#currentUserProfile').attr('src', snapshot.val().photoUrl)
        $('.user-role').text(snapshot.val().email)
        $('#user-name').text(snapshot.val().username)
      })

      //get users info 
      const users = $('.sidebar-menu').children('.users-info')
      infoRef.on('value', (snapshot) => {
        writeUsers(snapshot)
      })
      const writeUsers = (snapshot) => {
        users.html('')
        let usersNum = 0
        snapshot.forEach(info => {
          usersNum++
          if (info.val().id !== userId) {
            users.append(`
                <li data-key="${info.val().id}" class="users-li">
                <img class="users-profile" src=${info.val().photoUrl} />
                ${info.val().username}
                </li>
              `)
            $('.usersTitle').text('İstifadəçilər(' + usersNum + ')')
          }
        })
      }

      //open chat
      $(document).on('click','.users-li', (e) => {
        $('html,body').animate({scrollTop: document.body.scrollHeight},"slow");
        let dataKey = $(e.target).attr('data-key')
        $('#sendBtn').attr('data-key',dataKey)
        const container = $('#messageContainer')
        const messageCol = $('#messageCol').children('.messageUl')
        messageRef.child(userId).child(dataKey).on('value', (messages) => {
          messageCol.html('')
          let html =""
          messages.forEach(message => {
            if(message.val().sender == userId){
              html = `<li class="messageLi send">
              ${message.val().message}
              <span class="time">
              ${message.val().time}
              </span>
              </li>`
              messageCol.append(html)
            }
            else{
              notification.play()
              html = `<li class="messageLi">
              ${message.val().message}
              <span class="time">
              ${message.val().time}
              </span>
              </li>`
              messageCol.append(html)
            }
            
          })
          
          container.css('display','block')
          
        })
        
      })
      //send message
      $('#sendBtn').click((e) => {
        let input = $('.messageInput')
        if(input.val()){
          messageRef.child(userId).child($(e.target).attr('data-key')).push({
            sender:userId,
            message:input.val(),
            time:hour + ':' + minute
          })
          messageRef.child($(e.target).attr('data-key')).child(userId).push({
            sender:userId,
            message:input.val(),
            time:hour + ':' + minute
          })
          input.val('')
        }
      })

      //upload img
      let file
      $('#upload-img').on('change', (e) => {
        file = e.target.files[0]
        firebase.storage().ref('users/' + userId + '/profile.jpg').put(file).then(() => {
          firebase.storage().ref('users/' + userId + '/profile.jpg').getDownloadURL().then((imgUrl) => {
            infoRef.child(userId).child('photoUrl').set(imgUrl)
            $('.profileIcon').attr('src', imgUrl)
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Profil şəkli uğurla dəyişdirildi',
              showConfirmButton: false,
              timer: 1500
            })
          }).catch((error) => {
            alert(error)
          })
        })
      })
      //search user
      $('#searchUser').on('change paste keyup', () => {
        if ($('#searchUser').val()) {
          infoRef.orderByChild('username').equalTo($('#searchUser').val()).once('value', (snapshot) => {
            writeUsers(snapshot)
          })
        }
        else {
          infoRef.once('value', (snapshot) => {
            writeUsers(snapshot)
          })
        }
      })
      
      //logout  
      $('#logOut').click(() => {
        auth.signOut().then(() => {
          window.location.href = 'login.html'
        })
      })
      jQuery(function ($) {

        $(".sidebar-dropdown > a").click(function () {
          $(".sidebar-submenu").slideUp(200);
          if (
            $(this)
              .parent()
              .hasClass("active")
          ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
              .parent()
              .removeClass("active");
          } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
              .next(".sidebar-submenu")
              .slideDown(200);
            $(this)
              .parent()
              .addClass("active");
          }
        });

        $("#close-sidebar").click(function () {
          $(".page-wrapper").removeClass("toggled");
        });
        $("#show-sidebar").click(function () {
          $(".page-wrapper").addClass("toggled");
        });




      });
      //endif
    }
    else {
      window.location.href = 'login.html'
    }
  })
}