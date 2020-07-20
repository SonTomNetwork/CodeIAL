{
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDOM(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    let newPostDOM = function (post) {
        console.log(post.user._name);
        return $(`<li class="post-container" id="post-${post._id}">
                    <div class="post">
                        <p id="post-content">${post.content}</p>
                        <p id="post-subtext">
                            ${post.user.name}
                            <a href="/posts/destroy/${post._id}" class="delete-post-button">Delete</a>
                        </p>

                    </div>

                    <div class="post-comments">
                        <form action="/comments/create" method="POST">
                            <input type="text" name="comment" placeholder="Opinion?" required id="commtext">
                            <input type="hidden" name="post" value="${post._id}">
                            <input type="submit" value="Add Comment" id="commbutton">
                        </form>

                        <ul id="post-comments-${post._id}">
                        </ul>
                    </div>
                </li>`)
    }

    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#post-${data.data.post_id}`).remove();
                }, error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    createPost();
}