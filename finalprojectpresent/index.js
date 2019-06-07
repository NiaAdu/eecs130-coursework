const scrollToNav = (e) => {
    var elmnt = document.getElementById("nav");
    elmnt.scrollIntoView();
  }

document.querySelector('.button').onclick = scrollToNav;
