import { getGameById, deleteGame, getCommentsByID, addComment } from '../api/data.js';
import { html } from '../lib.js';
import { getUserData } from '../util.js';

const detailsTemplate = (game, isOwner, onDelete, comments, onSubmit, isGuest) => html`
<section id="game-details">
    <h1>Game Details</h1>
    <div class="info-section">
        <div class="game-header">
            <img class="game-img" src=${game.imageUrl} />
            <h1>${game.title}</h1>
            <span class="levels">MaxLevel: ${game.maxLevel}</span>
            <p class="type">${game.category}</p>
        </div>
        <p class="text">
            ${game.summary}
        </p>                
        <div class="details-comments">
            <h2>Comments:</h2>
            
                ${comments.length == 0 ? html`<p class="no-comment">No comments.</p>` 
                : comments.map(commentTemplate)}
            
            <!-- Display paragraph: If there are no games in the database -->
            
        </div>
        ${isOwner ? html`<div class="buttons">
            <a href="/edit/${game._id}" class="button">Edit</a>
            <a @click=${onDelete} href="javascript:void(0)" class="button">Delete</a>
        </div>` : ''}                
    </div>           
<!-- Bonus -->
${(isOwner || isGuest) ? '' : html`<article class="create-comment">
    <label>Add new comment:</label>
    <form @submit=${onSubmit} class="form">
        <textarea name="comment" placeholder="Comment......"></textarea>
        <input class="btn submit" type="submit" value="Add Comment">
    </form>
</article>`}

</section>
`;

const commentTemplate = (comment) => html`
<ul>
    <li class="comment">
        <p>Content: ${comment.comment}</p>
    </li>
</ul>`;

/*


<!-- Bonus -->
<!-- Add Comment ( Only for logged-in users, which is not creators of the current game ) -->

*/


export async function detailsPage(ctx) {
    const game = await getGameById(ctx.params.id);
    let isOwner = false;
    let isGuest = false;
    const userData = getUserData();
    if (userData != null) {
        if (userData.id == game._ownerId) {
            isOwner = true;
        }
    } else {
        isGuest = true;
    }
    const comments = await getCommentsByID(ctx.params.id);

    ctx.render(detailsTemplate(game, isOwner, onDelete, comments, onSubmit, isGuest));

    async function onDelete() {
        await deleteGame(ctx.params.id);
        ctx.page.redirect('/home')
    }

    async function onSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const comment = formData.get('comment').trim();
        if (comment == '') {
            return alert('Please, add comments');
        }
        const gameId = ctx.params.id
        const data = {gameId, comment}
        try{
        await addComment(data);
        event.target.reset();
        ctx.page.redirect(`/details/${ctx.params.id}`);
        } catch (err) {
            alert(err.message);
        }
    }
}