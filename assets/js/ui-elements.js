function clickNav(clicked_id) {
    divIdString = clicked_id.substring(7)

    document.getElementById("Home").classList.add("inactive")
    document.getElementById("Talks").classList.add("inactive");
    document.getElementById("Visits").classList.add("inactive");

    document.getElementById("Home").classList.remove("active");
    document.getElementById("Talks").classList.remove("active");
    document.getElementById("Visits").classList.remove("active");

    document.getElementById(divIdString).classList.remove("inactive");
    document.getElementById(divIdString).classList.add("active");


    document.getElementById("navbar-Home").classList.remove("navbar-active");
    document.getElementById("navbar-Talks").classList.remove("navbar-active");
    document.getElementById("navbar-Visits").classList.remove("navbar-active");
    document.getElementById(clicked_id).classList.add("navbar-active");

    if(clicked_id=="navbar-Talks"){
        document.getElementById("subscribe-holder").classList.add("subscribe-active");
        document.getElementById("subscribe-holder").classList.remove("subscribe-inactive");
    } else{
        document.getElementById("subscribe-holder").classList.remove("subscribe-active");
        document.getElementById("subscribe-holder").classList.add("subscribe-inactive");
    }

}

function setHash(clicked_id){
    divIdString = clicked_id.substring(7);
    const navTitle = document.title;
    const navUrl = window.location.origin + window.location.pathname + window.location.search + "#"+ divIdString;
    let contentUrl;
    const indexOfIndex = window.location.pathname.indexOf("index.html");
    if(indexOfIndex==-1){
        contentUrl = window.location.origin + window.location.pathname + 'content/'
    } else {
        contentUrl = window.location.origin + window.location.pathname.substr(0,indexOfIndex) + 'content/'
    }

    const navState = {"title":navTitle,"url":navUrl,"contentUrl":contentUrl};

    history.pushState(navState, navTitle, navUrl);
}

//Touch

function oneRingToSwipemAll(){
    //right-swipe on Home
    document.getElementById('Home').addEventListener('swiped-right', function (e) {
        clickNav("navbar-Visits");
    });
    //left-swipe on Home
    document.getElementById('Home').addEventListener('swiped-left', function (e) {
        clickNav("navbar-Talks");
    });


    //right-swipe on Talks
    document.getElementById('Talks').addEventListener('swiped-right', function (e) {
        clickNav("navbar-Home");
    });
    //left-swipe on Talks
    document.getElementById('Talks').addEventListener('swiped-left', function (e) {
        clickNav("navbar-Visits");
    });

    //right-swipe on Visits
    document.getElementById('Visits').addEventListener('swiped-right', function (e) {
        clickNav("navbar-Talks");
    });
    //left-swipe on Visits
    document.getElementById('Visits').addEventListener('swiped-left', function (e) {
        clickNav("navbar-Home");
    });
}
