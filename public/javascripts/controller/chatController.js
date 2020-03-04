app.controller('chatController', ['$scope','userFactory','chatFactory', ($scope,userFactory,chatFactory) => {

    function init(){
        userFactory.getUser().then(user => {
            $scope.user = user;
        });
    };

    init();

    $scope.onlineList = [];
    $scope.roomList = [];
    $scope.activeTab = 1;
    $scope.chatClicked=false;
    $scope.loadingMessages = false;
    $scope.chatName="";
    $scope.message="";
    $scope.roomId=""; //mesajın hangi odada yazıldığını tutmak için
    $scope.messages=[];
    $scope.user = {};
    const socket = io.connect("http://localhost:3000");


    socket.on('onlineList',users => {
        $scope.onlineList = users;
        $scope.$apply();
    });

    socket.on('roomList',rooms => {
        $scope.roomList = rooms;
        $scope.$apply();
    });
    socket.on('receiveMessage',message => {
        $scope.messages[message.roomId].push({
            userId:message.userId,
            name:message.username,
            surname:message.surname,
            message : message.message
        });
        $scope.$apply();
    });

    $scope.newMessage = () => {
        if($scope.message.trim() !== ''){ //boş değilse
            socket.emit('newMessage',{
                message : $scope.message,
                roomId : $scope.roomId
            });

            $scope.messages[$scope.roomId].push({
                userId:$scope.user._id,
                username:$scope.user.username,
                surname:$scope.user.surname,
                message : $scope.message
            });

            $scope.message='';
        }
    };

    $scope.switchRoom = room => {
        $scope.chatName=room.name;
        $scope.roomId = room.id;
        $scope.chatClicked=true;

        if(!$scope.message.hasOwnProperty(room.id)){ //clientteki veriyi kullanmak için
            $scope.loadingMessages = true;
            console.log("servise bağlanıyor");
            chatFactory.getMessages(room.id).then(data => {
                $scope.messages[room.id] = data;
                $scope.loadingMessages = false;
            });
        }
    };
    $scope.newRoom = () =>{
       // let randomName = Math.random().toString(36).substring(7);
        let name = window.prompt("Oda ismi giriniz");
        if(name !== '' && name !== null){
            socket.emit('newRoom',name);
        }

    };
    $scope.changeTab = tab => {
        $scope.activeTab = tab;
    };



}]);