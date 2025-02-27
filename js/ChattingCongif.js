import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import FirebaseService from './FireBaseConfig.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, setDoc, onSnapshot, where, serverTimestamp, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject, getMetadata,} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";




const firebaseConfig = {
    apiKey: "AIzaSyB6tpiYpOYmh9z2LCzWClPhC4IJCWgBaMc",
    authDomain: "utitbest-realchat.firebaseapp.com",
    projectId: "utitbest-realchat",
    storageBucket: "utitbest-realchat.appspot.com",
    messagingSenderId: "904249328831",
    appId: "1:904249328831:web:d60acbc92f7db54f0bb20a"
};





const firebaseService = new FirebaseService(firebaseConfig);

const firebaseApp = initializeApp(firebaseConfig);
const auth = firebaseService.auth;
const auth1 = getAuth(firebaseApp)
let currentUserId = null; 
let otherUserId = null
let chatId = null;
let FirstNameBoolen = false;
let LastNameBoolen = false;
let ActiveChat = null;
let isRecording = false;
let mediaRecorder = null;
let progressInterval, timeoutId;


let socket = new WebSocket('ws://localhost:8080');

var contentdrop2 = document.querySelector('.Bored2');
var settings = document.querySelectorAll('.listOfcontents')
var droplist = document.querySelector('.dropdown1')
const DetailsRemover = document.querySelector('.ToRemovethis')
var containerRpy = document.querySelector('.containerRpy')
var iconsdem = document.querySelectorAll('.iconsdem span');
var settingsPopup = document.querySelector('.settingsPopup')
var secondusers = document.querySelector('.secondusers')
var sendbutton = document.querySelector('.inputing div button')
var chatInputText = document.querySelector('#messageinput')
var chatlies1 = document.querySelector('.chatlies1')
var Chatterinfordisply = document.querySelector('.chattername h3')
const appender = document.querySelector('.theInputsEtc .inputing')
const userprofileId = document.querySelector('.signs');
const fileSelection = document.querySelector('.tochat')
let contentDropClickListener;
const currentimeofActive = document.querySelector('.chattername p')
let contentdrop1 = document.getElementById('Bored1');
const Toggle1 = document.getElementsByClassName('ToPopChampange')[0]
let XenderPlate = document.querySelector('.inputing .selmm')
let XenderParent = document.querySelector('.theInputsEtc .inputing')
let currentPlayingAudio = null

////////////////////////////////////////////////////////
// Element creation & Existence
let NewElement = document.createElement("div");/////////
    NewElement.className = "ForVoiceChat";////////////////

    let Secondnew = document.createElement("span");////////////////
    Secondnew.className = "Secondnew";//////////////////////

    let ThirdElement = document.createElement("span");////////////////////
    ThirdElement.className = "ThirdElement";///////////////////
////////////////////////////////////////////////////////////////////
let documentte = document.createElement('div');
    documentte.className = 'toPreviewImageMessage';

    let documetes = document.createElement('figure')
    documetes.className = 'toPreviewImageMessage1';
    
    let emmm = document.createElement('img')
        emmm.className = 'ingell'

    let remover = document.createElement('span')
        remover.innerHTML = `<i class="fa fa-arrow-left"></i>`;
        remover.className = 'thumbnails'

        remover.addEventListener('click', ()=>{
            documentte.style.display = 'none';
            emmm.src =  null;
        })

        documetes.appendChild(emmm);
        documentte.append(remover, documetes)
        document.body.appendChild(documentte)
////////////////////////////////////////////////////////
if (Notification.permission !== 'granted') {
    Notification.requestPermission();
}
//////////////////////////////////////////////////////////////////



function Settings() {  
    document.addEventListener("DOMContentLoaded", () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    currentUserId = user.uid;
                    const userData = await firebaseService.getUserData(currentUserId);

                    const initializeSettings = () => {
                        for (let i = 0; i < settings.length; i++) {
                            if (settings[i]) {
                                settings[i].addEventListener('click', function() {
                                    for (let j = 0; j < settings.length; j++) {
                                        if (settings[j]) {
                                            settings[j].classList.remove('collorback');
                                        }
                                    }

                                    this.classList.add('collorback');

                                    switch (i) {
                                        case 0:
                                            LoadUserInformation(userData)
                                            break;
                                        case 1:
                                            containerRpy.innerHTML = `
                                                <div class="Chat">
                                                    <h2>Chats</h2>
                                                    <button>Clear all messages</button>
                                                    <p>Delete all messages from chats</p>
                                                </div>
                                            `;
                                            break;
                                        case 2:
                                            containerRpy.innerHTML = `
                                                <div class="vid_voce">
                                                    <h2>Voice</h2>
                                                    <h5>Microphone</h5>
                                                    <div class="testingmicro">
                                                        <i class="fa fa-microphone"></i>
                                                        <h5>Device microphone</h5>
                                                    </div>
                                                    <div class="testingmicro1">
                                                        <h5>Speak into your device mic</h5>
                                                        <div class="">
                                                            <i class="fa fa-microphone"></i>
                                                            <progress max="100" min="0" value=""></progress>
                                                        </div>
                                                    </div>
                                                    <div class="speakers">
                                                        <h5>Speakers</h5>
                                                        <div class="Xbass">
                                                            <i class="fa fa-volume-up"></i>
                                                            <h5 style="padding-left:0;">Device speakers</h5>
                                                        </div>
                                                        <button class="">Click to test speak..</button>
                                                    </div>
                                                </div>
                                            `;
                                            break;
                                        case 3:
                                            containerRpy.innerHTML = `
                                                <div class="Customize">
                                                    <p class="fa-shake">&#128540;</p>
                                                    <h2 class="fa-bounce">COMING SOON!!</h2>
                                                </div>
                                            `;
                                            break;
                                    }
                                });
                            }
                        }
                    };
                    const LoadUserInformation = (userData) =>{
                        containerRpy.innerHTML = `
                        <div class="Profile_i">
                            <h2>Profile</h2>
                            <div style="display:flex; width: 90%; align-items:end;">
                                <label for="eel" style="margin-left: .5em; position: relative;" title="Change profile picture">
                                    <img src="" alt="">
                                    <i class="fa fa-edit rr"></i>
                                    <span class="spnman" style="position:absolute; align-items:center; justify-content:center; height:30px; width:30px; border-radius:50%; background:#3f6bde;">
                                        <i class="fa fa-spinner fa-spin"style="color:white;"></i>
                                    </span>
                                </label>
                                <button class="uploadalbum" style=" cursor:pointer; font-weight:600; display:flex; padding:.6em; height:15px; border:none; background:#3f6bde; color:white; border-radius:7px; align-items:center; justify-content:center;">Save</button>
                               <input type="file" accept="image/*" id="eel" class="nothings">
                            </div> 
                            <div class="namecoms">
                                <div class="informs" title="${userData.firstname}">
                                    <p>${userData.firstname}</p>
                                    <span class="EditName">
                                        <i class="fa fa-edit" style="z-index:-100;"></i>
                                    </span>
                                </div>
                                <div style="margin-top:.6em;" class="informs" title="${userData.lastname}">
                                    <p>${userData.lastname}</p>
                                    <span class="EditName">
                                        <i class="fa fa-edit" style="z-index:-100;"></i>
                                    </span>
                                </div>
                                <div style="margin-top:.6em;" class="informs" title="${userData.email}">
                                    <p>${userData.email}</p>
                                    <span class="EditName" style="visibility:hidden;">
                                        <i class="fa fa-edit"></i>
                                    </span>
                                </div>
                                <button style="margin-top:3.8em;" type="button">Log out</button>
                            </div>
                        </div>`;
                        UpdatingName(currentUserId);
                        Tologout();
                        updateprofilepic();
                    }

                    initializeSettings();
                    LoadUserInformation(userData)
                    settings[0].classList.add('collorback');

                } catch (error) {
                    console.error("Error retrieving user data:", error);
                }
            } else {
                window.location.href = './index.html';
            }
        });
    });
}

Settings(); 


onAuthStateChanged(auth, (user) => {
    if (user) {
      firebaseService.listenForMessages11();
      firebaseService.listenForAllChats()
    } else {
      updateUserStatus(false)
      console.error("No user is logged in. Redirecting to login...");
      window.location.href = './indexLogin.html';
    }
});

async function updateUserStatus(isOnline) {
    const user = auth.currentUser;
    if (!user) return;  
    const userStatusRef = doc(firebaseService.db, `status/${user.uid}`);

    await setDoc(userStatusRef, {
        state: isOnline ? 'online' : 'offline',
        email: user.email, 
        last_changed: serverTimestamp()
    }, { merge: true });

}


socket.onopen = async () => {
    updateUserStatus(true)
};

function displayUserStatus(otherUserId, userTagElement) {
    const otherUserStatusRef = doc(firebaseService.db, `status/${otherUserId}`);
    const onlineDetectorElement = userTagElement.querySelector('.active_detect');

    onSnapshot(otherUserStatusRef, (snapshot) => {
        if (!snapshot.exists()) return;

        const status = snapshot.data();
        if (status?.state === 'online') {
            onlineDetectorElement.style.backgroundColor = '#1ca182';
            onlineDetectorElement.title = 'Online';
        } else {
            onlineDetectorElement.style.backgroundColor = '';
            onlineDetectorElement.title = 'Offline'
        }
    });
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserStatus(true); 
        window.addEventListener('beforeunload', () =>{
            updateUserStatus(false)
            socket.onclose = async () => {
                updateUserStatus(false)
             };
        } );
        window.addEventListener('online', () => updateUserStatus(true));
        window.addEventListener('offline', () => updateUserStatus(false));
    }
});


async function UpdatingName(userId) {
    let EditNameButton = document.querySelectorAll('.informs span')
    let NameTag = document.querySelectorAll('.informs p')
    function UpdatingFirstName(){
        EditNameButton[0].addEventListener('click', async (event)=>{
            event.stopPropagation()
            FirstNameBoolen ? update() : Clicking()
            
        })

        function Clicking(){
            EditNameButton[0].innerHTML = '<i class="fa fa-check" style="z-index:-100;"></i>'
            FirstNameBoolen = true;
            NameTag[0].setAttribute('contenteditable', true)
            NameTag[0].style.borderColor = 'gray'
            NameTag[0].style.outline = 'none';
            NameTag[0].focus();
            NameTag[0].style.textOverflow = 'clip';
        }
        async function update(){

            if(NameTag[0].innerHTML == ''){
                firebaseService.showToast("Invalid input. Please provide valid details.", "error");
                return;
            }

            if(NameTag[0].innerHTML.search(/[^a-z]/i) !== -1){
                firebaseService.showToast(`Fill the input & No special character allowed`, 'error')
                return;
            }
            await firebaseService.UpdateFirstName(userId, NameTag[0].innerHTML)
            FirstNameBoolen = false;
            NameTag[0].style.textOverflow = 'ellipsis';
            EditNameButton[0].innerHTML = '<i class="fa fa-edit" style="z-index:-100;"></i>';
            NameTag[0].setAttribute('contenteditable', false)
            // setInterval(() => {
            //     location.reload()
            // }, 3000);
            // firebaseService.showToast("First name updated successfully");

        }
    }


    function UpdatingLastName(){
        EditNameButton[1].addEventListener('click', async (event)=>{
            event.stopPropagation()
            LastNameBoolen ? update1() : Clicking1()
        })

        function Clicking1(){
            EditNameButton[1].innerHTML = '<i class="fa fa-check" style="z-index:-100;"></i>'
            LastNameBoolen = true;
            NameTag[1].setAttribute('contenteditable', true)
            NameTag[1].style.borderColor = 'gray'
            NameTag[1].style.outline = 'none';
            NameTag[1].focus();
            NameTag[1].style.textOverflow = 'clip';
        }

        async function update1(){
            if(NameTag[1].innerHTML == ''){
                firebaseService.showToast("Invalid input. Please provide valid details.", "error");
                return;
            }

            if(NameTag[1].innerHTML.search(/[^a-z]/i) !== -1){
                firebaseService.showToast(`Fill the input & No special character allowed`, 'error')
                return;
            }
            await firebaseService.UpdateLastName(userId, NameTag[1].innerHTML)
            LastNameBoolen = false
            NameTag[1].style.textOverflow = 'ellipsis';
            EditNameButton[1].innerHTML = '<i class="fa fa-edit" style="z-index:-100;"></i>';
            NameTag[1].setAttribute('contenteditable', false)
            // setInterval(() => {
            //     location.reload()
            // }, 3000);
            // firebaseService.showToast("First name updated successfully");
        }
    }
    UpdatingFirstName()
    UpdatingLastName()
}
async function loadAllUsers() {
    try{

        secondusers.innerHTML = `
            <div class="loading-spinner" style="display: flex; align-items: center; justify-content: center; height: 100%;">
                <i class="fa fa-spinner fa-spin" style="font-size: 24px; color: #3f6bde;"></i>
            </div>
        `;
        const users = await firebaseService.getAllUsers();
        
        secondusers.innerHTML = '';

        if(users.length === 0){
            secondusers.innerHTML = `<p class="fa-fade" style="display:flex; align-items: center; justify-content: center; margin:auto; font-weight:700; font-size:18px; color:black; width:100%; white-space: nowrap; overflow:hidden; text-overflow: ellipsis; height:100%;">No other users found</p>`;
            return
        }
        
        users.forEach((user)  => {
                if (user.id === currentUserId){return}

                const userElement = document.createElement("div");
                userElement.className = 'individualchat';
                userElement.setAttribute('data-user-id', user.id)
                userElement.innerHTML = `
                    <div style="display: flex; width: 100%; height: 100%; align-items: center;">
                        <div style="display: flex; align-items: center; justify-content: center; width: 20%; height: 100%; position: relative;" class="allactaive">
                        <span class="active_detect" style="position: absolute; top:11px; left:5px; border-radius:50%; width:7px; height:7px;"></span>
                            <figure>
                               <img src="" alt="" class="converse">
                               <utit class="spnman11" style="position :absolute; align-items:center; justify-content:center; height:40px; width:40px; border-radius:50%;  background:#3f6bde;">
                                    <i class="fa fa-spinner fa-spin"style="color:white;"></i>
                                </utit>
                            </figure>
                        </div>
                        <div style="display: flex; align-items: center; width: 80%; height: 100%;">
                            <div class="username_chat">
                                <h3>${user.firstname + ' '+ user.lastname}</h3>
                                <p></p>
                            </div>
                            <div class="times">
                                <saviour class="mansnd">
                                    <p></p>
                                </saviour>
                                <span>
                                    <span class="whatsappna"></span>
                                </span>
                            </div>
                        </div>
                    </div>
                `;
                setUserProfilePicture(user.id, userElement)
                
                displayUserStatus(user.id, userElement)
                
                const repumm = document.querySelector('.currentchatterinfor figure img')
                const figureMan = document.querySelector('.currentchatterinfor figure');

                userElement.addEventListener('click', async () => {
            
                    document.querySelectorAll('.ForVoiceChat').forEach(NewElement => NewElement.remove())
                    if (isRecording && mediaRecorder && mediaRecorder.state !== "inactive"){
                        mediaRecorder.stream.getTracks().forEach(track => track.stop());
                        contentdrop2.style.visibility = 'visible'
                    }
                    clearInterval(progressInterval);
                    clearTimeout(timeoutId);
                    XenderPlate.style.display = "flex";
                    ThirdElement.style.width = "0%";
                    isRecording = false;
                    contentdrop1.removeEventListener('click', contentDropClickListener)
                    contentdrop1.innerHTML = `<i class="fa fa-microphone"></i>`
                    figureMan.setAttribute('RAdata-set-aria', user.id)

                    document.querySelectorAll('.individualchat').forEach(el => {
                        el.classList.remove('usertagColor');
                    });
                    userElement.classList.add('usertagColor');

                    if(userprofileId.classList.contains('dwells')){
                        userprofileId.classList.remove('dwells');
                        userprofileId.classList.add('naturea')
                    }
                    
                    otherUserId = user.id;
                    const storageRef = ref(firebaseService.storage, `profilePictures/${otherUserId}.jpg`);
                    const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.png`); 
                    let profilePicUrl = null
                    try {
                        profilePicUrl = await getDownloadURL(storageRef);
                        repumm.src = profilePicUrl; 
                    } catch (error) {
                        if (error.code === 'storage/object-not-found') {
                        const defaultPicUrl = await getDownloadURL(defaultRef);
                        repumm.src = defaultPicUrl;
                        } else {
                            repumm.src = `./Super icons/defualtman.png`
                            console.error('Error fetching profile picture:', error.message);
                        }
                    }

                    chatId = [currentUserId, otherUserId].sort().join('_'); 
                    Chatterinfordisply.innerHTML = user.firstname+ ' ' + user.lastname;
                    initializeChat(chatId, userElement);
                    sendingFilesAsSMS(chatId, currentUserId, otherUserId)
                    VoiceNoteMessage(currentUserId, userElement)
                    FunctionForDifferentViewPort()
                    
                });
               

                secondusers.appendChild(userElement);
            
        });
    } catch (error) {
        console.error("Error loading users:", error);
        firebaseService.showToast(`Error loading users: ${error.message}`, 'error');
    }
}

async function setUserProfilePicture(userId, userElement) {
    const storageRef = ref(firebaseService.storage, `profilePictures/${userId}.jpg`);
    const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.png`);
    const profileImg = userElement.querySelector('.converse');
    const spinner = userElement.querySelector('.spnman11');
    spinner.style.display = 'flex';

    try {
        const profilePicUrl = await getDownloadURL(storageRef);
        profileImg.src = profilePicUrl; 
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
            const defaultPicUrl = await getDownloadURL(defaultRef);
            profileImg.src = defaultPicUrl; 
        } else {
            console.error('Error fetching profile picture:', error.message);
        }
    } finally {
        spinner.style.display = 'none'; 
    }
    
}

async function updateprofilepic(){
    onAuthStateChanged(auth, async (user) =>{
    if(user){
    const userId = user.uid 
    const ssiiee = document.querySelector('.Profile_i label img')
    const inputtag = document.querySelector('.nothings')
    const Savebutton = document.querySelector('.uploadalbum')
    const spinners = document.querySelector('.spnman');
    const userpicture = document.querySelector('.iconsdem figure img')

    let selectedPic = null;
    let profilePicUrl = null;
    ssiiee.style.display = 'none'
    spinners.style.display = 'flex';
    const storageRef = ref(firebaseService.storage, `profilePictures/${userId}.jpg`);
    const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.png`);

    try {
        profilePicUrl = await getDownloadURL(storageRef);
        ssiiee.src = profilePicUrl; // Set user's profile picture
        userpicture.src = profilePicUrl
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
        const defaultPicUrl = await getDownloadURL(defaultRef);
        ssiiee.src = defaultPicUrl;
        userpicture.src = defaultPicUrl
        } else {
            ssiiee.src = `./Super icons/defualtman.png`
            userpicture.src = `./Super icons/defualtman.png`
            console.error('Error fetching profile picture:', error.message);
        }
    }finally{
        spinners.style.display = 'none'
        ssiiee.style.display = 'flex';
    }


    inputtag.addEventListener('change',  (event) =>{
            const file = event.target.files[0];
            if(!file){
                firebaseService.showToast('Please select a file to upload.', 'error')
                // ssiiee.src = profilePicUrl
                selectedPic = null;
                return
            }
            const vaildfilesize = 3 * 1024 * 1024;
            if(file.size > vaildfilesize){
                firebaseService.showToast('File size is greater than 3mb.', 'error')
                selectedPic = null
                return;
            }
            

            const fileURL = URL.createObjectURL(file);
            ssiiee.src = fileURL;
            userpicture.src = fileURL
            selectedPic = file; 

            // firebaseService.showToast(`Image uploaded successfully`)
            // console.log(selectedPic)

        })

        
            Savebutton.addEventListener('click', async ()=>{
                if (!selectedPic) {
                    firebaseService.showToast('No file selected for upload.', 'error');
                    return;
                }
                    spinners.style.display = 'flex';
                try {
                      try {
                        const metadata = await getMetadata(storageRef);
                        await deleteObject(storageRef);
                        firebaseService.showToast('Previous profile picture deleted successfully.', 'success');

                    } catch (error) {
                        if (error.code === 'storage/object-not-found') {
                            console.log('No previous image found. Proceeding with upload.');
                        } else {
                            ssiiee.src = `./Super icons/defualtman.png`;
                            userpicture.src = `./Super icons/defualtman.png`;
                            spinners.style.display = 'none';
                            throw error; 
                        }
                    }
                    // const ddde = URL.createObjectURL(File)
                    await uploadBytes(storageRef, selectedPic);
                    const userDocRef = doc(firebaseService.db, 'users', userId);
                    await setDoc(userDocRef, {
                        profilePicture: profilePicUrl,
                        ProfilepictureupdateAt: serverTimestamp()
                    }, { merge: true });

                    firebaseService.showToast('Profile picture uploaded successfully!', 'success');
                    URL.revokeObjectURL(ssiiee.src, userpicture.src)
                    selectedPic = null; 
                } catch (error) {
                    spinners.style.display = 'none';
                    console.error('Error:', error.message);
                    firebaseService.showToast(error.message, 'error');
                    ssiiee.src = defaultRef; 
                    userpicture.src = defaultRef;
                }finally{
                    spinners.style.display = 'none';
                }
            })
        }
    })  
}

async function profileDisplayer() {
    onAuthStateChanged(auth, async (user) =>{
        if(user.uid ){
            const picm = document.querySelector('.iconsdem figure img')
            const storageRef = ref(firebaseService.storage, `profilePictures/${user.uid}.jpg`);
            const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.png`);
            const spinner = document.querySelector('.spnman1')
            spinner.style.display = 'flex';
            picm.style.display = 'none';
            try {
                const dowm = await getDownloadURL(storageRef)
                picm.src = dowm;
            } catch (error) {
                  if (error.code === 'storage/object-not-found'){
                    const ty = await getDownloadURL(defaultRef)
                    picm.src = ty
                  }else{
                    picm.src = `./Super icons/defualtman.png`;
                    console.error('Error fetching profile picture:', error.message);
                  }
            }finally{
                spinner.style.display = 'none';
                picm.style.display = 'flex';
            }
        }
            ToViewUserspictureInMax(user.uid)
    })
}
await profileDisplayer()

async function initializeChat(chatId, userElement) {
    try {
        if (ActiveChat === chatId) {
            return;
        }

        ActiveChat = chatId;
        chatlies1.innerHTML = "";

        firebaseService.listenForMessages(chatId, (messages) => {
            if (chatId !== ActiveChat) return;


            chatlies1.innerHTML = ""; 
            if(messages.length > 0){
                const lastmessage = messages[messages.length -1]
                const LastmessageTime = getRelativeTime(lastmessage.timestamp.seconds)
                if(userElement){
                    const TimeElement = userElement.querySelector('.times p')
                    if(TimeElement){
                        TimeElement.textContent = LastmessageTime
                    }
                }
            }

            messages.forEach((message) => {

                const messageElement = document.createElement("div");
                const messageElement1 = document.createElement("div");
                const messageElement2 = document.createElement("div");
                const user_response = message.senderId === currentUserId;

               
                if (user_response) {
                    messageElement.className = 'user_response';
                    messageElement1.className = 'flowsa';
                    messageElement2.className = 'flowsa0';
                } else {
                    messageElement.className = 'replyer';
                    messageElement1.className = 'flowsa';
                    messageElement2.className = 'flowsa1';
                }

                if (typeof message.content === 'string'){
                    messageElement2.innerHTML = `
                        <p>${message.content}</p>
                        <h6>${getRelativeTime(message.timestamp.seconds)}</h6>
                    `;
                } else if (message.content?.type === 'image') {
                    const towrapImage = document.createElement('div')
                    towrapImage.className = 'towrapImage'
                    const forimage = document.createElement('img');
                    forimage.setAttribute('alt', `${message.content.name}`)
                    forimage.className = 'imageForMessage';
                    forimage.src = message.content.url;
                    forimage.style.width = '100%';
                    forimage.style.height = '100%';
                    forimage.style.borderRadius = '1em';
                    forimage.style.cursor = 'pointer'
                    towrapImage.appendChild(forimage)
                    const follwed = document.createElement('utitno')
                    follwed.innerText = message.content.name;
                    follwed.style.paddingTop = '.3em';
                    follwed.style.paddingBottom = '.3em';

                    const ftime = document.createElement('h6')
                    ftime.innerText = getRelativeTime(message.timestamp.seconds)

                    messageElement2.append(towrapImage, follwed, ftime)

                    forimage.addEventListener('click', ()=>{
                        documentte.style.display = 'flex';
                        emmm.src = message.content.url;
                    })
                   
                } else if (message.content?.type === 'video') {
                    
                    const videoMessageTag = document.createElement('div')
                        videoMessageTag.className = 'videoMessageTag';
                    const videoman = document.createElement('span')
                        videoman.className = 'videoman';
                        videoman.innerHTML = `<i class="fa fa-play"></i>`
                    const videoplayer = document.createElement('video');
                            videoplayer.className = 'videoplayer';
                            videoplayer.src = message.content.url;
                    const videoName = document.createElement('utitno')
                            videoName.innerHTML = message.content.name;
                    const videotimecount = document.createElement('utitbest');
                            videotimecount.className = "Videotimer_com"
                            videotimecount.innerText = '00:00'
                            videotimecount.style.position = 'absolute';
                            videotimecount.style.bottom = '5%';
                            videotimecount.style.right = '5%';
                            videotimecount.style.display = 'flex';
                            videotimecount.style.color = 'white';
                    const messageTimetag = document.createElement('h6')
                    messageTimetag.style.height = '2%'
                            messageTimetag.innerText = getRelativeTime(message.timestamp.seconds)
                            videoMessageTag.append(videoman, videoplayer, videoName, videotimecount)
                            messageElement2.append(videoMessageTag, messageTimetag)

                    
                        let videoIsplaying = false;
                        let videotime = 0;
                        let totaltime = null

                        videoplayer.addEventListener('loadedmetadata', ()=>{
                            videotime = videoplayer.duration;
                            totaltime = GetrelativeTime(videotime)
                            videotimecount.innerText = totaltime;
                        })
                        
                        videoplayer.addEventListener('timeupdate', ()=>{
                            const riseandfall = videoplayer.currentTime;
                            const about = videotime - riseandfall;
                            videotimecount.innerText = GetrelativeTime(about);
                        })

                        videoplayer.addEventListener('mouseover', function(){
                            videoman.style.display = 'flex';
                            videotimecount.style.display = 'flex'
                        })

                        videoplayer.addEventListener('mouseout', function(){
                            videoman.style.display = 'none';
                            videotimecount.style.display = 'none'
                        })

                        videoplayer.addEventListener('click', () =>{
                            if(!videoIsplaying){
                                videoplayer.play()
                            }else{
                                videoplayer.pause()
                            }
                        })

                        videoplayer.addEventListener('dblclick', ()=>{
                            if(document.fullscreenElement){
                                document.exitFullscreen()
                            }else{
                                videoplayer.requestFullscreen()
                            }
                        })
                        
                        videoplayer.addEventListener('play', () =>{
                            if (currentPlayingAudio && currentPlayingAudio !== videoplayer) {
                                currentPlayingAudio.pause();
                            }
                            currentPlayingAudio = videoplayer;
                            videoIsplaying = true;
                            videoman.innerHTML = `<i class="fa fa-pause"></i>`;
                        })
                        videoplayer.addEventListener('pause', () =>{
                            videoIsplaying = false;
                            videoman.innerHTML = `<i class="fa fa-play"></i>`;
                        })

                        videoplayer.addEventListener('ended', () =>{
                            videoIsplaying = false;
                            videoman.innerHTML = `<i class="fa fa-play"></i>`;
                            videotimecount.innerText = totaltime;
                            currentPlayingAudio = null
                        })

                        function GetrelativeTime(duration){
                            let seconds = Math.floor(duration % 60);
                            let mintie = Math.floor(duration / 60);
                            const saple = seconds < 10 ? `0${seconds}` : seconds;
                            return mintie + ':'+ saple;
                        }

                    } else if (message.content?.type === 'audio') {

                        const audiomessageTag = document.createElement('div')
                                audiomessageTag.className = 'audiomessageTag';

                        const playButton = document.createElement('span')
                                playButton.className = 'playButton';
                        const invie = document.createElement('span')
                                invie.className = 'invie'
                                invie.innerHTML = '<i class="fa fa-play"></i>';
                        playButton.appendChild(invie)

                        const rangewrap = document.createElement('div')
                                rangewrap.className = 'rangewrap';
                        const ProgressContain = document.createElement('div')
                                ProgressContain.className = 'ProgressContain';
                        const mainprogress = document.createElement('span')
                                ProgressContain.append(mainprogress)
                            rangewrap.appendChild(ProgressContain)
                        
                        const timeNull = document.createElement('span')
                            timeNull.className = 'timeNull';
                            timeNull.innerHTML = '00:00'
                            audiomessageTag.append(playButton, rangewrap, timeNull)
                        const albumname = document.createElement('utitno')
                                albumname.className = 'albumname'
                        const timescrap = document.createElement('h6')
                                timescrap.style.alignItems = 'unset'
                                timescrap.innerHTML = getRelativeTime(message.timestamp.seconds)
                            messageElement2.append(audiomessageTag, albumname, timescrap)

                            const audio = document.createElement('audio')
                            audio.setAttribute("type", "audio/mp3");
                            audio.src = message.content.url
                            audio.preload = "auto";
                            let Isplaying = false;
                            let initializatDurateion = 0
                            let Fortmated = null
                            albumname.innerText = message.content.name

                            invie.addEventListener('click', function(){
                               
                                if (!Isplaying) {
                                    audio.play(); 
                                  } else {
                                    audio.pause(); 
                                  }
                                
                            })

                            audio.addEventListener('play', () => {
                                if (currentPlayingAudio && currentPlayingAudio !== audio) {
                                  currentPlayingAudio.pause();
                                }
                                currentPlayingAudio = audio;
                                Isplaying = true;
                                 invie.innerHTML = '<i class="fas fa-pause"></i>'; 
                            });
                      
                              audio.addEventListener('pause', () => {
                                Isplaying = false;
                                invie.innerHTML = '<i class="fas fa-play"></i>'; 
                              });

                            audio.addEventListener('loadedmetadata', ()=>{
                                initializatDurateion = audio.duration;
                                if (!isFinite(initializatDurateion)) {  
                                    Fortmated = ''; // or "0" if you prefer
                                } else {
                                    Fortmated = formatingTime(initializatDurateion);
                                }
                                timeNull.innerText = Fortmated;
                            })

                            function formatingTime(duration){
                                let seconds = Math.floor(duration % 60);
                                let minutes = Math.floor(duration / 60);
                                const fromatedsecon = seconds < 10 ? `0${seconds}` : seconds;
                                return minutes +':'+fromatedsecon;
                            }
                            audio.addEventListener('timeupdate', ()=>{

                                if (!isFinite(initializatDurateion)) {
                                    timeNull.innerText = '';
                                    return;  
                                }
                                const currentman = audio.currentTime;
                                const remainingTime = initializatDurateion - currentman;
                                timeNull.innerText = formatingTime(remainingTime)
                                const AudioProgress = (audio.currentTime / audio.duration) * 100;
                                mainprogress.style.width = `${AudioProgress}%`;
                            
                            })  
                            audio.addEventListener('ended', ()=>{
                                Isplaying = false;
                                invie.innerHTML = '<i class="fas fa-play"></i>';
                                timeNull.innerText = Fortmated;
                                mainprogress.style.width = `0%`;
                                currentPlayingAudio = null
                            })
                } else {
                    messageElement2.innerHTML = `
                        <a href="${message.content.url}" target="_blank">${message.content.name}</a>
                        <h6>${getRelativeTime(message.timestamp.seconds)}</h6>
                    `;
                }

                messageElement.addEventListener("contextmenu", async (event) => {
                    event.preventDefault(); 

                    const messageElement = event.target.closest(".user_response");
                    if(messageElement){
                    const forthePag = messageElement.querySelector('.user_response p')
                    // if (!messageElement) return;
                    if(forthePag){
                        if (forthePag.innerText === 'Message Deleted'){
                        return
                    };
                    }
                    
                    
                    const existingPopup = document.getElementById("confirm-popup");
                    if (existingPopup) {
                        messageElement.style.backgroundColor = ''
                        existingPopup.remove();
                    }
                    
                    messageElement.style.backgroundColor = '#fff'
                    const popup = document.createElement("div");
                    popup.id = "confirm-popup";
                    popup.style.position = "absolute";
                    popup.style.width = "180px";
                    popup.style.padding = "10px";
                    popup.style.background = "#fff";
                    popup.style.boxShadow = "0px 4px 6px rgba(0,0,0,0.2)";
                    popup.style.borderRadius = "8px";
                    popup.style.display = "flex";
                    popup.style.flexDirection = "column";
                    popup.style.alignItems = "center";
                    popup.style.gap = "5px";
                    popup.style.zIndex = "1000";
                
                    
                    const chatRect = chatlies1.getBoundingClientRect();
                    const popupWidth = 150;
                    const popupHeight = 80; 
                
                    let posX = event.pageX;
                    let posY = event.pageY;
                    
                    if (posX + popupWidth > chatRect.right) {
                        posX -= popupWidth + 10; 
                    }
                    
                    if (posY + popupHeight > chatRect.bottom) {
                        posY -= popupHeight + 10; 
                    }
                    
                    if (posY < chatRect.top) {
                        posY = chatRect.top + 10;
                    }
                
                    if (posX < chatRect.left) {
                        posX = chatRect.left + 10;
                    }
                
                    popup.style.left = `${posX}px`;
                    popup.style.top = `${posY}px`;
                    
                    const messageText = document.createElement("p");
                    messageText.textContent = "Delete this message?";
                    messageText.style.fontSize = "12px";
                    messageText.style.marginBottom = "5px";

                    const newparentcontain = document.createElement('div')
                    newparentcontain.style.width = '100%'
                    newparentcontain.style.display = 'flex'
                    newparentcontain.style.justifyContent = 'space-evenly'

                    const confirmBtn = document.createElement("button");
                    confirmBtn.textContent = "Confirm";
                    confirmBtn.style.background = "red";
                    confirmBtn.style.color = "#fff";
                    confirmBtn.style.border = "none";
                    confirmBtn.style.padding = "5px 10px";
                    confirmBtn.style.cursor = "pointer";
                    confirmBtn.style.borderRadius = "5px";
                
                    const cancelBtn = document.createElement("button");
                    cancelBtn.textContent = "Cancel";
                    cancelBtn.style.background = "#ccc";
                    cancelBtn.style.color = "#000";
                    cancelBtn.style.border = "none";
                    cancelBtn.style.padding = "5px 10px";
                    cancelBtn.style.cursor = "pointer";
                    cancelBtn.style.borderRadius = "5px";
                
                    popup.appendChild(messageText);
                    
                    newparentcontain.appendChild(confirmBtn)
                    newparentcontain.appendChild(cancelBtn)
                    popup.appendChild(newparentcontain)
                    document.body.appendChild(popup);
                
                    confirmBtn.addEventListener("click", () => {
                        firebaseService.deleteMessage(chatId, message);
                        popup.remove();
                        messageElement.style.backgroundColor = ''
                    });
                
                    cancelBtn.addEventListener("click", () => {
                        popup.remove();
                        messageElement.style.backgroundColor = ''
                    });
                
                    document.addEventListener("click", function removePopup(event) {
                        if (!popup.contains(event.target)) {
                            popup.remove();
                            messageElement.style.backgroundColor = ''
                            document.removeEventListener("click", removePopup);
                        }
                    }, { once: true });
                }
                });

                messageElement1.append(messageElement2);
                messageElement.append(messageElement1);
                chatlies1.append(messageElement);

            });
            
            chatlies1.scrollTop = chatlies1.scrollHeight;
        });
    } catch (error) {
        console.error("Error initializing chat:", error);
    }
}

function getRelativeTime(timestamp) {
    const currentTime = new Date();
    const messageTime = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const timeDiff = currentTime - messageTime; // Difference in milliseconds

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) {
        return days === 1 ? 'Yesterday' : `${days} days ago`;
    }
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `Just now`; 
}
sendbutton.addEventListener("click", async function (){
        const messageContent = chatInputText.value.trim();
        if (messageContent){
            chatInputText.value = "";
            try {
                await firebaseService.sendMessage(
                    chatId,
                    currentUserId, 
                    otherUserId,            
                    messageContent 
                );
                chatInputText.value = ""; 
            } catch (error) {
                console.error("Error sending message:", error);
            }
            chatInputText.value = "";
        }
});
window.addEventListener('keyup', (event) =>{
    if(event.keyCode == 13){
        sendbutton.click();
    }
})
async function sendingFilesAsSMS(chatId, senderId, recipientId){
    const vaildfilesize = 10 * 1024 * 1024;
    
    fileSelection.addEventListener('change', function(event){
    contentdrop1.style.visibility = 'hidden'
    document.querySelectorAll('.preview').forEach(preview => preview.remove());
    chatInputText.value = '';
    chatInputText.setAttribute('disabled', '')
    chatInputText.style.cursor = 'not-allowed'

    let selecion = event.target.files[0];
    const fileType = selecion.type.split('/')[0];
    let PreviewAll = document.createElement('div')
        PreviewAll.className = 'preview';
    
    let exitIt = document.createElement('span')
        exitIt.className = 'exiting'
        exitIt.innerHTML = `
            <i class="fa fa-xmark"></i>
        `
        exitIt.addEventListener('click', ()=>{
            document.querySelectorAll('.preview').forEach(preview => preview.remove());
            fileSelection.value = '';
            chatInputText.style.cursor = ''
            chatInputText.removeAttribute('disabled')
            sendbutton.removeAttribute('disabled')
            contentdrop1.style.visibility = 'visible'
            sendbutton.innerHTML = `
                <i class="fa fa-paper-plane res"></i>
            `
            selecion = null
        })
    let tweek = document.createElement('div')
        tweek.className = 'tweek';
    let animationprogress = document.createElement('div')
        animationprogress.className = 'animationprogress';
    let pls = document.createElement('p')
        pls.style.fontSize = '.7em'
        pls.style.fontWeight = '500'
        pls.innerHTML = 'Uploading Please wait...';
    
    let newsendbuds = document.createElement('button')
        newsendbuds.className = 'newsendbuds';
        newsendbuds.innerHTML = 'Send';


    if(!selecion){
        firebaseService.showToast('Please select file.', 'error')
        selecion = null
        fileSelection.value = ''
        document.querySelectorAll('.preview').forEach(preview => preview.remove());
        chatInputText.style.cursor = ''
        chatInputText.removeAttribute('disabled')
        contentdrop1.style.visibility = 'visible'
        sendbutton.removeAttribute('disabled')
        sendbutton.innerHTML = `
            <i class="fa fa-paper-plane res"></i>
        `
        return
    }
    if(selecion.size > vaildfilesize){
        firebaseService.showToast('File size is greater than 10mb', 'error')
        selecion = null
        fileSelection.value = ''
        document.querySelectorAll('.preview').forEach(preview => preview.remove());
        chatInputText.style.cursor = ''
        chatInputText.removeAttribute('disabled')
        contentdrop1.style.visibility = 'visible'
        sendbutton.removeAttribute('disabled')
        sendbutton.innerHTML = `
            <i class="fa fa-paper-plane res"></i>
        `
        return
    }
    
    if(fileType === 'image'){
        const reader = new FileReader()
            reader.onload = function(e){
                
                tweek.innerHTML = `
                    <div style="width:100%; height:300px; display:flex;">
                        <img src="${e.target.result}" alt="Image preview" style="width:95%; height:95%; object-fit:contain;">
                    </div>
                    <p class="somep">${selecion.name}</p>
                `
            }
            reader.readAsDataURL(selecion)
    }else if(fileType === 'audio'){
        const reader = new FileReader()
            reader.onload = function(e){
                tweek.innerHTML = `
                    <audio src="${e.target.result}" flie.type="${selecion.type}" controls></audio>
                    <p class="somep">${selecion.name}</p>
                `
            }
            reader.readAsDataURL(selecion)
    }else if(fileType === 'video'){
        const reader = new FileReader()
            reader.onload = function(e){
                tweek.innerHTML = `
                    <div style="display:flex; width:100%; height:260px;">
                        <video src="${e.target.result}" flie.type="${selecion.type}" style="width:100%" heigth:100%; controls></video>  
                    </div>
                    <p class="somep">${selecion.name}</p>
                `
            }
            reader.readAsDataURL(selecion)
    }else{
        tweek.innerHTML = `
            <img src="./Super icons/Empty tag.png" alt="" style="width:100%; height:90%;">
            <p class="somep">${selecion.name}</p>
        `
    }

    PreviewAll.append(exitIt, tweek, newsendbuds)
    appender.append(PreviewAll);
    sendbutton.setAttribute('disabled', '')
    sendbutton.innerHTML = `<i class="fa fa-ban"></i>`;

    document.addEventListener("click", (event) => {
        const isUserTag = event.target.closest(".individualchat");
        if(isUserTag) {
            document.querySelectorAll('.preview').forEach(preview => preview.remove());
            fileSelection.value = ''
            chatInputText.style.cursor = ''
            chatInputText.removeAttribute('disabled')
            contentdrop1.style.visibility = 'visible'
            sendbutton.removeAttribute('disabled')
            sendbutton.innerHTML = `<i class="fa fa-paper-plane res"></i> `;
            
        }
    });
    
    newsendbuds.addEventListener('click', async () => {
        if (!selecion) {
            firebaseService.showToast('Please select file.', 'error');
            selecion = null;
            fileSelection.value = '';
            document.querySelectorAll('.preview').forEach(preview => preview.remove());
            chatInputText.style.cursor = '';
            chatInputText.removeAttribute('disabled');
            sendbutton.removeAttribute('disabled');
            sendbutton.innerHTML = `
                <i class="fa fa-paper-plane res"></i>
            `;
            contentdrop1.style.visibility = 'visible'
            return;
        }
    
        if (selecion.size > vaildfilesize) {
            firebaseService.showToast('File size is greater than 10mb', 'error');
            selecion = null;
            fileSelection.value = '';
            document.querySelectorAll('.preview').forEach(preview => preview.remove());
            chatInputText.style.cursor = '';
            chatInputText.removeAttribute('disabled');
            sendbutton.removeAttribute('disabled');
            sendbutton.innerHTML = `
                <i class="fa fa-paper-plane res"></i>
            `;
            contentdrop1.style.visibility = 'visible'
            return;
        }
        newsendbuds.disabled = true;
        try {
            const uniqueId = Math.random().toString(36).substring(2, 10); 
            const fileName = `voice_notes_${Date.now()}_${uniqueId}.mp3`;
            const NewUploadName = selecion.name + fileName

            const storageRef = ref(firebaseService.storage, `chatFiles/${chatId}/${NewUploadName}`);
            const uploadTask = uploadBytesResumable(storageRef, selecion);
            uploadTask.on('state_changed', (snapshot) => {
                tweek.innerHTML = '';
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                animationprogress.style.width = progress + '%';
                const Roundup = Math.floor(progress)
                animationprogress.innerHTML = Roundup + '%' + ' ' + 'Complete!';
                tweek.append(animationprogress);
                tweek.append(pls);
            }, async (error) => {
                firebaseService.showToast(`Upload failed: ${error.message}`, 'error');
                
                try {
                    await deleteObject(uploadTask.snapshot.ref); 
                    console.log("File successfully deleted due to error.");
                } catch (deleteError) {
                    console.error("Error deleting file: ", deleteError.message);
                }
    
                // Cleanup and reset UI
                selecion = null;
                fileSelection.value = '';
                document.querySelectorAll('.preview').forEach(preview => preview.remove());
                chatInputText.style.cursor = '';
                chatInputText.removeAttribute('disabled');
                sendbutton.removeAttribute('disabled');
                sendbutton.innerHTML = `
                    <i class="fa fa-paper-plane res"></i>
                `;
                contentdrop1.style.visibility = 'visible'
            }, async () => {
                const fileURL = await getDownloadURL(uploadTask.snapshot.ref);
                const messageContent = {
                    type: fileType,
                    name: NewUploadName,
                    url: fileURL,
                    size: selecion.size,
                };
    
                await firebaseService.sendMessage(chatId, senderId, recipientId, messageContent);

                firebaseService.showToast('File sent successfully!', 'success');
                selecion = null;
                document.querySelectorAll('.preview').forEach(preview => preview.remove());
                fileSelection.value = '';
                chatInputText.style.cursor = '';
                chatInputText.removeAttribute('disabled');
                sendbutton.removeAttribute('disabled');
                contentdrop1.style.visibility = 'visible'
                sendbutton.innerHTML = `
                    <i class="fa fa-paper-plane res"></i>
                `;
            });
    
        } catch (error) {
            firebaseService.showToast(`Error while sending file: ${error.message}`, 'error');
            
            // Ensure deletion if any error occurs
            try {
                const storageRef = ref(firebaseService.storage, `chatFiles/${chatId}/${NewUploadName}`);
                await deleteObject(storageRef); // Use the correct reference for deletion
                console.log("File successfully deleted due to error.");
            } catch (deleteError) {
                console.error("Error deleting file: ", deleteError.message);
            }
    
            selecion = null;
            fileSelection.value = '';
            document.querySelectorAll('.preview').forEach(preview => preview.remove());
            chatInputText.style.cursor = '';
            chatInputText.removeAttribute('disabled');
            sendbutton.removeAttribute('disabled');
            sendbutton.innerHTML = `
                <i class="fa fa-paper-plane res"></i>
            `;
            contentdrop1.style.visibility = 'visible'
        }
    });
    
   

    })

}
async function VoiceNoteMessage(Currentuser, Element) {

    let audiolhunks = [];
    let maxDuration = 60; // Maximum recording duration in seconds
    let recordingIndicator = document.getElementById("recording-indicator"); // Assume there's an indicator
    

    contentdrop1.addEventListener("click", contentDropClickListener = () => {
        if (!window.MediaRecorder) {
            firebaseService.showToast("Your browser does not support voice recording.", "error");
            return
        }
        if (!isRecording) {
            startVoiceNote();
        } else {
            stopVoiceNote();
        }

    });

    
    Secondnew.appendChild(ThirdElement);
    NewElement.appendChild(Secondnew);

    function startVoiceNote() {
        isRecording = true;
        XenderPlate.style.display = "none";
        contentdrop1.innerHTML = `<i class="fa fa-microphone fa-fade" style="color:red;"></i>`
        contentdrop2.style.visibility = 'hidden'
        XenderParent.appendChild(NewElement);

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                audiolhunks = [];
                mediaRecorder.start();

                mediaRecorder.addEventListener("dataavailable", (event) => {
                    audiolhunks.push(event.data);
                });

                let progress = 0;
                ThirdElement.style.width = "0%";
                progressInterval = setInterval(() => {
                    progress += 1.67;
                    ThirdElement.style.width = `${progress}%`;
                }, 1000);
                timeoutId = setTimeout(() => {
                    stopVoiceNote();
                }, maxDuration * 1000);
            })
            .catch((error) => {
                console.error("Error accessing microphone:", error);
                firebaseService.showToast(`Microphone error: ${error.message}`, "error");
                isRecording = false;
                contentdrop1.innerHTML = `<i class="fa fa-microphone"></i>`;
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
                document.querySelectorAll('.ForVoiceChat').forEach(NewElement => NewElement.remove())
                XenderPlate.style.display = "flex";
                contentdrop2.style.visibility = 'visible'
                clearInterval(progressInterval);
                clearTimeout(timeoutId);
            });
    }

     function stopVoiceNote() {
        contentdrop2.style.visibility = 'visible'
        contentdrop1.innerHTML = `<i class="fa fa-microphone"></i>`;
        const uniqueId = Math.random().toString(36).substring(2, 10); 
        const fileName = `voice_notes_${Date.now()}_${uniqueId}.mp3`;
        if (isRecording && mediaRecorder && mediaRecorder.state !== "inactive") {
            isRecording = false;

            clearInterval(progressInterval);
            clearTimeout(timeoutId);

            mediaRecorder.addEventListener("stop", async () => {
                const audioBlob = new Blob(audiolhunks, { type: "audio/mp3" });
                uploadAudio(audioBlob, fileName);
            });
            mediaRecorder.stop();
            ThirdElement.style.width = "0%";
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
            document.querySelectorAll('.ForVoiceChat').forEach(NewElement => NewElement.remove())
            XenderPlate.style.display = "flex";
        }
    }
       
    
    function uploadAudio(audioBlob, fileName) {
            const storageRef1 = ref(firebaseService.storage, `chatFiles/${chatId}/${fileName}`);
            uploadBytes(storageRef1, audioBlob)
            .then(snapshot => {
                const fileSize = audioBlob.size; 
                const fileType = audioBlob.type;  
                const filePath = snapshot.ref.fullPath; 

                return getDownloadURL(snapshot.ref).then(url =>({
                    url,
                    fileSize,
                    fileType,
                    filePath,
                    fileName
                }))
            })
            .then(({url, fileSize, fileType, filePath, fileName}) => {
                sendVoiceNote(url, fileSize, fileType, filePath, fileName);
            })
            .catch(error => {
                contentdrop2.style.visibility = 'visible'
                console.error("Upload failed:", error);
                firebaseService.showToast(`"Upload failed:${error.message}`, "error");
            });
    }

    async function sendVoiceNote(audioBlob, fileSize, fileType, filePath, fileName) {
        const otheruseruid = Element.getAttribute(`data-user-id`)
        const NewChatID = [Currentuser, otheruseruid].sort().join('_');

        const messageContent = {
            type: "audio",
            name: fileName,
            url: audioBlob,
            size: fileSize,
        };
            try{
                await firebaseService.sendMessage(NewChatID, Currentuser, otheruseruid, messageContent);
                // firebaseService.showToast("Voice note sent!", "success");
            }
            catch(error){
                contentdrop2.style.visibility = 'visible'
                console.error("Error saving message:", error);
                firebaseService.showToast("Failed to send message. Try again.", "error");
            };
    }


}
async function checkDataAvailability() {
    try {
        const response = await fetch("https://www.google.com/favicon.ico", { mode: "no-cors" });
        // console.log("✅ Data is available.");
    } catch (error) {
        firebaseService.showToast("⚠ You may have run out of data! Check your internet connection.", 'error');
    }
}

function ToViewUserspictureInMax(userId){
    const figureMan = document.querySelector('.iconsdem figure')
    figureMan.addEventListener('click', async ()=>{
        documentte.style.display = 'flex'

            const storageRef = ref(firebaseService.storage, `profilePictures/${userId}.jpg`);
            const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.png`);
           
            try {
                const dowm = await getDownloadURL(storageRef)
                emmm.src = dowm
            } catch (error) {
                  if (error.code === 'storage/object-not-found'){
                    const ty = await getDownloadURL(defaultRef)
                    emmm.src = ty
                  }else{
                    emmm.src = `./Super icons/defualtman.png`;
                    console.error('Error fetching profile picture:', error.message);
                  }
            }
    })
}

async function ChatterMate() {

    const figureMan = document.querySelector('.currentchatterinfor figure');

    figureMan.addEventListener('click', async () => {
        documentte.style.display = 'flex';
        const pals = figureMan.getAttribute('RAdata-set-aria')
        const storageRef = ref(firebaseService.storage, `profilePictures/${pals}.jpg`);
        const defaultRef = ref(firebaseService.storage, `profilePictures/defualtman.png`);
        try {
            const dowm = await getDownloadURL(storageRef);
            emmm.src = dowm;
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                const ty = await getDownloadURL(defaultRef);
                emmm.src = ty;
            } else {
                emmm.src = `./Super icons/defualtman.png`;
                console.error('Error fetching profile picture:', error.message);
            }
        }

    });
}
await ChatterMate()
function searchQueryFunction(){
    document.querySelector('.newsmargin input').addEventListener('input', function () {
        const searchQuery = this.value.toLowerCase();
        const userElements = document.querySelectorAll('.individualchat');
    
        userElements.forEach(userElement => {
            const userName = userElement.querySelector('.username_chat h3').textContent.toLowerCase();
            if (searchQuery ==='' || userName.includes(searchQuery)) {
                userElement.style.display = 'flex'; 
            }else {
                userElement.style.display = 'none'; 
            }
        });
    });
    
}

function HideSettings(){
    iconsdem[2].addEventListener('click', function(){
        if(settingsPopup.classList.contains('steeze')){
            settingsPopup.classList.add('steeze1')
            settingsPopup.classList.remove('steeze')
        }
    })
}

async function logoutUser() {
    const auth = getAuth();
    try {
      await signOut(auth);
      window.location.href = './indexLogin.html';
    }catch(error) {
      console.error('Error logging out:', error);
    }
}
  
function Tologout(){
    let logoutbud = document.querySelector('.namecoms button')
    logoutbud.onclick = () => {
        logoutUser()
        updateUserStatus(false)
    }
}

function ContentDrop(){
    contentdrop2.addEventListener('click', function(){
        if(droplist.classList.contains('insidehide')){
            droplist.classList.remove('insidehide')
            droplist.classList.add('outsideshow')
        }else{
            droplist.classList.remove('outsideshow')
            droplist.classList.add('insidehide')
        }
    })
}

function FunctionForDifferentViewPort(){
    if (window.innerWidth <= 730) { 
        const chatContainer = document.querySelector("main .chat_area");
        const backArrow = document.querySelector(".currentchatterinfor span");
        const userListContainer = document.querySelector("main .user");
        const userElement = document.querySelectorAll('.individualchat')
        
        chatContainer.style.display = "flex"; 
        chatContainer.style.position = 'absolute'
        chatContainer.style.top = '0';
        chatContainer.style.width = '100%'
        chatContainer.style.height = '100%'
        backArrow.style.display = 'flex';
        chatContainer.style.left = '0';
        userListContainer.style.display = 'none';

        backArrow.addEventListener("click", () => {
            userListContainer.style.display = 'flex'
            chatContainer.style.display = "none"; 
            userElement.forEach(tag =>{
               if(tag.classList.contains('usertagColor')){
                    tag.classList.remove('usertagColor')
               }
            })
            backArrow.style.display = 'none';
        });
    }
    
}

function FunctionFor570_ViewPort(){
    const asideElement = document.querySelector('aside')

    if(window.innerWidth <= 570){
        iconsdem[0].innerHTML = `<i class="fa fa-xmark"></i>`;
        iconsdem[0].style.backgroundColor = '#d1e7dd';
        Toggle1.addEventListener('click', ()=>{
            toshowSideBar()
        })
        
        iconsdem[0].addEventListener('click', ()=>{
            HideSideBar()
        })
    }
    function toshowSideBar(){
        asideElement.style.left = '0'        
    }
    function HideSideBar(){
        asideElement.style.left = '-100em' 
    }
    document.addEventListener('click', (event)=>{
        if(Toggle1.contains(event.target)){
            asideElement.style.left = '0' 
        }else if(!asideElement.contains(event.target)){
            asideElement.style.left = '-100em' 
        }
    })
}

window.onclick = function(event){
    if(!event.target.matches('.comeins i') && !event.target.matches('.dropdown1')){
        droplist.classList.remove('outsideshow')
        droplist.classList.add('insidehide')
    }
}
document.addEventListener('click', function(event){
    if(iconsdem[2].contains(event.target)){
        settingsPopup.classList.add('steeze1')
        settingsPopup.classList.remove('steeze')
    }else if(!settingsPopup.contains(event.target)){
        settingsPopup.classList.remove('steeze1')
        settingsPopup.classList.add('steeze')
    }
})
function DetailsRemoverFN(){
    DetailsRemover.addEventListener('click', ()=>{
        if(settingsPopup.classList.contains('steeze1')){
            settingsPopup.classList.remove('steeze1')
            settingsPopup.classList.add('steeze')
        }
    })
}
window.addEventListener('online', ()=>{
    FreashIn()
    setTimeout(()=>{
        location.reload()
    },3000)
})
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
window.addEventListener("play", function(evt) {
    if(window.$_currentlyPlaying && window.$_currentlyPlaying != evt.target) {
      window.$_currentlyPlaying.pause();
    }
    window.$_currentlyPlaying = evt.target;
}, true);

FunctionFor570_ViewPort()
DetailsRemoverFN()
searchQueryFunction()
ContentDrop()
HideSettings()
document.addEventListener("DOMContentLoaded", loadAllUsers())
setInterval(checkDataAvailability, 10000);


