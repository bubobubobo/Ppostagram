import React from 'react'
import './Post.css'
import Avatar from "@material-ui/core/Avatar"

function Post() {
    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt='SJ'
                    src="/image/2.png"
                />
                <h3>Username</h3>
            </div>



            <img className="post__image" src="/image/1.png"/>            
            {/* image */}
            <h4 className="post__text"><strong>수종</strong> caption</h4>
            {/* username + caption */}
        </div>
    )
}

export default Post