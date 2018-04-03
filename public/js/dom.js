

//
//
// const axios = require("axios");
//
// var linkpreview = function(url) {
//   const endpoint = "https://api.linkpreview.net?key=5ac21d311be5e7e5c43aee3b770da0c9be62c298971cc&q=";
//   const query =
//     endpoint + url;
//   axios
//   .get(query)
//   .then(response => {
//       console.log(response.data);
//       return response.data;
//     })
//     .catch(error => {
//       // console.log(error);
//       return {title:null, description:null, image:null, url:null};
//     });
// }
//
// var buttons = document.querySelectorAll('button');
// buttons.forEach(function(button) {
//   console.log(parseInt(button.id));
//   button.addEventListener('click', function(){
//     var img = document.createElement('img');
//     img.src = linkpreview("www.google.com").image;
//     // img.src = "http://studenthustle.co/wp-content/uploads/2017/08/nathan-anderson-268995-1152x759.jpg";
//     button.parentNode.appendChild(img);
//   });
// });
