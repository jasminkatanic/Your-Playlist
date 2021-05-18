import firebase from 'firebase';
import { useEffect, useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from 'react-router';
import "firebase/firestore";

if(firebase.app.length) {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
  });
}else{
  firebase.app();
}

const Login = () => {  
  
  const [loggedIn, setLoggedIn] = useState(false);
  let refDB = firebase.firestore().collection("user-favorites");  

  
  
  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => setLoggedIn(true)
    }
  }

  useEffect(() =>{       

    firebase.auth().onAuthStateChanged(user => {
      if(user){
        setLoggedIn(true);       
        localStorage.setItem("token", user.ac.a.c);
        getFromDB();
      }      
    })
    
    return () => true;
    // eslint-disable-next-line
  },[])

  function getFromDB(){  
    let getToken = localStorage.getItem("token");    
    refDB.doc(getToken)
    .get()
    .then(res => {
      if(res===undefined){
        localStorage.setItem("favorites", []);
      }else{
        insertIntoStorage(res.data()); 
      }           
    })
    .catch((err) => {
      console.log(err);
      localStorage.setItem("favorites", []);
    })    
  };

  function insertIntoStorage(response){
    let dbFavorites = Object.values(response);    
    localStorage.setItem("favorites", JSON.stringify(dbFavorites));   
  }

  
  
  return (  
    <div className="content">
      <div className="inner">
        <div className="inner-top">
          <div className="inner-top-upper">Your List</div>
          <div className="inner-top-lower">Make your list of favorites and take it with you</div>
        </div>
        <div className="inner-bottom">
          <div className="inner-bottom-content">
            {loggedIn ? (
              <Redirect to="content" />
            ) : 
            (
              <StyledFirebaseAuth className="authCont"
                uiConfig={uiConfig}
                firebaseAuth={firebase.auth()}
              />
            )}
          </div>  
          <div className="inner-bottom-end">
            <h2>Sign in with your preferred method to start creating your playlists.</h2>
          </div>        
        </div>        
      </div>
    </div>
  );

}
 
export default Login;

