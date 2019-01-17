// Global variables

// Set default text on canvas
let canv = document.getElementById("preview") ;
let ctx = canv.getContext("2d");
ctx.font = "30px Arial";
ctx.fillStyle = "gray";
ctx.textAlign = "center"
ctx.fillText("No image selected", canv.width/2 , canv.height/2);

function reset(){
    document.location.reload(true);
    document.getElementById("prog_bar").value = 0;
}

function fb0(){
    let d = {"file":document.getElementById("fileinput").value};

    $.ajax({
        type : 'POST',
        url : '/set_original',
        contentType: 'application/json;charset=UTF-8',
        data : JSON.stringify(d),
        success : ()=>{
                paint_image('orig');            
                document.getElementById("b1").disabled = false;
            },
        error : function(error){console.log(error);}
        
      });

      document.getElementById("prog_bar").value = 1;

}

function fb1(){
    let d = {"file":document.getElementById("fileinput").value};

    $.ajax({
        type : 'POST',
        url : '/process_image',
        contentType: 'application/json;charset=UTF-8',
        data : JSON.stringify(d),
        success : after_filepath,
        error : function(error){console.log(error);}
        
      });

}

function after_filepath(response){ // After filepath has been submitted
    document.getElementById("prog_bar").value = 2;
    console.log(response);
    document.getElementById("instructions").innerHTML = "File uploaded successfully ! <br> Trying to detect the paper automatically. <br> Is the detection correct ?";
    $('#fileinput').remove();
    $('#b0').remove();
    $('#b1').remove();

    // Add yes button
    let controls = document.getElementById("controls");
    let yes_btn = document.createElement("button");
    yes_btn.id = "yes_btn";
    yes_btn.classList.add("mybtn");
    yes_btn.onclick = yesC;
    yes_btn.appendChild(document.createTextNode("Yes"));
    controls.appendChild(yes_btn);

    // Add no button
    let no_btn = document.createElement("button");
    no_btn.id = "no_btn";
    no_btn.classList.add("mybtn");
    no_btn.onclick = noC;
    no_btn.appendChild(document.createTextNode("No"));
    controls.appendChild(no_btn);

    paint_image('auto');
 
}

function yesC(){ // if yes is clicked
    document.getElementById("prog_bar").value = 3;

    $.ajax({
        type : 'POST',
        url : '/orient',
        contentType: 'application/json;charset=UTF-8',
        data : JSON.stringify({"thresh":"no"}),
        success : ()=>{paint_image('final')},
        error : (error)=>{console.log(error);}
      });

      // Delete yes/no buttons and add new ones
      $('#yes_btn').remove();
      $('#no_btn').remove();

      // CHange "instructions" text
      document.getElementById("instructions").innerHTML = "Change the orientation of the image using the buttons";

      // Add flip_h button
      let controls = document.getElementById("controls");
      let flip_h = document.createElement("button");
      flip_h.id = "flip_h";
      flip_h.classList.add("mybtn");
      flip_h.onclick = ()=>{flip({"flip":"H"});};
      flip_h.appendChild(document.createTextNode("Flip horizontally"));
      controls.appendChild(flip_h);

      // Add flip_v button
      let flip_v = document.createElement("button");
      flip_v.id = "flip_v";
      flip_v.classList.add("mybtn");
      flip_v.onclick = ()=>{flip({"flip":"V"});};
      flip_v.appendChild(document.createTextNode("Flip vertically"));
      controls.appendChild(flip_v);

      // Add buttons to side panel
    let filter = document.createElement("button");
    filter.id="filterbtn";
    filter.classList.add("sidebtn");
    filter.innerHTML = "Apply Filter";
    filter.title = "Toggle Adaptive Gaussian threshold filter";
    document.getElementById("parameters").appendChild(filter);
    filter.onclick = ()=>{fblur_btn();}
}

function fblur_btn(){
    var btn = document.getElementById("filterbtn");
    if (btn.innerHTML == "Apply Filter") {
        var msg = {"thresh":"yes"};
        btn.innerHTML = "Release Filter";
        btn.classList.add("sidebtn_toggle");
        create_hyperparameters();
      }  else {
        var msg = {"thresh":"no"};
        btn.innerHTML = "Apply Filter";
        btn.classList.remove("sidebtn_toggle");
      }

      $.ajax({
        type : 'POST',
        url : '/orient',
        contentType: 'application/json;charset=UTF-8',
        data : JSON.stringify(msg),
        success : ()=>{paint_image('final')},
        error : (error)=>{console.log(error);}
      });

}

function create_hyperparameters(){ // function to make sliders


}

function noC(){ // if no is clicked, take coordinates manually

}

function flip(data){ // Flip image
    $.ajax({
        type : 'POST',
        url : '/flip',
        contentType: 'application/json;charset=UTF-8',
        data : JSON.stringify(data),
        success : ()=> {paint_image('final');},
        error : function(error){console.log(error);}
        
      });

}

function paint_image(which){
    let preview = document.getElementById("preview");
    var ctx = preview.getContext("2d");
    ctx.clearRect(0, 0, preview.width, preview.height);
    var img = new Image();
    img.src = '/get_image?t='+new Date().getTime() +'&which='+which;
            
    img.onload = function () {  
                var hRatio = preview.width / img.width    ;
                var vRatio = preview.height / img.height  ;
                var ratio  = Math.min ( hRatio, vRatio );
                var centerShift_x = ( preview.width - img.width*ratio ) / 2;
                var centerShift_y = ( preview.height - img.height*ratio ) / 2;
                ctx.clearRect(0,0,preview.width, preview.height);
                ctx.drawImage(img, 0,0, img.width, img.height,
                    centerShift_x,centerShift_y,img.width*ratio, img.height*ratio); 

            };
}
