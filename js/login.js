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

      const email = document.querySelector('#email')
      const password = document.querySelector('#password')
      const loginBtn = document.querySelector('#loginBtn')

      auth.onAuthStateChanged((user) => {
        if(!user){
          loginBtn.addEventListener('click', () => {
            auth.signInWithEmailAndPassword(email.value,password.value).then(() => {
              window.location.href = 'index.html'
            }).catch((error) => {
              Swal.fire({
                icon: 'error',
                title: 'Emailiniz və şifrəniz uyğunlaşmır!',
            })
            })
          })
        }
        else{
          window.location.href = 'index.html'
        }
      })

})

