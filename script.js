const loginBox=document.getElementById('loginBox');
const chatApp=document.getElementById('chatApp');
const usernameInput=document.getElementById('username');
const userCodeInput=document.getElementById('usercode');
const profileCircle=document.getElementById('profileCircle');
const profileCode=document.getElementById('profileCode');
const chatList=document.getElementById('chatList');
const chatHeader=document.getElementById('chatHeader');
const messages=document.getElementById('messages');
const messageInput=document.getElementById('messageInput');
const userSearch=document.getElementById('userSearch');

let users=JSON.parse(localStorage.getItem('users')||'[]');
let currentUserName,currentUserID;

function generateUniqueCode(){
    let code;
    do {
        code = Math.floor(Math.random() * (9999999 - 10000 + 1)) + 10000;
    } while(users.some(u => u.id == code));
    return code;
}

function loginUser(){
  const nameInput = usernameInput.value.trim();
  const codeInput = userCodeInput.value.trim();
  let user;

  if(/^\d{5,7}$/.test(codeInput)){
    user = users.find(u => u.id==codeInput);
  }
  if(!user && nameInput){
    user = users.find(u => u.name.toLowerCase()===nameInput.toLowerCase());
  }
  if(!user){
    if(!nameInput && !codeInput){
      return alert("Please enter either a name or a code!");
    }
    const newID = generateUniqueCode();
    const newName = nameInput || ("User" + newID);
    user = {name:newName,id:newID};
    users.push(user);
    localStorage.setItem('users',JSON.stringify(users));
  }

  currentUserName = user.name;
  currentUserID = user.id;
  profileCircle.textContent = currentUserName;
  profileCode.textContent = `Code: ${currentUserID}`;
  loginBox.style.display = 'none';
  chatApp.style.display = 'block';
  messages.innerHTML = '';
}

function addUser(){
  const name=userSearch.value.trim();
  if(!name) return;
  const id=generateUniqueCode();
  users.push({name,id});
  localStorage.setItem('users',JSON.stringify(users));
  userSearch.value='';
}

function searchUserByCode(){
  const codeInput=userSearch.value.trim();
  chatList.innerHTML='';
  if(!/^\d{5,7}$/.test(codeInput)) return;

  const matchedUser=users.find(u=>u.id==codeInput);
  if(matchedUser){
    const div=document.createElement('div');
    div.className='chat-item';
    div.textContent=`${matchedUser.name} (${matchedUser.id})`;
    div.onclick=()=>openChat(matchedUser);
    chatList.appendChild(div);
  }
}

let currentChatID,currentChatName;

function openChat(user){
  currentChatID=user.id;
  currentChatName=user.name;
  chatHeader.textContent=`Chat with ${user.name} (${user.id})`;
  messages.innerHTML='';
  const hist=JSON.parse(localStorage.getItem('chat_'+user.id)||'[]');
  hist.forEach(m=>addMessage(m.text,m.type,m.senderName));
}

function sendMessage(){
  const text = messageInput.value.trim();
  if(!text) return;
  addMessage(text, 'sent', currentUserName);
  saveMessage(currentChatID, text, 'sent', currentUserName);
  messageInput.value = '';
}

function addMessage(text,type,senderName){
  const div=document.createElement('div');
  div.className='message '+type;
  const senderDiv=document.createElement('div');
  senderDiv.className='message-sender';
  senderDiv.textContent=senderName;
  if(type==='sent') senderDiv.style.color='#d0e8ff';
  div.appendChild(senderDiv);
  const textDiv=document.createElement('div');
  textDiv.textContent=text;
  div.appendChild(textDiv);
  messages.appendChild(div);
  messages.scrollTop=messages.scrollHeight;
}

function saveMessage(id,text,type,senderName){
  const key='chat_'+id;
  const hist=JSON.parse(localStorage.getItem(key)||'[]');
  hist.push({text,type,senderName});
  localStorage.setItem(key,JSON.stringify(hist));
}
