// Global Variables:
const serverURL = 'https://eecs-130-hw07.herokuapp.com/';
let activeCardID = -1
let appPhotos;
let activeUser;


// functions:
const loadCardListView = (imagesFromServer) => {
    // save to a global variable so this data will be
    // accessible to the other functions:
    appPhotos = imagesFromServer;

    //clear out old cards (if there are any):
    document.querySelector('.cards').innerHTML = '';

    // create new ones (based on photos list)
    let i = 0;
    for (image of appPhotos) {
        const template = `
            <li class="card" data-index="${i}">
                <div class="image" style="background-image:url('${image.image_url}')"></div>
            </li>`;
        i++;
        document.querySelector('.cards').innerHTML += template;
    }
    attachEventHandlers();
};

const buildUserMenu = (usersFromServer) => {
  console.log(usersFromServer);
  let i = 1;
  for (user of usersFromServer) {
    const template = `
    <option value = "${i}">${user.username}</option>
    `;
    i++;
    document.querySelector('#users').innerHTML += template;
  };
  document.querySelector('#users').onchange = filterByUser;
};

const getImagesFromServer = (querystring=null) => {
  let url = serverURL + 'photos';
  if(querystring){
    url += '?'+ querystring
  }
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then(loadCardListView);
};

const getUsersFromServer = () => {
    fetch(serverURL + 'users')
        .then((response) => {
            return response.json();
        })
        .then(buildUserMenu)
};

const filterByUser = () => {
  const querystring = 'user_id' + '=' + document.querySelector('#users').value;
  getImagesFromServer(querystring);
};

const getCurrentPhoto = () => {
    return appPhotos[activeCardID];
};

const loadCardDetailView = () => {
    const container = document.querySelector('.preview_box');
    const photoItem = getCurrentPhoto();
    const imageURL = `url("${photoItem.image_url}")`;
    container.querySelector('.featured_image').style.backgroundImage = imageURL;
    container.querySelector('.caption').innerHTML = getPhotoDetailTemplate(photoItem);
    document.querySelector('.like').onclick = likePhoto;

    // update CSS:
    container.classList.add('active');
    document.querySelector('main').style.overflow = 'hidden';
};

const showPhotoDetail = (e) => {
    activeCardID = parseInt(e.target.parentElement.getAttribute('data-index'));
    loadCardDetailView();
};

const formatDate = (date) => {
    date = new Date(date)
    return date.toDateString();
};

const getPhotoDetailTemplate = (photoItem, comments) => {
    let template = `
        <h2 class="title">${photoItem.title}</h2>
        <p class="handle">@${photoItem.username}</p>
        <p class="likes">Likes: ${photoItem.likes}</p>
        <p class="date">${formatDate(photoItem.date)}</p>`;
    if (!comments) {
        return template;
    }
    template += `
    <div class="comments">
        <h3>Comments</h3>
    </div>`;
};

const hidePhoto = (e) => {
    const container = document.querySelector('.preview_box');
    container.classList.remove('active');
    document.querySelector('main').style.overflow = 'auto';
};

const showNextPhoto = (e) => {
    ++activeCardID;
    if (activeCardID >= appPhotos.length) { activeCardID = 0; }
    loadCardDetailView();
};

const showPreviousPhoto = (e) => {
    --activeCardID;
    if (activeCardID < 0) { activeCardID = appPhotos.length - 1; }
    loadCardDetailView();
};

const likePhoto = () => {
  const photo = getCurrentPhoto();
  const url = serverURL + 'photos/' + photo.id;
  console.log(url);
  photo.likes = photo.likes + 1
  fetch (url, {
       method: 'PATCH',
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({
           "likes":photo.likes
       })
   })
   .then(response => response.json())
   .then(data => {
       console.log(data);
       loadCardDetailView(photo);
   });

};


const attachEventHandlers = () => {
    for (card of document.querySelectorAll('.image')) {
        card.onclick = showPhotoDetail;
    }
    document.querySelector('.close').onclick = hidePhoto;
    document.querySelector('.featured_image').onclick = showNextPhoto;
    // document.querySelector('.caption').onclick = showNextPhoto;
    document.querySelector('.next').onclick = showNextPhoto;
    document.querySelector('.prev').onclick = showPreviousPhoto;
    document.querySelector('.like').onclick = likePhoto;

};




// Initialize
getImagesFromServer();
getUsersFromServer();
