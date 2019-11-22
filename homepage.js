$(document).ready(function(){
    document.getElementById('p').onkeydown = function(event) {
    if (event.keyCode == 13) {
        login();
    }
}
});

function login(){
    var user =  document.getElementById("u");
    var pass = document.getElementById("p");
    
    if(user.value == "admin" && pass.value == "p@ssword"){
        window.location = "Dashboard.html";
    } else if(user.value == "spongebob" && pass.value == "squarepants"){
        var audio = new Audio("media/fun.mp3");
        audio.play();
    } else if(user.value == "patrick" && pass.value == "star"){
        var audio = new Audio("media/leedlelee.mp3");
        audio.play();
    } else if(user.value == "eugene" && pass.value == "krabs"){
        var boat = document.getElementById("boatvid");
        boat.style.display = "block";
        boat.play();
    } else{
        user.value = "";
        pass.value = "";
        alert("Invalid username/password!");
    }
}

function playVid(){
    var burg = document.getElementById("burgvid");
    burg.style.display = "block";
    burg.play();
}

function pauseVid(){
    var burg = document.getElementById("burgvid");
    burg.style.display = "none";
    burg.pause();
}

function pauseVid2(){
    var boat = document.getElementById("boatvid");
    boat.style.display = "none";
    boat.pause();
}