class ChatEngine {
    constructor(chatBoxID, userEmail) {
        this.chatBox = $(`${chatBoxID}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://13.233.75.14:5000');

        if (this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {
        let self = this;

        this.socket.on('connect', function () {
            console.log('Connection established using sockets');

            self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'codeial'
            });

            self.socket.on('user_joined', function (data) {
                console.log('A user joined.', data);
            });
        });

        $('#chatbutton').click(function () {
            let msg = $('#chattext').val();

            if (msg != '') {
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'codeial'
                });
            }
        });

        self.socket.on('receive_message', function (data) {
            console.log('Message received', data.message);

            let newMessage = $('<li class="cmessage">');

            let messageType = 'othermessage';

            if (data.user_email == self.userEmail) {
                messageType = 'selfmessage';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));
            newMessage.append($('<sub>', {
                'html': data.user_email
            }));
            newMessage.addClass(messageType);

            document.getElementById('chattext').value = "";

            $('#chat-list').append(newMessage);
        })
    }
}