import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core'
import { storage, db } from './firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image); // 업로드 하는 부분

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function ...
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function ...
                storage // 업로드 하는 url을 잡는 부분
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // post image inside db
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        // initialize
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    }

    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100"/>
            <TextField
                className="caption"
                label="스토리를 입력하세요..."
                multiline
                rows={6}
                fullWidth
                onChange={event => setCaption(event.target.value)} value={caption}
            />
            {/* <input type="text" placeholder="내용을 입력하세요..." onChange={event => setCaption(event.target.value)} value={caption} /> */}
            <input className="file" type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                업로드
            </Button>


        </div>
    )
}

export default ImageUpload