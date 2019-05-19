const search = (ev) => {
    console.log(document.querySelector('input').value);
    let topic = document.querySelector('input').value;
    let url = 'https://www.apitutor.org/twitter/simple/1.1/search/tweets.json?q=' + topic;
    fetch(url)
        .then(response => response.json())
        .then(displayResults);
};

const displayResults = (data) => {
    console.log(data);
    for (tweet of data) {
      let template = `
      <div class="tweet-detail">
      <p>@${tweet.screen_name}<br>${tweet.text}<br>${tweet.retweet_count}<br><p>
      </div>  `
      document.querySelector('#output').innerHTML += template;
    };

};

document.querySelector('#search').onclick = search;
