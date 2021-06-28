import React, { useState, useEffect } from 'react'
import './App.css'
import Post from './Post'
import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core'
import ImageUpload from './ImageUpload'
import InstagramEmbed from 'react-instagram-embed'

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
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => { // 이건 state가 refresh되어도 정보 유지
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          // dont update username
        } else {
          // uf we just created someone
          return authUser.updateProfile({
            displayName: username
          });
        }
      } else {
        // user has logged out...
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions before useeffect
      unsubscribe();
    }
  }, [user, username]); // listening change of user & username


  // useEffect : Runs a piece of code based on a specific condition

  useEffect(() => {
    // This is where code runs
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => { // very powerfull listener
      // every time a new post is added, this code fires.
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    }) 
  }, []); // 대괄호 안쪽은 윗쪽 코드가 뭐든간에 refresh되면 무조건 시작 시 한 번만 실행!


  const signUp = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

      setOpenSignIn(false);
  }

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img className="app__headerImage" src="/image/logo.png" alt=""/>
          </center>
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signUp}>Sign Up</Button>
        </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
        <form className="app__signup">
          <center>
            <img className="app__headerImage" src="/image/logo.png" alt=""/>
          </center>
          <Input
            placeholder="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" onClick={signIn}>Sign In</Button>
        </form>
        </div>
      </Modal>
      
      <div className="app__header">
        <img className="app__headerImage" src="/image/logo.png" alt=""/>
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        {
          posts.map(({id, post}) => ( // everytime we get a post
            <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
          ))
        }
      </div>

      <InstagramEmbed
      clientAccessToken='<appId>|<clientToken>'
      url='https://instagr.am/p/Zw9o4/'
      maxWidth={375}
      hideCaption={false}
      containerTagName='div'
      injectScript
      protocol=''
      onLoading={() => {}}
      onSuccess={() => {}}
      onAfterRender={() => {}}
      onFailure={() => {}}
      />



      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry you need to login to upload</h3>
      )}



      

    </div>
  );
}

export default App;
