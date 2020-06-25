console.log("hola");

const apiKey = "TMGSxnWlK9PpInWuG6JMNRCvys8lrEbb";

function getSearchResults(search) { 
    const found = fetch('http://api.giphy.com/v1/gifs/search?q=' + search +
    '&api_key=' + apiKey)
    .then((response) => {
        return response.json()
    }).then(data => {
        return data
    }).catch((error) => {
        return error
    })

    return found
}
let result =  getSearchResults("argent");



