
const apiKey = "TMGSxnWlK9PpInWuG6JMNRCvys8lrEbb";

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * main
 */
(()=>{
    console.log("inicio")
    // document.getElementById("btnBuscar").disabled =true;
    obtenerResultadoSugenrencias("javascript");
    obtenerResultadoTendencias("coronavirus");
    if(localStorage.getItem("temaKey")!=null)
        document.getElementById("estilo").href=`../styles/${localStorage.getItem("temaKey")}`;
})();
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
/**
 * funcion busqueda
 * @param {*} search 
 */
function getSearchResults(search) { 
    const found = fetch(`http://api.giphy.com/v1/gifs/search?q=${search}&limit=18&api_key=${apiKey}`)
    .then((response) => {
        return response.json()
    }).then(data => {
        // return data
        // console.log("resultado de busqueda:");
        // console.log(data);
        data = data.data;
        let cuadrogif="";
        for (let i = 0; i < data.length; i++) {
            cuadrogif+= "<div class='cuadro-fig'>";
            cuadrogif+= `<img src="${data[i].images.original.url}" alt=""/>`;
            cuadrogif+= `<div class='cuadro-fig-titulo'> "${data[i].title}" </div>`;
            cuadrogif+= "</div>"
        }
        document.getElementById("resltadoContenedor").innerHTML=cuadrogif;
        
    }).catch((error) => {
        return error
    })
    return found
}
/**
 * funcion obtener sugerencia
 * @param {*} search 
 */
function obtenerResultadoSugenrencias(search) { 
    const found = fetch(`http://api.giphy.com/v1/gifs/search?q=${search}&limit=6&api_key=${apiKey}`)
    .then((response) => {
        return response.json()
    }).then(data => {
        // console.log("resultado de busqueda sugerencia:");
        // console.log(data);
        data = data.data;
        let cuadrogif="";
        for (let i = 0; i < data.length; i++) {
            cuadrogif+= "<div class='cuadro-fig'>";
            cuadrogif+= `<img src="${data[i].images.original.url}" alt=""/>`;
            cuadrogif+= `<div class='cuadro-fig-titulo'> "${data[i].title}" </div>`;
            cuadrogif+= "</div>";
        }
        document.getElementById("resultadoSugerencia").innerHTML = cuadrogif;
    }).catch((error) => {
        return error
    })
    return found
}

/**
 * funcion obtener tendencias
 * @param {*} search 
 */
function obtenerResultadoTendencias(search) { 
    const found = fetch(`http://api.giphy.com/v1/gifs/search?q=${search}&limit=6&api_key=${apiKey}`)
    .then((response) => {
        return response.json()
    }).then(data => {
        // console.log("resultado de busqueda sugerencia:");
        // console.log(data);
        data = data.data;
        let cuadrogif="";
        for (let i = 0; i < data.length; i++) {
            cuadrogif+= "<div class='cuadro-fig'>";
            cuadrogif+= `<img src="${data[i].images.original.url}" alt=""/>`;
            cuadrogif+= `<div class='cuadro-fig-titulo'> "${data[i].title}" </div>`;
            cuadrogif+= "</div>";
        }
        document.getElementById("resultadoTendencia").innerHTML = cuadrogif;
    }).catch((error) => {
        return error
    })
    return found
}

//https://api.giphy.com/v1/gifs/search/tags?q=
/**
 * funcion autocompletado
 * @param {*} search 
 */
function obtenerResultadoAutocompletado(search) { 
    const found = fetch(`https://api.giphy.com/v1/gifs/search/tags?q=${search}&limit=3&api_key=${apiKey}`)
    .then((response) => {
        return response.json()
    }).then(data => {
        // console.log("resultado de busqueda sugerencia:");
        // console.log(data);
        data = data.data;
        let itemAutoCompletado="";
        for (let i = 0; i < data.length; i++) {
            itemAutoCompletado+=`<li id="itemAutocompletado" onClick="eventoClickItemAutocompletado(event)">${data[i].name}</li>`; 
        }
        document.getElementById("resultadoAutocompletado").innerHTML = itemAutoCompletado;
    }).catch((error) => {
        return error
    })
    return found
}

//eventos
//busqueda
document.getElementById("btnBuscar").addEventListener("click",()=>{
    let valorBusqueda = document.getElementById("txtBusqueda").value;
    getSearchResults(valorBusqueda);//tituloBusqueda
    prepararMuestraDeResultados(valorBusqueda);
    console.log(`busqueda: ${valorBusqueda}`)
});

//keyup busqueda
document.getElementById("txtBusqueda").addEventListener("keyup",()=>{
    let valorBusqueda = document.getElementById("txtBusqueda").value;
    if(valorBusqueda.trim()!=""){
        document.getElementById("btnBuscar").disabled= false ;
        document.getElementsByClassName("cuadro-busqueda-resultados")[0].style.display="block";
    }
    else
    {
        document.getElementsByClassName("cuadro-busqueda-resultados")[0].style.display="none";
        document.getElementById("btnBuscar").disabled= true ;
    }
    // console.log(valorBusqueda);
    // console.log("resultado auto completado:")
    obtenerResultadoAutocompletado(valorBusqueda);
    
});

//click itemAutocompletado
function eventoClickItemAutocompletado(event){
    // console.log("resultado click itemAutocompletado:");
    // console.log(event.target.innerText);
    getSearchResults(event.target.innerText);
    prepararMuestraDeResultados(event.target.innerText);

}

/**
 * funcion quita elementos del dom para mostrar unicamente el resultado
 * @param {*} titulo : texto que se visualizara como encabezado de la busqueda
 */
function prepararMuestraDeResultados(titulo){
    document.getElementById("sugerencia").style.display="none";
    document.getElementById("tendencia").style.display="none";
    document.getElementById("resultadoBusqueda").style.display="block";
    document.getElementById("tituloBusqueda").innerText= titulo;
}

/**
 * cambio tema color oscuro
 */
document.getElementById("itemTemaOscuro").addEventListener("click",(event)=>{
    document.getElementById("estilo").href=`./styles/oscuro.css`;
    localStorage.setItem("temaKey","oscuro.css");
});
/**
 * cambio tema color claro
 */
document.getElementById("itemTemaClaro").addEventListener("click",(event)=>{
    document.getElementById("estilo").href=`./styles/claro.css`;
    localStorage.setItem("temaKey","claro.css");
});







