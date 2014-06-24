//


  // SELECT VARIABLES as DOM NODES

  window.currentRoom = undefined;
  var Rooms = function(data){
    var object = {};
    //take out all the duplicates.
    for(var i = 0; i < data.length; i++){
      if(!object[data[i].roomname]){
        object[data[i].roomname] = data[i].roomname;
      }
    }
    //result will be an array of all the rooms.
    return object;
  };


  var makeRoom = function( room ){
    return $('<li></li>').addClass('list-group-item').text(room);
  };

  // YOUR CODE HERE:

  var app = {
    messages: {},
    server : '127.0.0.1:3000',
    init: function(){
      var $input = $('#createMsgInput');
      var $send = $('#createMsgButton');
      var cRoom = "";

      //add click event listener to the message button
      $send.on('click', function(){
        var message = {
          text : $input.val(),
          username : 'Mr Sexy',
          roomname: cRoom
        };
        app.send(message);
        //console.log($input.val());
      });

      $("#roomsList").on("click", "li", function(){
        var r = $(this).text();
        cRoom = r;

        $("#roomsList li").removeClass("bg-blue");
        $("#messagesList li").hide();
        $(this).addClass("bg-blue");
        $("#messagesList").find("." + r).show();
      });


    },
    send: function(data){
      console.log(data);
      $.ajax({
        url : '127.0.0.1:3000/classes/messages',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function( data ){
          alert('sent')
        }
      });
    },
    fetch: function(){
      var date  = new Date();
      $.ajax({
        type: "GET",
        url : '127.0.0.1:3000/classes/messages',
        data: { order: "-createdAt"},
        contentType: "application/json",
        success: function(data){
           alert('sent');
          $("#roomsList").html("");//empties the roomlist
          $("#messagesList").html("");

          var rooms = Rooms(data.results);

          _.each(rooms, function (item) {//go through all the keys
            var node = makeRoom(item);//make a room
            $('#roomsList').append(node);//add it to room list
          });
          _.each(data.results, function(item){
            var $usermsg = $('<div></div>').addClass('list-group-item-text').html('<strong>'+item.text+'</strong>');
            var $username = $('<div></div>').addClass('list-group-item-text').html('<small>'+item.username+'</small>');
            var $node = $('<li></li>').addClass('list-group-item').addClass(item.roomname);
            $node.append($usermsg).append($username);
            $('#messagesList').prepend($node);
            app.messages[item.objectId] = item;
          });
        },
        error: function(data){
          console.log('fail',data);
        }
      });
    }
  };
$(document).ready(function(){
  app.init();
  app.fetch();
  $('#refresh').on('click', function(){
    app.fetch();
  });

  setInterval(function(){
    app.destroy();
  }, 5000);
});
