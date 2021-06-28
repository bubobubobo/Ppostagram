import React, { useState, useEffect } from 'react'
import './App.css'
import Post from './Post'
import { db } from './firebase'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  

  // useEffect : Runs a piece of code based on a specific condition

  useEffect(() => {
    // This is where code runs
    db.collection('posts').onSnapshot(snapshot => { // very powerfull listener
      // every time a new post is added, this code fires.
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    }) 
  }, []); // 대괄호 안쪽은 윗쪽 코드가 뭐든간에 refresh되면 무조건 시작 시 한 번만 실행!


  const signUp = (event) => {

  }

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app__headerImage" src="/image/logo.png" alt=""/>

            <Input
              placeholder="username"
              type="text"
              value={email}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={email}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={signUp}>Sign Up</Button>


          </center>
        </div>
      </Modal>
      
      <div className="app__header">
        <img className="app__headerImage" src="/image/logo.png" alt=""/>
      </div>

      <Button onClick={() => setOpen(true)}>Sign Up</Button>

      {
        posts.map(({id, post}) => ( // everytime we get a post
          <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
    </div>
  );
}

export default App;
