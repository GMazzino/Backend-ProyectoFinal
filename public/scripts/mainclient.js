const socket = io();

document.querySelector('#frmChat').addEventListener('submit', (e) => {
  if (e.cancelable) {
    e.preventDefault();
    if (document.querySelector("#frmChat input[name='email'").value != '') {
      const chatMsg = {
        email: document.querySelector("#frmChat input[name='email'").value,
        time: '',
        msg: document.querySelector("#frmChat input[name='msg'").value,
      };
      document.querySelector("#frmChat input[name='msg'").value = '';
      socket.emit('chatMsg', JSON.stringify(chatMsg));
    }
  }
});

socket.on('newChatMsg', async (chatMsg) => {
  chatMsg = JSON.parse(chatMsg);
  let container = document.querySelector('#chatMsgs');
  container.innerHTML += `<p><span class="date">El ${chatMsg.time}</span>, <span class="email">${chatMsg.email}</span>, escribió: <span class="msg">${chatMsg.msg}</span></p>`;
});
