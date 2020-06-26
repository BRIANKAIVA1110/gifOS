console.log("hola");

const apiKey = "TMGSxnWlK9PpInWuG6JMNRCvys8lrEbb";

function getSearchResults(search) { 
    const found = fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey)
    .then((response) => {
        return response.json()
    }).then(data => {
        // return data
        data = data.data;
        let cuadrogif="";
        for (let i = 0; i < data.length; i++) {
            cuadrogif+= "<div class='cuadro-fig'>";
            cuadrogif+= `<img src="${data[i].images.original.url}" alt="">`;
            cuadrogif+= "</div>"
        }
        document.getElementById("resltadoContenedor").innerHTML=cuadrogif;
    }).catch((error) => {
        return error
    })
    return found
}


//eventos

document.getElementById("btnBuscar").addEventListener("click",()=>{
    let valorBusqueda = document.getElementById("txtBusqueda").value;
    getSearchResults(valorBusqueda);
    console.log(`busqueda: ${valorBusqueda}`)
});






