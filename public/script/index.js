const frame = document.querySelector(".frame");

const urlPage = window.location;
const searchParams = new URLSearchParams(new URL(urlPage).search);
const idCont = searchParams.get("id");
const idInt = parseInt(idCont);

const urlType = window.location;
const searchType = new URLSearchParams(new URL(urlType).search);
const typeCont = searchType.get("type");
const typeInt = parseInt(typeCont);
console.log(typeInt);


if(typeInt === 1){
    frame.innerHTML += `
<iframe src="//99.annacdn.cc/NR23LYzLlVs2/movie/${idInt}" width="640" height="480" frameborder="0" allowfullscreen></iframe>
`;
}else{
    frame.innerHTML += `
    <iframe src="//99.annacdn.cc/NR23LYzLlVs2/tv-series/${idInt}" width="640" height="480" frameborder="0" allowfullscreen></iframe>
    `;
}


