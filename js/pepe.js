//variables globales para poder mantener el ciclo de vida de los datos
let recorder = null;
let blob = null;
//#####################################################


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
    getStreamAndRecord();
});

document.getElementById("btnStop").addEventListener("click",()=>{
    let result="";
    //funalizo recorder y le defino que hacer con el resultado(lo que se "grabo")
    recorder.stopRecording(function(){
        let blob = recorder.getBlob();
        //blod = Binary Large Object
        //URL.createObjectURL -> recibe parametros blod o file-->(binarios). representa binarios en una url?
        result+= `<img id="contenedorGifGrabacion" src=${URL.createObjectURL(blob)} alt='giff'/>`;
        document.getElementById("contenedorGif").innerHTML= result;
    });
    
});