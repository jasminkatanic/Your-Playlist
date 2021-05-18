import { useEffect, useState } from "react";
import { Redirect } from 'react-router';
import firebase from 'firebase';
import axios from "axios";
import { FaHeart } from 'react-icons/fa';


const Content = () => {  
  let getFromStorage = localStorage.getItem("token") || [];
  

  const [storage, setStorage] = useState(true);  
  const [userdata, setUserData] = useState();   
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [headTitle, setHeadTitle] = useState("Please Enter Your Search Term");
  const [page, setPage] = useState(false);
  let refDB = firebase.firestore().collection("user-favorites"); 
  
  
  
  useEffect(() => {    

         
    firebase.auth().onAuthStateChanged((user => {
      if(user && getFromStorage===user.a.c){    
        setUserData(user.displayName);                    
        return setStorage(true);
      }else{          
        return setStorage(false);
      }      
    }))  
    
    return () => true;
  // eslint-disable-next-line
  },[])
  
  function getMusic(){      
   
    
    const options = {
      method: 'GET',
      url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
      params: {q: input},
      headers: {
        'x-rapidapi-key': 'Your Rapid API Key',
        'x-rapidapi-host': 'Your Rapid Host'
      }
    };        
    
      axios.request(options)
      .then(function (response) {
        if(response.data.data===undefined && !data.length){
          getMusic(input);
        }else if(data.length){          
          let newData = [];          
          setData([...newData, ...response.data.data]);    
          setInput("");         
        }else{
          setData([...data, ...response.data.data]);
          setInput("");
        }   
      }).catch(function (error) {
        console.error(error);
      });

  };


  function addToFavorite(songId){
    
    songId = songId.toString();

    let favoriteList = localStorage.getItem("favorites") || [];    
    
    if(favoriteList.length===0){
      localStorage.setItem("favorites", JSON.stringify([songId]));   
      setData([...data]);
    }else{
      let favoriteArray = JSON.parse(favoriteList);
    
      if(favoriteArray.includes(songId)){
        let saveSong = [...favoriteArray];
        let indexSong = saveSong.indexOf(songId);
        saveSong.splice(indexSong, 1);
        localStorage.setItem("favorites", JSON.stringify(saveSong));
        setDbFavorites(getFromStorage,saveSong);
        setData([...data]);
      }else{
        let saveSong = [...favoriteArray];
        saveSong.push(songId);        
        localStorage.setItem("favorites", JSON.stringify(saveSong));
        setDbFavorites(getFromStorage,saveSong);
        setData([...data]);
      }
      
    }
  };

  function checkFavorite(songCheck){
    songCheck = songCheck.toString();
    let favoriteList = localStorage.getItem("favorites") || []; 

    if(favoriteList.length===0){
      return false;
    }else{
      let favoriteArray = JSON.parse(favoriteList);

        if(favoriteArray.includes(songCheck)){
          return true;
        }else{          
          return false;
        }
    }
  };

  
  function loadFavorites(){
    setData([]);
    setPage(true);
    setHeadTitle("There Seems To Be No Songs In Favorites");
    let favoriteList = localStorage.getItem("favorites") || []; 
    let favoriteArray = JSON.parse(favoriteList);    
      if(favoriteArray.length === 0){                   
        setHeadTitle("There Seems To Be No Songs In Favorites");
        setData([]);
      }else{                    
        
        let favoriteIndex = 0;
        let newData = [];
        getById(favoriteIndex);

        function getById(id){


          const options = {
            method: 'GET',
            url: `https://deezerdevs-deezer.p.rapidapi.com/track/${favoriteArray[id]}`,
            headers: {
              'x-rapidapi-key': 'Your Rapid API Key',
              'x-rapidapi-host': 'Your Rapid Host'
            }
          };
          
          axios.request(options)
          .then(function (response) {
            if(response.data.title === undefined && favoriteIndex<favoriteArray.length){      
              getById(favoriteIndex);
            }else if(response.data.title && favoriteIndex<favoriteArray.length){
              newData.push(response.data);
              favoriteIndex = favoriteIndex + 1;               
              getById(favoriteIndex);                           
            }else if(newData.length === favoriteIndex){
              let clearState = [];
              setData([...clearState, ...newData]); 
                            
            }
          }).catch(function (error) {
            console.error(error);
          });
        }
      }

      fastUncheck();
  };


  function setDbFavorites(uID,favorites){    
    let favoritesObject = Object.assign({}, favorites);
    refDB.doc(uID)
    .set(favoritesObject)
    .catch((err) => {
      console.log(err);
    })
  };

  function toggleBtn(){
    setData([]);
    setPage(false);
    setHeadTitle("Please Enter Your Search Term");
    fastUncheck();
  }

  function fastUncheck(){
    let checkBoxState = document.getElementById("navi-togle");
      checkBoxState.checked = false;
  };

  function logOut(){
    firebase.auth().signOut();
    window.localStorage.clear();
  };
  

  return (  
    
    <div className="content">
      <div className="navigation" id="main-nav">
        <input type="checkbox" className="navigation__checkbox" id="navi-togle" />
          <label htmlFor="navi-togle" className="navigation__button" id="nav-btn">
              <span className="navigation__icon">&nbsp;</span>
          </label> 
          <div className="navigation__background">&nbsp;</div>       
        <nav className="navigation__nav">
          <ul className="navigation__list" id="mobNavList">
            <li className="navigation__item" onClick={() => toggleBtn()}>Search</li>
            <li className="navigation__item" onClick={() => loadFavorites()}>Favorites</li>
            <li className="navigation__item" onClick={() => logOut()}>Logout</li>          
          </ul>
        </nav>              
      </div>
      {storage ? (
        <div className="inner whiteOverride">
          <div className="contentLeft">
            <ul className="contentLeft-list">
              <li className={`contentLeft-list-item ${page ? "" : "pageSelect"}`} onClick={() => toggleBtn()}>Search</li>
              <li className={`contentLeft-list-item ${page ? "pageSelect" : ""}`} onClick={() => loadFavorites()}>Favorites</li>
              <li className="contentLeft-list-item" onClick={() => logOut()}>Logout</li>
            </ul>
          </div>
          <div className="contentRight">
            <div className="contentRight-top">              
                <div className="contentRight-top-head">{userdata}</div>                          
            </div>
            
              {page ? 
              
              (
              <div className="contentRight-second">
                  <div className="contentRight-second-inner">
                    <div className="contentRight-second-inner-content">
                      <div className="contentRight-second-inner-content-text">
                        FAVORITES
                      </div>
                    </div>
                  </div>              
                </div>
              )               
              :              
              (
                <div className="contentRight-second">
                  <div className="contentRight-second-inner">
                    <input type="text" className="contentRight-second-inner-input" value={input} onChange={event => setInput(event.target.value)}/>
                    <div className="contentRight-second-inner-button" onClick={() => getMusic()}>
                      <div className="contentRight-second-inner-button-content">Search</div>
                    </div>
                  </div>              
                </div>
              )
              }              
            {!data.length ? 
            (
              <div className="contentRight-bottom">
                <div className="contentRight-bottom-head">
                  <div className="contentRight-bottom-head-content">{headTitle}</div>
                </div>
              </div>
            ) 
            :           
            (
              <div className="contentRight-bottom">                
              {data.map((item, index) =>                    
                  <div className="contentRight-bottom-card" key={item.id}>
                    <img src={item.album.cover_big} alt="test"></img>
                    <div className="contentRight-bottom-card-body">
                      <div className="contentRight-bottom-card-body-head">
                        <div className="contentRight-bottom-card-body-head-content">
                          <div className="contentRight-bottom-card-body-head-content-top">
                            <div className="contentRight-bottom-card-body-head-content-top-content">{item.artist.name}</div>
                          </div>
                          <div className="contentRight-bottom-card-body-head-content-bottom">
                            <div className="contentRight-bottom-card-body-head-content-bottom-content">{item.title_short}</div>
                          </div>
                        </div>                    
                      </div>                  
                      <div className="contentRight-bottom-card-body-bottom">
                        <div className="contentRight-bottom-card-body-bottom-left">
                          <div className="contentRight-bottom-card-body-bottom-left-content">
                            <audio controls src={item.preview}></audio>
                          </div>                          
                        </div>
                        <div className="contentRight-bottom-card-body-bottom-right"  onClick={() => addToFavorite(item.id)}>
                          <div className={`contentRight-bottom-card-body-bottom-right-content ${checkFavorite(item.id) ? "favoriteSong" : ""}`}>
                            <FaHeart />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>                                           
              )}                           
            </div>
            )}            
          </div>
        </div>
      ):
        (
          <Redirect to="/" />
        ) 
      }       
    </div>
  );

}
 
export default Content;