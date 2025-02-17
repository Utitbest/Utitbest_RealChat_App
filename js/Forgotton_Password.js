import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyB6tpiYpOYmh9z2LCzWClPhC4IJCWgBaMc",
    authDomain: "utitbest-realchat.firebaseapp.com",
    projectId: "utitbest-realchat",
    storageBucket: "utitbest-realchat.appspot.com",
    messagingSenderId: "904249328831",
    appId: "1:904249328831:web:d60acbc92f7db54f0bb20a"
};
function showToast(message, type = "success"){
    Toastify({
      text: message,
      duration: 4000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: type === "success" ? "green" : "red",
    }).showToast();
  }

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
var Button = document.querySelector('button')
const popss = document.getElementsByClassName('foree')[0]
// async function sendPasswordReset(email){

//     try {
//       Button.innerHTML =`<i class="fa fa-spinner fa-spin"></i>`
//         if (!email || typeof email !== 'string') {
//             showToast(`Invalid email address.`, 'error')
//             return
//         }
//         await sendPasswordResetEmail(auth, email);
//         popin()
//         showToast(`Password reset link sent to ${email}`)
//         Button.innerHTML =`Submit`
//     } catch (error) {
//         Button.innerHTML =`Submit`
//         showToast(`Error: ${error}`, 'error')
//     }
// }

function popin(){
    popss.style.display = 'flex'
    setTimeout(() => {
        popss.style.display = 'none';
    }, 5000);
}


Button.addEventListener('click', async () => {
    let Email = document.querySelector('.joy_is_coming').value.trim();
    if (!Email || typeof Email !== 'string') {
        showToast(`Invalid email address.`, 'error')
        return
    }
    Button.innerHTML =`<i class="fa fa-spinner fa-spin"></i>`

    try {
          await sendPasswordResetEmail(auth, Email);
          popin()
          showToast(`Password reset link sent to ${Email}`)
          Button.innerHTML =`Submit`
      } catch (error) {
          Button.innerHTML =`Submit`
          showToast(`Error: ${error}`, 'error')
      }
      Button.innerHTML =`Submit`
});


function Revealer(){
var Email = document.querySelector('#ww')
var entt = document.querySelector('.vibes1')
    Email.addEventListener('input', function(){
        entt.style.borderColor = 'gray';
    })
}

window.addEventListener('online', FreashIn)
window.addEventListener('offline', FreashOff)
function FreashIn(){
    let totori = document.createElement('div')
        totori.className = 'updater';
        let pink = document.createElement('p')
            pink.innerHTML = 'You\'re Back Online';
            totori.append(pink)


        document.body.append(totori)

        setTimeout(() =>{
            totori.remove()
        }, 6000)
}
function FreashOff(){
    let totori = document.createElement('div');
        totori.className = 'updater';
        let pink = document.createElement('p')
            pink.innerHTML = 'Your Internet connection is down';
            totori.append(pink)
        document.body.append(totori)
        setTimeout(() =>{
            totori.remove()
        }, 9000)
}   

Revealer()