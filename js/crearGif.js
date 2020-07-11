//variables globales para poder mantener el ciclo de vida de los datos
const apiKey = "TMGSxnWlK9PpInWuG6JMNRCvys8lrEbb";
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
 * cuando se hace click en btnVolverIntentar en panelVentanaGrabacion
 */
document.getElementById("btnVolverIntentar").addEventListener("click", ()=>{
    mostrarPanelGrabacion();
});

/**
 * cuando se hace click en cancelar en panelVentanaUpLoad
 */
document.getElementById("btnCancelarUpload").addEventListener("click",()=>{
    mostrarPanelGrabacion();
});
/**
 * cuando se hace click en listo en panelVentanaUpLoadOKK
 */
document.getElementById("btnlisto").addEventListener("click",()=>{
    mostrarPanelGrabacion();
    obtenerMisGifs();
    
});
function obtenerMisGifs(){
    let ids=[];
    for(var i=0;i<localStorage.length;i++)
    if(localStorage.key(i).includes("gifpepe")){
        ids.push(localStorage.getItem(localStorage.key(i)))
    }
    ids = ids.join(",");
    console.log(`resultado get localstorage: ${ids}`);
    let pepe = fetch(`https://api.giphy.com/v1/gifs?api_key=${apiKey}&ids='${ids}'`)
    .then((data)=>{
        console.log(data);
        return data.json();
    })
    .then((data)=>{
        console.log("resultado get my gif");
        console.log(data.data);/*array con el resultado de la busquedas*/ 
        let gifs= data.data;
        mostrarPanelMisGifs(gifs);
    })
    .catch((error)=>{
        console.log(error);
    });
}

function mostrarPanelMisGifs(gifs){
    let cuadrogif="";
    for (let i = 0; i < gifs.length; i++) {
        cuadrogif+= "<div class='cuadro-fig'>";
        cuadrogif+= `<img src="${gifs[i].images.original.url}" alt="my gif"/>`;
        cuadrogif+= "</div>"
    }
    document.getElementById("contenedorMisGif").innerHTML=cuadrogif;
}


/**
 * cuando se hace click en btnGuardar en panelVentanaGrabacion
 */
document.getElementById("btnGuardar").addEventListener("click", ()=>{
    
    mostrarPanelUploading();

    let form = new FormData();
    form.append('file',blob,"pepe.gif");

    let result = fetch(`https://upload.giphy.com/v1/gifs?api_key=${apiKey}`, 
    {
        method: 'post',
        body: form
    }).then((data)=>{
        
        if(data.status==200){
            console.log(`status 200`);
            console.log(data);
            mostrarPanelOk();
        }else
        {
            console.log(`status !=200`);
            console.log(data);
            mostrarPanelGrabacion();
            alert("algo ocurrio mal???")
        }
        return data.json();
    }).then((data)=>{
        console.log("body");
        console.log(data.data.id);//este id se debe guardar para luego consultar a la api, ademas guardarlo en el app storage
        localStorage.setItem(`gifpepe${parseInt(Math.random()*1000000)}`,data.data.id);

    }).catch(error => {
        console.log(error);
        alert("Hubo en problema al grabar el gif, vuelva a intentarlo.");
        mostrarPanelGrabacion();
    });

});

function mostrarPanelUploading(){
    document.getElementById("panelVentanaUpLoad").style.display="block";
    document.getElementById("panelVentanaGrabacion").style.display="none";
}
function mostrarPanelGrabacion(){
    document.getElementById("panelVentanaUpLoadOKK").style.display="none";
    document.getElementById("panelVentanaUpLoad").style.display="none";
    document.getElementById("panelVentanaGrabacion").style.display="block";
    document.getElementById("btnVolverIntentar").style.display="none";
    document.getElementById("btnGuardar").style.display="none";
    document.getElementById("btnStop").style.display="none";
    document.getElementById("btnGrabar").style.display="block";
    document.getElementById("video").style.display="block";
    document.getElementById("contenedorGif").style.display="none";
}
function mostrarPanelOk(){
    let panelContenerGif = document.getElementById("contenedorgifcreado");
    document.getElementById("panelVentanaUpLoad").style.display="none";
    document.getElementById("panelVentanaUpLoadOKK").style.display="block";

    panelContenerGif.innerHTML=`<img src=${URL.createObjectURL(recorder.getBlob())} style="width:100%; height:100%;" alt="gif creado"/>`
}
function ocultarPaneles(){
    document.getElementById("panelVentanaUpLoad").style.display="none";
    document.getElementById("panelVentanaUpLoadOKK").style.display="none";
    document.getElementById("panelVentanaGrabacion").style.display="none";
    document.getElementById("panelVentanaTerminos").style.display="none";
}
document.getElementById("btnMiGuif").addEventListener("click",()=>{
    ocultarPaneles();
    obtenerMisGifs();
})