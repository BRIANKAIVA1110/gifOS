//variables globales para poder mantener el ciclo de vida de los datos
let recorder = null;
let blob = null;
let form = new FormData();
//#####################################################
/**
 * int--> main function 
 * */
(()=>{
    document.getElementById("btnStop").style.display="none";
    document.getElementById("btnVolverIntentar").style.display="none";
    document.getElementById("btnGuardar").style.display="none";

    if(localStorage.getItem("temaKey")!=null)
        document.getElementById("estilo").href="../styles/"+localStorage.getItem("temaKey");

    getStreamAndRecord();//inicia camara
})()


function getStreamAndRecord (comenzarGrabando=false) {
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
        if(comenzarGrabando)
        {
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
        }
    })
}

/**
 * procedimiento grabar/capturar
 */
document.getElementById("btnGrabar").addEventListener("click",()=>{
    document.getElementById("btnStop").disabled=false;
    document.getElementById("video").style.display="block";
    document.getElementById("contenedorGif").style.display="none";
    getStreamAndRecord(true);//"inicia camara y traba"
    document.getElementById("btnGrabar").style.display="none";
    document.getElementById("btnStop").style.display="block";
});

/**
 * procedimiento parar captura
 */
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
    //
    
    document.getElementById("btnStop").style.display="none";
    document.getElementById("btnVolverIntentar").style.display="block";
    document.getElementById("btnGuardar").style.display="block";
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


/**
 * 
 */

document.getElementById("btnGuardar").addEventListener("click", ()=>{
    
    form.append('file3', recorder.getBlob(), 'myGif.gif'); 
    form.pos

});

/**
 * cuando se hace click en btnVolverIntentar en panelVentanaGrabacion
 */
document.getElementById("btnVolverIntentar").addEventListener("click", ()=>{
    document.getElementById("btnVolverIntentar").style.display="none";
    document.getElementById("btnGuardar").style.display="none";
    document.getElementById("btnStop").style.display="none";
    document.getElementById("btnGrabar").style.display="block";
    document.getElementById("video").style.display="block";
    document.getElementById("contenedorGif").style.display="none";
});

/**
 * cuando se hace click en cancelar en panelVentanaUpLoad
 */
document.getElementById("btnCancelarUpload").addEventListener("click",()=>{
    document.getElementById("panelVentanaUpLoad").style.display="none";
    document.getElementById("panelVentanaGrabacion").style.display="block";
});
/**
 * cuando se hace click en listo en panelVentanaUpLoadOKK
 */
document.getElementById("btnlisto").addEventListener("click",()=>{
    document.getElementById("panelVentanaUpLoadOKK").style.display="none";
    document.getElementById("panelVentanaGrabacion").style.display="block";
    document.getElementById("btnVolverIntentar").style.display="none";
    document.getElementById("btnGuardar").style.display="none";
    document.getElementById("btnStop").style.display="none";
    document.getElementById("btnGrabar").style.display="block";
    document.getElementById("video").style.display="block";
    document.getElementById("contenedorGif").style.display="none";
});

/**
 * cuando se hace click en btnGuardar en panelVentanaGrabacion
 */
document.getElementById("btnGuardar").addEventListener("click",()=>{
    document.getElementById("panelVentanaUpLoad").style.display="block";
    document.getElementById("panelVentanaGrabacion").style.display="none";
    setTimeout(()=>{
        document.getElementById("panelVentanaUpLoad").style.display="none";
        document.getElementById("panelVentanaUpLoadOKK").style.display="block";
        console.log("pepepepepepepepe")

    },4000)
});