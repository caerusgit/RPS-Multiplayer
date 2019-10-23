$(document).ready(function () {



    // Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDphnl3y_pEJm9Lo3tGLqfW4vJGVFVTKq0",
        authDomain: "bootcamp-15178.firebaseapp.com",
        databaseURL: "https://bootcamp-15178.firebaseio.com",
        projectId: "bootcamp-15178",
        storageBucket: "bootcamp-15178.appspot.com",
        messagingSenderId: "967695164094",
        appId: "1:967695164094:web:1bf1fdc3d2d3d036bfb4ef"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);


    var database = firebase.database();

    var player1 = null;
    var player2 = null;
    var yourPlayerName = "";
    var turn = 0;






    database.ref("rockPaperScissors/players/").on("value", function (snapshot) {
        if (snapshot.child("player1").exists()) {
            console.log("Player 1 exists");

            player1 = snapshot.val().player1;
            player1Name = player1.name;

            $("#player-1").text(player1Name);
            $("#player-1-name").text(player1Name);
            if (player1 && player2 && (yourPlayerName === player1.name)) {
                $("#player-1-stats").html('Wins:<span class="badge badge-pill badge-success">'+player1.win+'</span>Ties:  <span class="badge badge-pill badge-light">'+player1.tie+'</span>Losses:  <span class="badge badge-pill badge-danger">'+player1.loss+'</span>');
            }
        } else {
            console.log("Player 1 does NOT exist");

            player1 = null;
            player1Name = "";

            $("#player-1-name").text("Waiting for Player 1...");
            database.ref("/outcome/").remove();
        }

        if (snapshot.child("player2").exists()) {
            $('#loadMe').modal('hide')
            console.log("Player 2 exists");

            player2 = snapshot.val().player2;
            player2Name = player2.name;

            $("#player-2").text(player2Name);
            $("#player-2-name").text(player2Name);
            if (player1 && player2 && (yourPlayerName === player1.name)) {
                $("#player-1-stats").html('Wins: <span class="badge badge-pill badge-success">'+player1.win+'</span>Ties: <span class="badge badge-pill badge-light">'+player1.tie+'</span>Losses: <span class="badge badge-pill badge-danger">'+player1.loss+'</span>');
            }
            if (player1 && player2 && (yourPlayerName === player2.name)) {
                $("#player-2-stats").html('Wins: <span class="badge badge-pill badge-success">'+player2.win+'</span>Ties: <span class="badge badge-pill badge-light">'+player2.tie+'</span>Losses: <span class="badge badge-pill badge-danger">'+player2.loss+'</span>');
            }
        } else {
            console.log("Player 2 does NOT exist");

            player2 = null;
            player2Name = "";

            $("#player-2-name").text("Waiting for Player 2...");
            database.ref("rockPaperScissors/outcome/").remove();
        }

        if (player1 && player2) {

            $("#player-1-div").css("border-color", "red")
            $("#make-choice").html("<h4>" + player1Name + ", make your choice!</h4>");
            $("#enter-name").css("display", "none");
        }

        if (!player1 && !player2) {
            database.ref("/chat/").remove();
            database.ref("/turn/").remove();
            database.ref("/outcome/").remove();

            $("#chat-box").empty();
            $("#player-1-stats").empty();
            $("#player-2-stats").empty();
        }

    });


    $('#player-name').keypress(function (e) {
        if (e.which == 13) {
            startGame()
        }
    });

    $("#name-box").on("click", function () {
        startGame();
    });

    function startGame() {
        event.preventDefault();




        if (($("#player-name").val().trim() !== "") && !(player1 && player2)) {
            if (player1 === null) {
                console.log("Adding Player 1");
                yourPlayerName = $("#player-name").val().trim();
                $("#user").text(yourPlayerName);
                player1 = {
                    name: yourPlayerName,
                    win: 0,
                    loss: 0,
                    tie: 0,
                    choice: ""
                };
                $("#player-1").text(player1.name);
                $("#player-1-greeting").css("display", "block");
                $("#enter-name").css("display", "none");
                console.log(player1);
                console.log(yourPlayerName);
                database.ref().child("rockPaperScissors/players/player1").set(player1);

                database.ref().child("rockPaperScissors/turn").set(1);

                database.ref("rockPaperScissors/players/player1").onDisconnect().remove();

                database.ref("rockPaperScissors/chat/").onDisconnect().remove();
                database.ref("rockPaperScissors/turn/").onDisconnect().remove();
                database.ref("rockPaperScissors/outcome/").onDisconnect().remove();


                $('#loadMe').modal({
                    backdrop: "static", //remove ability to close modal with click
                    keyboard: false, //remove option to close with keyboard
                    show: true //Display loader!
                })




            } else if ((player1 !== null) && (player2 === null)) {
                console.log("Adding Player 2");

                yourPlayerName = $("#player-name").val().trim();
                player2 = {
                    name: yourPlayerName,
                    win: 0,
                    loss: 0,
                    tie: 0,
                    choice: ""
                };
                $("#player-2").text(player2.name);
                $("#player-2-greeting").css("display", "block");
                $("#enter-name").css("display", "none");
                database.ref().child("rockPaperScissors/players/player2").set(player2);



            if (turn === 1) {
                if (yourPlayerName == player2.name) {
                    $("#waiting-div").css("display", "block");
                }
            }





                database.ref("rockPaperScissors/players/player2").onDisconnect().remove();

                database.ref("rockPaperScissors/chat/").onDisconnect().remove();
                database.ref("rockPaperScissors/turn/").onDisconnect().remove();
                database.ref("rockPaperScissors/outcome/").onDisconnect().remove();

            }

            var msg = yourPlayerName + " has joined!";
            console.log(msg);

            var chatKey = database.ref().child("rockPaperScissors/chat/").push().key;

            database.ref("rockPaperScissors/chat/" + chatKey).set(msg);

            $("#player-name").val("");
        }
    };





    database.ref("rockPaperScissors/turn/").on("value", function (snapshot) {
        if (snapshot.val() === 1) {
            if (yourPlayerName == player1.name) {
                $("#player-1-div").css("display", "block");
                $("#player-1-buttons").css("display", "block");
                $("#waiting-div").css("display", "none");
            } else {
                $("#player-2-buttons").css("display", "none");
                if (player2 !== null) {
                    $("#waiting-div").css("display", "block");
                }
                
            }



            console.log("TURN 1");
            turn = 1;
            $("#opponent").text(player1Name)

            if (player1 && player2) {
                $("#player-2-div").css("border-color", "black");
                $("#player-1-div").css("border-color", "red");
                $("#make-choice").html("<h4>" + player1Name + ", make your choice!</h4>");
            }
            if (snapshot.child("/outcome/").exists()) {
                // $("body").append("<h4>" + outcome + "!</h4>");
            }

        } else if (snapshot.val() === 2) {
            if (yourPlayerName == player2.name) {
                $("#player-2-div").css("display", "block");
                $("#player-2-buttons").css("display", "block");
                $("#waiting-div").css("display", "none");
            } else {
                $("#player-1-buttons").css("display", "none");
                $("#waiting-div").css("display", "block");
            }

            console.log("TURN 2");
            turn = 2;
            $("#opponent").text(player2Name)

            if (player1 && player2) {
                $("#player-1-div").css("border-color", "black");
                $("#player-2-div").css("border-color", "red");
                $("#make-choice").html("<h4>" + player2Name + ", make your choice!</h4>");
            }
            if (snapshot.child("rockPaperScissors/outcome/").exists()) {
                $("chat-box").append("<h4>" + outcome + "!</h4>");
            }
        }
    });

    database.ref("rockPaperScissors/chat/").on("child_added", function (snapshot) {
        var chatMsg = snapshot.val();
        var chatEntry = $("<div>").html(chatMsg);

        $("#chat-box").append(chatEntry);
        $("#chat-box").scrollTop($("#chat-box")[0].scrollHeight);
    });


    $('#player-chat').keypress(function (e) {
        if (e.which == 13) {
            chat();
        }
    });

    $("#chat-send").on("click", function (event) {
        chat();
    })




    function chat() {
        event.preventDefault();

        if ((yourPlayerName !== "") && ($("#player-chat").val().trim() !== "")) {
            var msg = yourPlayerName + ": " + $("#player-chat").val().trim();
            $("#player-chat").val("");

            var chatKey = database.ref().child("rockPaperScissors/chat/").push().key;

            database.ref("rockPaperScissors/chat/" + chatKey).set(msg);
        }
    };

    database.ref("rockPaperScissors/outcome/").on("value", function (snapshot) {
        var outcome = snapshot.val();
        // $("#round-outcome").html(snapshot.val());

        if (player1 && player2) {
            myFunction(snapshot.val());
        }






    });

    $("#player-1-div").on("click", ".btn", function (event) {
        event.preventDefault();

        if (player1 && player2 && (yourPlayerName === player1.name) && (turn === 1)) {
            var choice = $(this).val().trim();

            player1.choice = choice;
            database.ref().child("rockPaperScissors/players/player1/choice").set(choice);

            turn = 2;
            database.ref().child("rockPaperScissors/turn").set(2);
            $("#round-outcome").html("");

        }
    });


    $("#player-2-div").on("click", ".btn", function (event) {
        event.preventDefault();

        if (player1 && player2 && (yourPlayerName === player2.name) && (turn === 2)) {
            var choice = $(this).val().trim();

            player2.choice = choice;
            database.ref().child("rockPaperScissors/players/player2/choice").set(choice);

            rpsCompare();

        }
    });



    function rpsCompare() {
        if (player1.choice === "rock") {
            if (player2.choice === "rock") {
                console.log("tie");
                // $('.toast').toast('show');
                // myFunction() 

                // $('.alert').alert()

                database.ref().child("rockPaperScissors/outcome/").set("Tie game!");
                database.ref().child("rockPaperScissors/players/player1/tie").set(player1.tie + 1);
                database.ref().child("rockPaperScissors/players/player2/tie").set(player2.tie + 1);
            } else if (player2.choice === "paper") {
                console.log("paper wins");

                database.ref().child("rockPaperScissors/outcome/").set(player2.name + " wins! Paper beats Rock!");
                database.ref().child("rockPaperScissors/players/player1/loss").set(player1.loss + 1);
                database.ref().child("rockPaperScissors/players/player2/win").set(player2.win + 1);
            } else {
                console.log("rock wins");

                database.ref().child("rockPaperScissors/outcome/").set(player1.name + " wins! Rock beats Scissors!");
                database.ref().child("rockPaperScissors/players/player1/win").set(player1.win + 1);
                database.ref().child("rockPaperScissors/players/player2/loss").set(player2.loss + 1);
            }

        } else if (player1.choice === "paper") {
            if (player2.choice === "rock") {
                console.log("paper wins");

                database.ref().child("rockPaperScissors/outcome/").set(player1.name + " wins!  Paper beats Rock!");
                database.ref().child("rockPaperScissors/players/player1/win").set(player1.win + 1);
                database.ref().child("rockPaperScissors/players/player2/loss").set(player2.loss + 1);
            } else if (player2.choice === "paper") {
                console.log("tie");

                database.ref().child("rockPaperScissors/outcome/").set("Tie game!");
                database.ref().child("rockPaperScissors/players/player1/tie").set(player1.tie + 1);
                database.ref().child("rockPaperScissors/players/player2/tie").set(player2.tie + 1);
            } else {
                console.log("scissors win");

                database.ref().child("rockPaperScissors/outcome/").set(player2.name + " wins!  Scissors beats Paper!");
                database.ref().child("rockPaperScissors/players/player1/loss").set(player1.loss + 1);
                database.ref().child("rockPaperScissors/players/player2/win").set(player2.win + 1);
            }

        } else if (player1.choice === "scissors") {
            if (player2.choice === "rock") {
                console.log("rock wins");

                database.ref().child("rockPaperScissors/outcome/").set(player2.name + " wins!  Rock beats Scissors!");
                database.ref().child("rockPaperScissors/players/player1/loss").set(player1.loss + 1);
                database.ref().child("rockPaperScissors/players/player2/win").set(player2.win + 1);
            } else if (player2.choice === "paper") {
                console.log("scissors win");

                database.ref().child("rockPaperScissors/outcome/").set(player1.name + " wins!  Scissors beats Paper!");
                database.ref().child("rockPaperScissors/players/player1/win").set(player1.win + 1);
                database.ref().child("rockPaperScissors/players/player2/loss").set(player2.loss + 1);
            } else {
                console.log("tie");

                database.ref().child("rockPaperScissors/outcome/").set("Tie game!");
                database.ref().child("rockPaperScissors/players/player1/tie").set(player1.tie + 1);
                database.ref().child("rockPaperScissors/players/player2/tie").set(player2.tie + 1);
            }
        }

        turn = 1;
        database.ref().child("rockPaperScissors/turn").set(1);
        // database.ref("/outcome/").on("value", function(snapshot) {
        //     $("#round-outcome").html(snapshot.val());
        // });
    }


    // $("#showModalButton").click(function () {
    //     $('#loadMe').modal({
    //         backdrop: "static", //remove ability to close modal with click
    //         keyboard: false, //remove option to close with keyboard
    //         show: true //Display loader!
    //     })
    // }
    // );


    // $("#hideModalButton").click(function () {
    //     $('#loadMe').modal('hide')
    // }
    // );




    function myFunction(texto) {
        var x = document.getElementById("snackbar");
        x.className = "show";
        $("#snackbar").text(texto);
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      }




















});