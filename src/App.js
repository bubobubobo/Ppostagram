import React, { useState, useEffect } from 'react'
import './App.css'
import Post from './Post'
import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { Button, Input } from '@material-ui/core'
import ImageUpload from './ImageUpload'


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
          <Button onClick={() => auth.signOut()}>로그아웃</Button>
        ): (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>로그인</Button>
            <Button onClick={() => setOpen(true)}>회원가입</Button>
          </div>
        )}
      </div>
      
      <div className="app__posts">
        <div className="app__posts__contents">
          {
          posts.map(({id, post}) => ( // everytime we get a post
            <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
          ))
          }
        </div>
        {/* <div className="app__posts__profile">
          <img className="profile__image" src="/image/2.png" alt=""/>
          <div className="profile__contents">
            <h4 className="profile__contents__title">
              이름
            </h4>
            <div className="profile__contents__caption">
              뽀송이
            </div>
          </div>
          <div className="profile__contents">
            <h4 className="profile__contents__title">
              직업
            </h4>
            <div className="profile__contents__caption">
              강아지
            </div>
          </div>
          <div className="profile__contents">
            <h4 className="profile__contents__title">
              견종
            </h4>
            <div className="profile__contents__caption">
              뽀메라니안
            </div>
          </div>
          <div className="profile__contents">
            <h4 className="profile__contents__title">
              나이
            </h4>
            <div className="profile__contents__caption">
              
            </div>
          </div>
        </div> */}
      </div>


      {user?.displayName ? (
        <ImageUpload username={user.displayName}/>
      ): (
        <h3>사진을 업로드 하려면 먼저 로그인하세요</h3>
      )}
    </div>
  );
}

export default App;
