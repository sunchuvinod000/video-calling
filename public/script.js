const socket = io('/'); 
const videoGrid = document.getElementById('video-grid');

var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});

const myVideo = document.createElement('video');
myVideo.muted = true;
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
   myVideoStream = stream;
   addVideoStream(myVideo , stream)

   peer.on('call', call => {
       
       call.answer(stream);
       
       const new_video = document.createElement('video')
  
       call.on('stream', userVideoStream =>{
           addVideoStream(new_video, userVideoStream)
           
       })
   })
   socket.on('user-connected', userId =>{ 
   connectToNewUser(userId,stream);
})
 

let text = $('input');

$('html').keydown((e) =>{
    if(e.which==13 && text.val().length !==0){
     
        socket.emit('message', text.val())
      
        text.val('')
    }
})
socket.on('createMessage',message =>{
    alert(message)
    $('.messages').append(`<li class="message"><b>User</b><br>${message}</li>`)

    scrollBottom()
})

});



peer.on('open', id => {

    socket.emit('join-room', ROOM_ID, id);
})




const connectToNewUser = (userId, stream) =>{

    const call = peer.call( userId , stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream =>{
        console.log(userVideoStream);
        addVideoStream(video, userVideoStream);
    })
}

const addVideoStream = (myvideo,stream) =>{

    myvideo.srcObject = stream;
    myvideo.addEventListener('loadedmetadata', () =>{
        myvideo.play();
  })
    videoGrid.append(myvideo);
}
const scrollBottom = () =>{

    let d = $('.main_chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton()
    }
    else{
        setMuteButton()
        myVideoStream.getAudioTracks()[0].enabled = true;

    }
   
}
const setMuteButton = () =>{
    const html =`
    <i class="fa fa-microphone" aria-hidden="true"></i>
    <span>Mute</span>
    `
    document.querySelector('.main_mute_button').innerHTML = html
};
const setUnmuteButton = () =>{
    const html = `
    <i class="fa fa-microphone-slash unmute" aria-hidden="true"></i>
    <span>UnMute</span>`
    document.querySelector('.main_mute_button').innerHTML = html
}
