var selected;

$(document).ready(function(){
    
 

$(window).bind('mousewheel DOMMouseScroll', function (event) {
       if (event.ctrlKey == true) {
       event.preventDefault();
       }
});
    
     $('#sales-table').DataTable({
        scrollY : "700px",
        "scrollCollapse": true
     });
    
    initialize();
    
    $("#addnewfile").on('click', function() {
       $("#file-upload").click();
    });
    
    $("#file-upload").on('change',function(){
        loadFile();
    })
    
    $("#logout").on('click',function(){
        logout();
    })
    
    $("#dashboard").on({
        mouseover: function () {
            if(selected != 'dashboard'){
                hover("dashboard");
            }
        },
        
        click: function () {
            if(selected != "dashboard"){
                select("dashboard");
            }
        },
        
        mouseout: function(){
            if(selected != 'dashboard'){
                $('#dashboard').find('#dashtxt').css('color', '#a8acb1');
                $('#dashboard').find('#dashboard-icon').css('opacity', '0.6');
            }
        }
    });
    
    $("#sales").on({
        mouseover: function () {
            if(selected != 'sales'){
                hover("sales");
            }
        },
        
        click: function () {
            if(selected != 'sales'){
                select("sales");
            }
        },
        
        mouseout: function(){
            if(selected != 'sales'){
                $('#sales').find('#salestxt').css('color', '#a8acb1');
                $('#sales').find('#sales-icon').css('opacity', '0.6');
            }
        }
    });
    
    $("#dailysales").on({
        mouseover: function () {
            if(selected != 'dailysales'){
                hover("dailysales");
            }
        },
        
        click: function () {
            if(selected != 'dailysales'){
                select("dailysales");
            }
        },
        
        mouseout: function(){
            if(selected != 'dailysales'){
                $('#dailysales').find('#dailysalestxt').css('color', '#a8acb1');
                $('#dailysales').find('#dailysales-icon').css('opacity', '0.6');
            }
        }
    });
    
});

function logout() {
    var con = confirm("Are you sure you want to logout?")
    if(con == true){
        window.location="index.html";
    }
}

function initialize(){
    console.log("kek");
    selected = "dashboard";
    initializeData();
    
}

function initializeData(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        var ourData = JSON.parse(req.responseText); 
          for(var key in ourData.sales){
              if(ourData.sales.hasOwnProperty(key)){
                  $('#sales-table').DataTable().row.add([
                        key,
                        ourData.sales[key].burger,
                        ourData.sales[key].species,
                        ourData.sales[key].datetime
                  ])
                  .draw();
              }
          }
          drawgraphs(ourData);
      }
    };

    req.open("GET", "https://api.jsonbin.io/b/5d25f006b7cb9867128888a8", true);
    req.setRequestHeader("secret-key","$2a$10$oskxaRF2fNNXodUSh1m34OvLaA2ybhmxUTW3TegXvMZW5r9x5iMCm");
    req.send();
}

function updateData(data){
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        var ourData = JSON.parse(req.responseText);
          for(var key in data.sales){
                var burger = data.sales[key].burger;
                var species = data.sales[key].species;
              if(data.sales.hasOwnProperty(key)){
                  ourData.sales[key] = {
                  "datetime": data.sales[key].datetime,
                  "burger": data.sales[key].burger,
                  "species": data.sales[key].species
                };
              }
              ourData.burger_sales[burger] += 1;
              ourData.species_sales[species] += 1;
              ourData.burger_by_species[burger][species] += 1;
          }
          putData(ourData);
      }
    };

    req.open("GET", "https://api.jsonbin.io/b/5d25f006b7cb9867128888a8", true);
    req.setRequestHeader("secret-key","$2a$10$oskxaRF2fNNXodUSh1m34OvLaA2ybhmxUTW3TegXvMZW5r9x5iMCm");
    req.send();
}

function putData(adata){
    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
        console.log('done upload');
        updategraphdata();
    }
    };

    req.open("PUT", "https://api.jsonbin.io/b/5d25f006b7cb9867128888a8", true);
    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("secret-key", "$2a$10$oskxaRF2fNNXodUSh1m34OvLaA2ybhmxUTW3TegXvMZW5r9x5iMCm");
    req.setRequestHeader("versioning", "false");
    req.send(JSON.stringify(adata));
}

function loadFile() {
    
    var files,fr,kek,finside;

    files = document.getElementById('file-upload').files;
    
    if(files.length === 1){
        fr = new FileReader();
        fr.readAsText(files[0]);
        fr.onload = receivedText;
    }
    else{
        var reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = function(e) {
            let lines = e.target.result;
            kek = JSON.parse(lines); 
            updateData(kek);
        };
        
        for(var i = 0; i < files.length; i++){
                fr = new FileReader();
                fr.readAsText(files[i]);
                fr.onload = processmultiple;
        }
    }
        
    
    function receivedText(e) {
        let lines = e.target.result;
        var newArr = JSON.parse(lines); 
            for(var key in newArr.sales){
              if(newArr.sales.hasOwnProperty(key)){
                  $('#sales-table').DataTable().row.add([
                        key,
                        newArr.sales[key].burger,
                        newArr.sales[key].species,
                        newArr.sales[key].datetime
                  ])
                  .draw();
              }
          }
        updateData(newArr);
    }
    
    function processmultiple(e) {
        let lines = e.target.result;
        var newArr = JSON.parse(lines); 
            for(var key in newArr.sales){
              if(newArr.sales.hasOwnProperty(key)){
                  $('#sales-table').DataTable().row.add([
                        key,
                        newArr.sales[key].burger,
                        newArr.sales[key].species,
                        newArr.sales[key].datetime
                  ])
                  .draw();
                  
                kek.sales[key] = {
                  "datetime": newArr.sales[key].datetime,
                  "burger": newArr.sales[key].burger,
                  "species": newArr.sales[key].species
                };
              }
          }
    }
    
  }

function updategraphdata(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        var ourData = JSON.parse(req.responseText); 
         
          drawgraphs(ourData);
      }
    };

    req.open("GET", "https://api.jsonbin.io/b/5d25f006b7cb9867128888a8", true);
    req.setRequestHeader("secret-key","$2a$10$oskxaRF2fNNXodUSh1m34OvLaA2ybhmxUTW3TegXvMZW5r9x5iMCm");
    req.send();
}

function drawgraphs(salesdata){
    Chart.defaults.global.defaultFontFamily = 'nunito';
    Chart.defaults.global.defaultFontColor = 'black';
    let grubcanvas = document.getElementById('grubchart').getContext('2d');
    var chart = new Chart(grubcanvas, {
    type: 'bar',
    data: {
        labels: ['Krabby Pattie', 'Krusty Combo', 'Krusty Deluxe'],
        datasets: [{
            label: 'Sales',
            backgroundColor: '#00acac',
            borderColor: '#2d353c',
            data: [salesdata.burger_sales["Krabby Pattie"], salesdata.burger_sales["Krusty Combo"], salesdata.burger_sales["Krusty Deluxe"]]
        }]
    },
    options: { responsive:true,
    maintainAspectRatio: false
            }
});
    
    let krabbiepattycanvas = document.getElementById('pattiechart').getContext('2d');
    var chart = new Chart(krabbiepattycanvas, {
    type: 'bar',

    data: {
        datasets: [{
            label: 'Species',
            data: [salesdata.burger_by_species["Krabby Pattie"]["sea lion"], 
                   salesdata.burger_by_species["Krabby Pattie"]["gray whale"], 
                   salesdata.burger_by_species["Krabby Pattie"]["giant clam"], 
                   salesdata.burger_by_species["Krabby Pattie"]["coral"], 
                   salesdata.burger_by_species["Krabby Pattie"]["seahorse"], 
                   salesdata.burger_by_species["Krabby Pattie"]["salmon"], 
                   salesdata.burger_by_species["Krabby Pattie"]["leatherback turtle"]],
            backgroundColor: '#00acac',
            borderColor: '#2d353c'
        }],
        labels: ['Sea Lion', 'Gray Whale', 'Giant Clam', 'Coral', 'Sea Horse', 'Salmon', 'Leatherback Turtle']
    },

    
    options: {
        responsive:true,
        maintainAspectRatio: false
    }
});
    
    let krustycombocanvas = document.getElementById('combochart').getContext('2d');
    var chart = new Chart(krustycombocanvas, {
    type: 'bar',

    data: {
        datasets: [{
            label: 'Species',
            data: [salesdata.burger_by_species["Krusty Combo"]["sea lion"], 
                   salesdata.burger_by_species["Krusty Combo"]["gray whale"], 
                   salesdata.burger_by_species["Krusty Combo"]["giant clam"], 
                   salesdata.burger_by_species["Krusty Combo"]["coral"], 
                   salesdata.burger_by_species["Krusty Combo"]["seahorse"], 
                   salesdata.burger_by_species["Krusty Combo"]["salmon"], 
                   salesdata.burger_by_species["Krusty Combo"]["leatherback turtle"]],
            backgroundColor: '#00acac',
            borderColor: '#2d353c'
        }],
        labels: ['Sea Lion', 'Gray Whale', 'Giant Clam', 'Coral', 'Sea Horse', 'Salmon', 'Leatherback Turtle']
    },

    
    options: {
        responsive:true,
        maintainAspectRatio: false
    }
});
    
    let krustydeluxecanvas = document.getElementById('deluxechart').getContext('2d');
    var chart = new Chart(krustydeluxecanvas, {
    type: 'bar',

    data: {
        datasets: [{
            label: 'Species',
            data: [salesdata.burger_by_species["Krusty Deluxe"]["sea lion"], 
                   salesdata.burger_by_species["Krusty Deluxe"]["gray whale"], 
                   salesdata.burger_by_species["Krusty Deluxe"]["giant clam"], 
                   salesdata.burger_by_species["Krusty Deluxe"]["coral"], 
                   salesdata.burger_by_species["Krusty Deluxe"]["seahorse"], 
                   salesdata.burger_by_species["Krusty Deluxe"]["salmon"], 
                   salesdata.burger_by_species["Krusty Deluxe"]["leatherback turtle"]],
            backgroundColor: '#00acac',
            borderColor: '#2d353c'
        }],
        labels: ['Sea Lion', 'Gray Whale', 'Giant Clam', 'Coral', 'Sea Horse', 'Salmon', 'Leatherback Turtle']
    },

    
    options: {
        responsive:true,
        maintainAspectRatio: false
    }
});
    let hourcanvas = document.getElementById('hourchart').getContext('2d');
    var chart = new Chart(hourcanvas, {
    type: 'bar',

    data: {
        labels: ['Sea Lion', 'Gray Whale', 'Giant Clam', 'Coral', 'Sea Horse', 'Salmon', 'Leatherback Turtle'],
        datasets: [{
            label: 'Species',
            backgroundColor: '#00acac',
            borderColor: '#2d353c',
            data: [
                    salesdata.species_sales["sea lion"],
                    salesdata.species_sales["gray whale"],
                    salesdata.species_sales["giant clam"],
                    salesdata.species_sales["coral"],
                    salesdata.species_sales["seahorse"],
                    salesdata.species_sales["salmon"],
                    salesdata.species_sales["leatherback turtle"]
                  ]
        }]
    },

    options: {
        responsive:true,
        maintainAspectRatio: false
    }
});
    $('#charts').css('display','flex');
    $('#loader').css('display','none');
   
}

function hover(text){

    if(text === "sales"){
        $('#sales').find('#salestxt').css('color', 'white');
        $('#sales').find('#sales-icon').css('opacity', '1');
    }
    else if(text === "dashboard"){
        $('#dashboard').find('#dashtxt').css('color', 'white');
        $('#dashboard').find('#dashboard-icon').css('opacity', '1');
    }
    else if(text === "dailysales"){
        $('#dailysales').find('#dailysalestxt').css('color', 'white');
        $('#dailysales').find('#dailysales-icon').css('opacity', '1');
    }
}

function updatedailydata(){
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
      if (req.readyState == XMLHttpRequest.DONE) {
        var ourData = JSON.parse(req.responseText); 
         
          loaddaily(ourData);
      }
    };

    req.open("GET", "https://api.jsonbin.io/b/5d25f006b7cb9867128888a8", true);
    req.setRequestHeader("secret-key","$2a$10$oskxaRF2fNNXodUSh1m34OvLaA2ybhmxUTW3TegXvMZW5r9x5iMCm");
    req.send();
}

function loaddaily(salesdata){
    var jan = 0;
    var feb = 0;
    var mar = 0;
    var apr = 0;
    var may = 0;
    var jun = 0;
    var july = 0;
    var aug = 0;
    var sept = 0;
    var oct = 0;
    var nov = 0;
    var dec = 0;
    
    
    for(var key in salesdata.sales){
        if(salesdata.sales.hasOwnProperty(key)){
            var s = salesdata.sales[key].datetime;
            var bits = s.split(/\D/);
            var date = new Date(bits[0], --bits[1], bits[2], bits[3], bits[4]);
            switch(date.getMonth()){
                case 0 : jan += 1;
                        break;
                case 1 : feb += 1;
                        break;
                case 2 : mar += 1;
                        break;
                case 3 : apr += 1;
                        break;
                case 4 : may += 1;
                        break;
                case 5 : jun += 1;
                        break;
                case 6 : july += 1;
                        break;
                case 7 : aug += 1;
                        break;
                case 8 : sept += 1;
                        break;
                case 9 : oct += 1;
                        break;
                case 10 : nov += 1;
                        break;
                case 11 : dec += 1;
                        break;
            }
        }
    }
    
    
    Chart.defaults.global.defaultFontFamily = 'nunito';
    Chart.defaults.global.defaultFontColor = 'black';
    let grubcanvas = document.getElementById('dailyylinechart').getContext('2d');
    var chart = new Chart(grubcanvas, {
    type: 'line',
    data: {
        labels: ['January', 'February', 'March','April','May','June','July','August','September','October','November','December'],
        datasets: [{
            label: 'Sales',
            backgroundColor: '#00acac',
            borderColor: '#2d353c',
            data: [jan,feb,mar,apr,may,jun,july,aug,sept,oct,nov,dec]
        }]
    },
    options: { responsive:true,
            }
});
    
}

function select(text){
    if(text === "sales"){
        selected = 'sales';
        deselect("dashboard");
        deselect("dailysales");
        $('#table').css('display','flex');
        $('#sales').find('#salestxt').css('color', 'white');
        $('#sales').find('#sales-icon').attr('src', "Images/Sales%20Icon%20Selected.png");
        $('#sales').css('background-color', '#242a31');
        $('#dashboard').find('#dashboard-icon').css('opacity', '0.6');
        $('#dailysales').find('#sales-icon').css('opacity', '0.6');
        
    }
    else if (text === "dashboard"){
        selected = "dashboard";
        deselect("sales");
        deselect("dailysales");
        $('#charts').css('display','flex');
        $('#dashboard').find('#dashtxt').css('color', 'white');
        $('#dashboard').find('#dashboard-icon').attr('src', "Images/Bar%20Icon%20Selected.png");
        $('#dashboard').css('background-color', '#242a31');
        $('#sales').find('#sales-icon').css('opacity', '0.6');
        $('#dailysales').find('#sales-icon').css('opacity', '0.6');
    }
    else if (text === "dailysales"){
        selected = "dailysales";
        deselect("sales");
        deselect("dashboard");
        $('#linegraph').css('display','flex');
        updatedailydata();
        $('#dailysales').find('#dashtxt').css('color', 'white');
        $('#dailysales').find('#dailysales-icon').attr('src', "Images/Dashboard%20Icon%20Selected.png");
        $('#dailysales').css('background-color', '#242a31');
        $('#dashboard').find('#dashboard-icon').css('opacity', '0.6');
        $('#sales').find('#sales-icon').css('opacity', '0.6');
    }
}

function deselect(text){
    if(text === "dashboard"){
        $('#charts').css('display','none');
        $('#dashboard').find('#dashtxt').css('color', '#a8acb1');
        $('#dashboard').find('#dashboard-icon').css('opacity', '0.6');
        $('#dashboard').find('#dashboard-icon').attr('src', "Images/Bar%20Icon.png");
        $('#dashboard').css('background-color', '#2d353c');
        
    }
    else if (text === "sales"){
        $('#table').css('display','none');
        $('#sales').find('#salestxt').css('color', '#a8acb1');
        $('#sales').find('#sales-icon').css('opacity', '0.6');
        $('#sales').find('#sales-icon').attr('src', "Images/Sales%20Icon.png");
        $('#sales').css('background-color', '#2d353c');
        
    }
    
    else if (text === "dailysales"){
        $('#linegraph').css('display','none');
        $('#dailysales').find('#dailysalestxt').css('color', '#a8acb1');
        $('#dailysales').find('#dailysales-icon').css('opacity', '0.6');
        $('#dailysales').find('#dailysales-icon').attr('src', "Images/Dashboard%20Icon.png");
        $('#dailysales').css('background-color', '#2d353c');
        
    }
}

