import {page, render} from './lib.js';
import { getUserData } from './util.js';
import { homePage } from './views/homePage.js';
import { catalogPage } from './views/catalogPage.js';
import { loginPage } from './views/loginPage.js';
import { registerPage } from './views/registerPage.js';
import { createPage } from './views/createPage.js';
import { editPage } from './views/editPage.js';
import { detailsPage } from './views/detailsPage.js';
import { logout } from './api/data.js';

const root = document.querySelector('main');
document.querySelectorAll('#user a')[1].addEventListener('click', onLogout);

page(decorateContext);
page('/home', homePage);
page('/catalog', catalogPage);
page('/login', loginPage);
page('/register', registerPage);
page('/create', createPage);
page('/details/:id', detailsPage);
page('/edit/:id', editPage);
updateNavBar();
page.start();
page.redirect('/home');


function decorateContext(ctx, next) {
    ctx.render = (content) => render(content, root);
    ctx.updateNavBar = updateNavBar();
    next();
}

function updateNavBar() {
    const userData = getUserData();
    if (userData != null) {
        document.getElementById('user').style.display = 'block';
        document.getElementById('guest').style.display = 'none';
    } else {
        document.getElementById('user').style.display = 'none';
        document.getElementById('guest').style.display = 'block';
    }
}

async function onLogout() {
    await logout();
    updateNavBar();
    page.redirect('/home');
}