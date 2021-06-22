console.log('Loading MUSEUMS JS app.js');


//show museums page when the browser fully loaded HTML and the DOM tree is built
document.addEventListener("DOMContentLoaded", appStart());

function appStart()
{
    const openMuseumId=window.location.search.substring(1);
    if (openMuseumId)
        getMuseumInfo(openMuseumId);
    else
        showMuseums();
}

async function getMuseumsList(search_str, page_num) {

    let api_mus = '/api/museums/list?';
    if (page_num)
        api_mus = api_mus + 'page=' + page_num;
    if (search_str)
        api_mus = api_mus + '&name=' + search_str;

    api_mus = encodeURI(api_mus);

    Promise.all([
        loadMstTemplate('/templates/museums_list.mst').then(x => x),
        fetch(api_mus).then(x => x.json()),
    ])
        .then(([templateStr, responseData]) => {
            //console.log('templateStr', templateStr);
            console.log('itemsData', responseData);
            const musList = { museums: responseData.museums_res };
            const renderedHtmlStr = Mustache.render(templateStr, musList);

            return [renderedHtmlStr, responseData.currentPage, responseData.totalPages];
        })
        .then(([htmlStr, currentPage, totalPages]) => {
            //console.log('htmlStr', htmlStr);
            console.log('currentPage', currentPage);
            console.log('totalPages', totalPages);
            const mus_div = document.getElementById('museums_app');
            mus_div.innerHTML = htmlStr;

            var pagging_container = document.getElementById('pagging_container');
            if (pagging_container) {
                addPagging(pagging_container, currentPage, totalPages, 3, 'getMuseumsList()');
            }

            document.getElementById('museums_search').hidden = false;
            document.getElementById('search_str').disabled = false;
            document.getElementById('search_btn').disabled = false;
            document.getElementById('search_btn').innerText = "Find";
            hideLoader();
        })
        .catch(err => console.error(err));

}

function showMuseums(pagenum) {
    showLoader();
    if (!pagenum)
        pagenum = 1;
    const frm = document.forms.museums_search;
    let searchstring = '';
    if (frm) {
        let search_input = frm.elements.search_str;
        if (search_input) {
           // console.log('SEARCH INTPUT');
           // console.log(search_input.value);
            searchstring = search_input.value;
        }
        frm.currentPagenum = pagenum;
    }

    frm.elements.search_str.disabled = true;
    frm.elements.search_btn.disabled = true;
    document.getElementById('search_btn').innerText = "Finding";

    getMuseumsList(searchstring, pagenum ? pagenum : 1);
}

async function returnToMuseumsList(event) {
    event.preventDefault();
    showMuseums(document.forms.museums_search.currentPagenum);
}


async function deleteMuseum(event, museum_id) {
    console.log("DELETE START", museum_id);
    event.preventDefault();
    document.getElementById('deleteModal').style.display='none';
    document.getElementById('cancelBtn').disabled = true;
    document.getElementById('deleteBtn').disabled = true;
    showLoader();
    let api_mus = '/api/museums/del/' + museum_id;
    Promise.all([fetch(api_mus).then(x => x.json()),])
        .then((responseData) => {
            let res_div = document.getElementById("deleteResult");
            if (res_div) {
                const deletedMuseum = responseData[0];
                let res_divText = document.getElementById("deleteResultText");
                if (deletedMuseum) {
                    //console.log('DELETED MUSEUM', deletedMuseum);
                    const museumName = deletedMuseum.name;
                    //console.log('museumName', museumName);
                    res_divText.innerHTML = 'Museum "' + museumName + '" was succesfully deleted.';
                }
                else
                    res_divText.innerHTML = 'Something went wrong. Unable to delete museum.';

                document.getElementById('cancelBtn').disabled = false;
                document.getElementById('deleteBtn').disabled = false;
                
                hideLoader();
                res_div.style.display = 'block';
                document.getElementById('deleteModal').style.display='block';
            }
            return;
        })
        .catch(err => console.error(err));
}

function getMuseumForm() {
    showLoader();

    Promise.all([loadMstTemplate('/templates/museum_form.mst').then(x => x),])
        .then(htmlStr => {
            console.log('htmlStr', htmlStr);
            const mus_div = document.getElementById('museums_app');
            document.getElementById('museums_search').hidden = true;
            mus_div.innerHTML = htmlStr[0];
            hideLoader();
        })
        .catch(err => console.error(err));
      
}

function addNewMuseum() {
    console.log('add musem');
    showLoader();
    const frm = document.forms.museum_form;
    frm.disabled=true;
    // Bind the FormData object and the form element
    const formData = new FormData(frm);

    let api_mus = '/api/museums/add' ;
    Promise.all([fetch(api_mus, {method: 'POST', body: formData }).then(x => x.json()),])
        .then((responseData) => {
            console.log("response adat", responseData);
            const createdMus = responseData[0];
            hideLoader();
            if (createdMus) {
                //console.log('CREATED MUSEUM', deletedMuseum);
                const museumName = createdMus.name;
                console.log('museumName', museumName);
                addHistoryItem(createdMus._id, museumName, createdMus.addDate);
            }
            frm.disabled=false;
        })
        .catch(err => console.error(err));
    // hideLoader();
    // frm.disabled=false;
}


async function getMuseumInfo(museum_id) {
    showLoader();
    let api_mus = '/api/museums/' + museum_id;
    Promise.all([
        loadMstTemplate('/templates/museum_info.mst').then(x => x),
        fetch(api_mus).then(x => x.json()),
    ])
        .then(([templateStr, responseData]) => {
            //console.log('templateStr', templateStr);
            //console.log('MUSEUM', responseData);
            const museumInfo = { museum: responseData };
            //console.log('MUSEUMinfo', museumInfo);
            const renderedHtmlStr = Mustache.render(templateStr, museumInfo);

            return renderedHtmlStr;
        })
        .then(htmlStr => {
            console.log('htmlStr', htmlStr);
            //showModal(htmlStr);
            const mus_div = document.getElementById('museums_app');
            document.getElementById('museums_search').hidden = true;
            mus_div.innerHTML = htmlStr;
            hideLoader();
        })
        .catch(err => console.error(err));

}


async function gotoMuseumInfo(event, museum_id) {
    event.preventDefault();
    getMuseumInfo(museum_id);   
}

function addHistoryItem(item_id, item_name, item_date) {
    let list = document.getElementById('addHistoryItems');
    let newLI = document.createElement('li');
    newLI.className = 'history';
    let newA = document.createElement('a'); 
    newA.innerHTML = item_name + ' (' + DateTimeInUAFormat(item_date)+ ') ';
    newA.setAttribute("href","#");
    newA.setAttribute("onclick","gotoMuseumInfo(event, '"+item_id+"')");
    newLI.appendChild(newA);
    list.insertBefore(newLI, list.firstChild);
    setTimeout(function () {
        newLI.className = newLI.className + " show";
    }, 10);
}

