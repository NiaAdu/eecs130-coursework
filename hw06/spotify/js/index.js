const search = (ev) => {
    console.log(document.querySelector('input').value);
    let topic = (document.querySelector('input').value);
    let url = 'https://www.apitutor.org/spotify/simple/v1/search?q='+ topic + '&type=track';
    fetch(url)
        .then(response => response.json())
        .then(displayResults);
};

const displayResults = (data) => {
    console.log(data);
    for (result of data) {
      let template = `
        <div class="card">
          <img src = "${result.album.image_url}">
        </div>
        <div class="album-detail">
        <p>Song: ${result.name}<br>Album: ${result.album.name}<br>Artist: ${result.artist.name}<br><p>
        <iframe src="${result.preview_url}"></iframe>
        </div>
          `
      document.querySelector("#output").innerHTML += template;
    };
};



document.querySelector('#search').onclick = search;
