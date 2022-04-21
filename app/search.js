function search(text) {
   fetch(`https://jtansaku-proxy.herokuapp.com/https://jisho.org/api/v1/search/words?keyword=${text}`)
      .then(response => response.json())
      .then((jsonData) => {
         console.log(jsonData);
      })
      .catch((error) => {
         console.error(error);
      })
}

export default search;