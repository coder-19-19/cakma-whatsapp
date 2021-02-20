window.addEventListener('load', () => {

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
        if(!user){

            const name = document.querySelector('#name')
            const email = document.querySelector('#email')
            const password = document.querySelector('#password')
            const newpassword = document.querySelector('#newpassword')
            const registerBtn = document.querySelector('#registerBtn')

            const date = new Date()
            const minute = date.getMinutes()
            const hour = date.getHours()
            const day = date.getDate()
            const month = date.getMonth() + 1
            const year = date.getFullYear()

            const isEmail = (email) => {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
            }
            registerBtn.addEventListener('click',() => {
                if(!name.value){
                    Swal.fire({
                        icon: 'error',
                        title: 'Adınızı daxil edin!',
                    })
                }
                else if(!email.value){
                    Swal.fire({
                        icon: 'error',
                        title: 'Emailinizi daxil edin!',
                    })
                }
                else if(!isEmail(email.value)){
                    Swal.fire({
                        icon: 'error',
                        title: 'Email formatın düzgün daxil edin!',
                    })
                }
                else if(!password.value){
                    Swal.fire({
                        icon: 'error',
                        title: 'Şifrənizi daxil edin!',
                    })
                }
                else if(password.value.length < 6){
                    Swal.fire({
                        icon: 'error',
                        title: 'Şifrəniz ən az 6 simvoldan ibarət olmalıdır!',
                    })
                }
                else if(!newpassword.value){
                    Swal.fire({
                        icon: 'error',
                        title: 'Şifrənizi təkrarlayın!',
                    })
                }
                else if(newpassword.value != password.value){
                    Swal.fire({
                        icon: 'error',
                        title: 'Şifrələr uyğun gəlmir!',
                    })
                }
                else{
                    auth.createUserWithEmailAndPassword(email.value,password.value).then(() => {
                        database.ref().child('users').child('info').child(auth.currentUser.uid).set({
                            id:auth.currentUser.uid,
                            username:name.value,
                            email:email.value,
                            password:password.value,
                            time:hour + ':' + minute,
                            date:day + '/' + month + '/' + year ,
                            photoUrl: 'defaultProfileImage.png'
                        })
                        auth.signInWithEmailAndPassword(email.value,password.value).then(() => {
                            setTimeout(() => {
                                window.location.href = 'index.html'
                            },3000)
                            
                        })
                    }).catch((error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Bu email ilə artıq qeydiyyatdan keçilib!',
                        })
                    })
                }
              
            })
        }
        else{
            setTimeout(() => {
                window.location.href = 'index.html'
            },3000)
        }
      })
      


})

