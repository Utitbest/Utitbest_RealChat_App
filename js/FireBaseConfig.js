
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js';
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, setDoc, onSnapshot, where, 
  serverTimestamp, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, getMetadata,} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-storage.js";


export default class FirebaseService {
  constructor(config) {
    this.app = initializeApp(config);
    this.db = getFirestore(); 
    this.auth = getAuth();
    this.storage = getStorage();
    this.unsubscribers = {};
    this.lastCheckTime = {};
    this.UserName = null;
    this.activeChatId = null;
    this.handleChatClick = null;

  }

  showToast(message, type = "success") {
    Toastify({
      text: message,
      duration: 4000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: type === "success" ? "green" : "red",
    }).showToast();
  }

  



async getCurrentUserId() {
  const user = this.auth.currentUser;
  if (user) {
      return user.uid;
  } else {
      throw new Error("No user is currently logged in.");
  }
}

async createDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), data);
      this.showToast("Document created successfully!");
      return docRef.id;
    } catch (error) {
      this.showToast(`Error creating document: ${error.message}`, "error");
      throw error;
    }
}

async readDocument(collectionName, documentId) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()){
        this.showToast("Document retrieved successfully!");
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        this.showToast("No such document found", "error");
        return null;
      }
    } catch (error) {
      this.showToast(`Error reading document: ${error.message}`, "error");
      throw error;
    }
}

async readAllDocuments(collectionName) {
    try {
      const snapshot = await getDocs(collection(this.db, collectionName));
      this.showToast("All documents retrieved successfully!");
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      this.showToast(`Error reading documents: ${error.message}`, "error");
      throw error;
    }
}

async updateDocument(collectionName, documentId, data) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await updateDoc(docRef, data);
      this.showToast("Document updated successfully!");
    } catch (error) {
      this.showToast(`Error updating document: ${error.message}`, "error");
      throw error;
    }
}

async deleteDocument(collectionName, documentId) {
    try {
      const docRef = doc(this.db, collectionName, documentId);
      await deleteDoc(docRef);
      this.showToast("Document deleted successfully!");
    } catch (error) {
      this.showToast(`Error deleting document: ${error.message}`, "error");
      throw error;
    }
}

async registerUser(credentials, userData) {
    try {
      const { email, password } = credentials;
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(this.db, "users", userId), {
        uid: userId,
        ...userData,
        isActive: true,
        lastActive: serverTimestamp(),
        createdAt: new Date()
      });

      this.showToast("User registered successfully!");
      return userId;
    } catch (error) {
      this.showToast(`Error registering user: ${error.message}`, "error");
      throw error;
    }
}

async getUserData(uid) {
    const userDoc = await getDoc(doc(this.db, "users", uid));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }; // Return user data along with the ID
    } else {
      throw new Error("User not found");
    }
}
async loginUser(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.showToast("Login successful!");
      return userCredential.user.uid;
    } catch (error) {
      this.showToast(`Error logging in: ${error.message}`, "error");
      throw error;
    }
}

async getAllUsers() {
    try {
        const usersSnapshot = await getDocs(collection(this.db, "users"));
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return users;
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw error;
    }
}

async sendMessage(chatId, senderId, recipientId, messageContent) {
  try {
      const chatRef = doc(this.db, "chats", chatId);
      const chatMessagesRef = collection(chatRef, "messages");
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
          await setDoc(chatRef, {
              lastMessage: messageContent,
              lastMessageTimestamp: serverTimestamp(),
              participants: [senderId, recipientId],
          });
      }

      const messageData = {
        senderId,
        recipientId,
        content: messageContent,
        timestamp: serverTimestamp(), 
        Status: false
    };
    
      await addDoc(chatMessagesRef, messageData);

      await updateDoc(chatRef, {
          lastMessage: messageContent,
          lastMessageTimestamp: serverTimestamp(),
      });

      
  } catch (error) {
      this.showToast(`Error sending message: ${error}`, "error");
  }
}

async getLastMessage1(chatId) {
  const chatDoc = await getDoc(doc(this.db, "chats", chatId));
  if (chatDoc.exists()) {
      const chatData = chatDoc.data();
      return {
          text: chatData.lastMessage || "No messages yet",
          timestamp: chatData.lastMessageTimestamp,
      };
  }
  if(!chatDoc.exists()){
    return {
      text: "No messages yet",
      timestamp: '', 
    };
  }
  
}

// async listenForMessages(chatId, callback) {
//   try {
//       const messagesRef = collection(this.db, "chats", chatId, "messages");
//       const q = query(messagesRef, orderBy("timestamp", "asc"));

//       onSnapshot(q, (snapshot) => {
//           const messages = snapshot.docs.map((doc) => {
//               const data = doc.data();
             
//               const validTimestamp = data.timestamp || { seconds: 0, nanoseconds: 0 };

//               return {
//                   id: doc.id,
//                   ...data,
//                   timestamp: validTimestamp || null, 
//               };
//           });

//           callback(messages);
//       });
//   } catch (error) {
//       this.showToast(`Error listening for message: ${error}`);
//   }
// }

// async listenForMessages(chatId, callback) {
//   try {

//     this.activeListeners = this.activeListeners || {}; 

//     if (this.activeListeners[chatId]) {
//       console.log(`Removing existing listener for chatId: ${chatId}`);
//       this.activeListeners[chatId]();
//       delete this.activeListeners[chatId]; 
//     }
//       const messagesRef = collection(this.db, "chats", chatId, "messages");
//       const q = query(messagesRef, orderBy("timestamp", "asc"));


//       let messagesArray = []; // Keep track of messages

//       this.activeListeners[chatId] = onSnapshot(q, (snapshot) => {
//           snapshot.docChanges().forEach((change) => {
//               if (change.type === "added") { // Only new messages
//                   const data = change.doc.data();
//                   // const validTimestamp = data.timestamp || { seconds: 0, nanoseconds: 0 };
//                   const message = {
//                       id: change.doc.id,
//                       ...data,
//                       timestamp: data.timestamp || { seconds: 0, nanoseconds: 0 }
//                   };
//                   messagesArray.push(message); // Append new message
//               }
//           });

//           if (messagesArray.length > 0) {
//             console.log(messagesArray)
//               callback(messagesArray); // Send new messages without replacing the old ones
//           }
//       });
//   } catch (error) {
//       this.showToast(`Error listening for messages: ${error}`);
//   }
// }


async listenForMessages(chatId, callback) {
  try {
      this.activeListeners = this.activeListeners || {};

      if (this.activeListeners[chatId]) {
          console.log(`Removing existing listener for chatId: ${chatId}`);
          this.activeListeners[chatId];//()
          delete this.activeListeners[chatId];
      }

      
      const messagesRef = collection(this.db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      this.activeListeners[chatId] = onSnapshot(q, (snapshot) => {
          let messagesArray = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                  id: doc.id,
                  ...data,
                  timestamp: data.timestamp || { seconds: 0, nanoseconds: 0 }  
              };
          });
          callback(messagesArray);
      });
  } catch (error) {
      this.showToast(`Error listening for messages: ${error}`);
  }
}


async listenForMessages11() {
  try {
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    const chatsRef = collection(this.db, "chats");
    onSnapshot(chatsRef, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const chatId = doc.id;
        const messagesRef = collection(this.db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));

        onSnapshot(q, (messagesSnapshot) => {
          messagesSnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data = change.doc.data();
              const messageId = change.doc.id             
              const senderId = data.senderId;
              const receiverId = data.recipientId;
              if (receiverId === currentUser.uid) {
                this.notifyUser(senderId, data);
                this.notifyUser12(senderId, data, messageId, chatId);
              }
              if (senderId === currentUser.uid) {
                this.notifyUser(receiverId, data);
              }
            }
          });
        });
      });
    });
  } catch (error) {
    // console.error("Error listening for messages:", error);
    this.showToast(`Error listening for message: ${error}`);
  }
}

notifyUser(userId, message) {
  const userTag = document.querySelector(`.individualchat[data-user-id="${userId}"]`)

  if (userTag) {
    userTag.querySelector(".username_chat p").textContent = message.content;

    if(typeof message.content === 'string') {
      userTag.querySelector(".username_chat p").textContent = message.content;
    }else if (message.content?.type) {
      userTag.querySelector(".username_chat p").textContent = `${message.content.type.toUpperCase()} File Sent`;
    }else {
      userTag.querySelector(".username_chat p").textContent = 'Unknown Message Type';
    }
    let abi;
    if (message.timestamp && message.timestamp.seconds) {
      abi = message.timestamp.seconds; 
    } else if (message.timestamp && message.timestamp.toDate()) {
      abi = Math.floor(message.timestamp.toDate().getTime() / 1000); 
    } else {
      abi = Math.floor(Date.now() / 1000);
    }
    userTag.querySelector('.times p').textContent = this.getRelativeTime1(abi);
        
  } else {
    console.warn(`User tag for sender ${userId} not found.`);
  }
}

getRelativeTime1(timestamp) {
  if(timestamp == null){
      return ''
  }
  const currentTime = new Date();
  const messageTime = new Date(timestamp * 1000); 
  const timeDiff = currentTime - messageTime; 

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
  if (days > 0) {
    return days === 1 ? 'Yesterday' : `${days}days ago`;
  }
  if (hours > 0) return `${hours}hr${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes}min${minutes > 1 ? 's' : ''}`;
  return `just now`;

}

async listenForAllChats() {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  if (!currentUser) {
      console.error("User not logged in.");
      return;
  }

  const currentUserId = currentUser.uid;
  const chatsRef = collection(this.db, "chats");


  // Unsubscribe previous listener if exists
  if (this.unsubscribers.allChats) {
      this.unsubscribers.allChats();
  }

  // Set a single listener for all chats
  const q = query(chatsRef, where("participants", "array-contains", currentUserId));
  this.unsubscribers.allChats = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach((chatDoc) => {
          const chatId = chatDoc.id;
          if (!this.lastCheckTime[chatId]) {
              this.lastCheckTime[chatId] = new Date();
          }
          this.listenForNewMessages(chatId, currentUserId);
      });
  });
}

async listenForNewMessages(chatId, currentUserId) {
  const messagesRef = collection(this.db, "chats", chatId, "messages");
  
  const notify = new Audio('./mixkit-correct-answer-tone-2870.wav')
  // Unsubscribe previous listener for this chat if exists
  if(this.unsubscribers[chatId]) {
      this.unsubscribers[chatId]();
  }

   this.unsubscribers[chatId] =  onSnapshot(
    query(messagesRef, orderBy("timestamp", "asc")),
      (snapshot) => {
          snapshot.docChanges().forEach( async (change) => {
              const messageData = change.doc.data();
              const messageTimestamp = messageData.timestamp?.toDate() || new Date(0);
              const userRef = await this.getUserData(messageData.senderId)
              if(
                  change.type === "added" &&
                  messageData.senderId !== currentUserId &&
                  messageData.recipientId === currentUserId &&
                  messageTimestamp > this.lastCheckTime[chatId]
               ){
                  this.UserName = userRef.firstname + ' ' + userRef.lastname
                  this.lastCheckTime[chatId] = new Date();

                  this.moveUserTagToTop(messageData.senderId)
                  

                  let notificationContent = 'Unknown message type';
                  if (typeof messageData.content === 'string') {
                    this.showNotification(this.UserName, messageData.content);
                  }else if(messageData.content.type){
                    this.showNotification(this.UserName, messageData.content.type.toUpperCase());
                  }else{
                    this.showNotification(this.UserName, notificationContent);
                  }
                  notify.play()
              }
          });
      }
  );
}

async moveUserTagToTop(userId) {
  const secondusers = document.querySelector('.secondusers')
  const userTag = document.querySelector(`[data-user-id="${userId}"]`);
  if (userTag){
      userTag.remove();
      secondusers.append(userTag)
  }
}

showNotification(title, message) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: './Super icons/pardd.png'
        });
    }
}

notifyUser12(senderId, message, messageId, chatId){
  const userTag = document.querySelector(`.individualchat[data-user-id="${senderId}"]`)
  const sww = userTag.querySelector('.times span .whatsappna')
  if(!userTag){
    console.log('not existed')
    return
  }
  if(sww){
    if(!message.Status){
      sww.style.backgroundColor = '#0a70ea';
    }else{
      sww.style.backgroundColor = '';
    }
  }
  userTag.addEventListener('click', () =>{
    sww.style.backgroundColor = '';
    this.markMessageAsSeen(chatId, messageId);
  })
}

// notifyUser12(senderId, message, messageId, chatId) {
//   const userTag = document.querySelector(`.individualchat[data-user-id="${senderId}"]`);
//   if (!userTag) return;

//   const sww = userTag.querySelector('.times span .whatsappna');
//   if(sww){
//     if (!message.Status) {
//       sww.style.backgroundColor = '#0a70ea';
//     }else{
//       sww.style.backgroundColor = '';
//     }
//   }
//   // if (ActiveChat === chatId) { // Use ActiveChat instead of this.activeChatId
//   //     sww.style.backgroundColor = '';
//   //     this.markMessageAsSeen(chatId, messageId);
//   // }

//   userTag.removeEventListener("click", this.handleChatClick);
//   this.handleChatClick = () => {
//       sww.style.backgroundColor = '';
//       this.markMessageAsSeen(chatId, messageId);
//   };
//   userTag.addEventListener("click", this.handleChatClick);
// }

async markMessageAsSeen(chatId, messageId) { 
    try {
        const messageRef = doc(this.db, "chats", chatId, "messages", messageId);
        const messageSnapshot = await getDoc(messageRef);

        if (!messageSnapshot.exists()) {
            // console.error("No document found for messageId:", messageId);
            return; 
        }

        await updateDoc(messageRef, { Status: true });
    } catch (error) {
        console.error("Error marking message as seen:", error);
        this.showToast(`Error marking message as seen: ${error}`);
    }
}


async UpdateFirstName(userId, newFirstName){ 
  try {

      const userDocRef = doc(this.db, "users", userId);

      await updateDoc(userDocRef, {
        firstname: newFirstName,
      });

      this.showToast("User Firstname updated successfully!", "success");
  } catch (error) {
      console.error("Error updating user Firstname:", error.message);
      this.showToast(`Error: ${error.message}`, "error");
  }
}

async UpdateLastName(userId, newLastName){ 
  try {

      const userDocRef = doc(this.db, "users", userId);

      await updateDoc(userDocRef, {
        lastname: newLastName,
      });

      this.showToast("User Lastname updated successfully!", "success");
  } catch (error) {
      console.error("Error updating user Lastname:", error.message);
      this.showToast(`Error: ${error.message}`, "error");
  }
}

async deleteMessage(chatId, message) {
  try {
      const messageId = message.id;
      const fileUrl = message.content.name || null;
      const messageRef = doc(this.db, `chats/${chatId}/messages/${messageId}`);
      const messageDeleted = "Message Deleted"
      
      if (fileUrl) {
          const storageRef = ref(this.storage, `chatFiles/${chatId}/${fileUrl}`);
          await deleteObject(storageRef);
      }
      
      await updateDoc(messageRef, {
        content: messageDeleted,
      });
      this.updateLastMessage(chatId)
  } catch (error) {
      this.showToast(`Error deleting message: ${error.message}`, 'error')
      console.error("Error deleting message:", error);
  }
}

updateLastMessage(chatId) {
  try {
      if (!chatId) {
          throw new Error("chatId is missing or invalid.");
      }

      const messagesRef = collection(this.db, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));

        onSnapshot(q, (snapshot) => {
          try {
              
              if (!snapshot.empty) {
                  const lastMessage = snapshot.docs[0].data();
                  const recipientId = lastMessage.recipientId
                  const senderId = lastMessage.senderId
                  const returnDeletedRecieve = document.querySelector(`.individualchat[data-user-id="${recipientId}"] .username_chat p`)
                  const returnDeletedSend = document.querySelector(`.individualchat[data-user-id="${senderId}"] .username_chat p`)
                  if (returnDeletedRecieve) {
                    if(typeof lastMessage.content === 'string') {
                      returnDeletedRecieve.textContent = lastMessage.content
                    }else if (lastMessage.content.type) {
                      returnDeletedRecieve.textContent = `${lastMessage.content.type.toUpperCase()} File Sent`;
                    }else {
                      returnDeletedRecieve.textContent = 'Unknown Message Type';
                    }
                  }

                  if (returnDeletedSend) {
                    if(typeof lastMessage.content === 'string') {
                      returnDeletedSend.textContent = lastMessage.content
                      console.log('stings')
                    }else if (lastMessage.content.type) {
                      console.log('file has type')
                      returnDeletedSend.textContent = `${lastMessage.content.type.toUpperCase()} File Sent`;
                    }else {
                      console.log('errors')
                      returnDeletedSend.textContent = 'Unknown Message Type';
                    }
                  }
                  
              } else {
                  console.log('failed to work as needed')
              }
          } catch (domError) {
              console.error("DOM update error:", domError);
          }
      });
  } catch (error) {
      console.error("Error in updateLastMessage:", error);
  }
}



}
