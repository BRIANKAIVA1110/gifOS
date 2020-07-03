//variables globales para poder mantener el ciclo de vida de los datos
let recorder = null;
let blob = null;
//#####################################################
(()=>{
    console.log();
    if(localStorage.getItem("temaKey")!=null)
        document.getElementById("estilo").href="../styles/"+localStorage.getItem("temaKey");

    
})()


function getStreamAndRecord () {
    navigator.mediaDevices.getUserMedia({ 
        audio: false,
        video: { 
            height: { max: 480 }
        }
    })
     .then(function(stream) {
        let objVideo= document.getElementById("video");
        objVideo.srcObject =stream;
        objVideo.play();
        
        //inicializo recordRTC
        recorder = RecordRTC(stream, {
            type: 'gif', 
            frameRate: 1, 
            quality: 10,
            width: 360, 
            hidden: 240,
            onGifRecordingStarted: function() {
                // console.log('started')
            },
        });
        recorder.startRecording();//comienzo recorder
    })
}


document.getElementById("btnGrabar").addEventListener("click",()=>{
    document.getElementById("video").style.display="block";
    document.getElementById("contenedorGif").style.display="none";
    getStreamAndRecord();
});

document.getElementById("btnStop").addEventListener("click",()=>{
    
    //funalizo recorder y le defino que hacer con el resultado(lo que se "grabo")
    recorder.stopRecording(function(){
        let result="";
        blob = recorder.getBlob();
        //blod = Binary Large Object
        //URL.createObjectURL -> recibe parametros blod o file-->(binarios). representa binarios en una url?
        result+= `<img id="contenedorGifGrabacion" src=${URL.createObjectURL(blob)} alt='giff'/>`;
        document.getElementById("video").style.display="none";
        document.getElementById("contenedorGif").style.display="block";
        document.getElementById("contenedorGif").innerHTML= result;
    });
    
});

//se muestra el "formulario de grabacion"
document.getElementById("btnComenzar").addEventListener("click",()=>{
    document.getElementById("panelVentanaTerminos").style.display="none";
    document.getElementById("panelVentanaGrabacion").style.display="block";
});

document.getElementById("btnCancelar").addEventListener("click",()=>{
    location.href="../index.html";
});


//cambio tema-> se puede usar "modules" para no replicar codigo... etc
/**
 * cambio tema color oscuro
 */
document.getElementById("itemTemaOscuro").addEventListener("click",(event)=>{
    document.getElementById("estilo").href=`../styles/oscuro.css`;
    localStorage.setItem("temaKey","oscuro.css");
});
/**
 * cambio tema color claro
 */
document.getElementById("itemTemaClaro").addEventListener("click",(event)=>{
    document.getElementById("estilo").href=`../styles/claro.css`;
    localStorage.setItem("temaKey","claro.css");
});