import React, { useState, useEffect } from 'react'
import './App.css';
import baseURL from './Env';
import { Oval } from  'react-loader-spinner'

function App() {

  const [Categories, setCategories]            = useState([])
  const [CategorieSelect, setCategorieSelect]  = useState(false);
  const [Word, setWord]                        = useState([]);
  const [WordsSecret, setWordsSecret]          = useState([]);
  const [Intento, setIntento]                  = useState(10);
  const [ToWin, setToWin]                      = useState(false);
  const [ViewKeyBoard, setViewKeyBoard]        = useState(true);
  const [Alphabet, setAlphabet]                = useState(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "ñ", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);


  useEffect(()=>{
    getCategories()
  }, [])


  const getCategories = async () => {
    try {
      const { data } = await baseURL.get(`/categories`);
      if (data.length > 0) {
        setCategories(data);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  const getWordByCategory = async (id) => {
    setViewKeyBoard(false)
    setCategorieSelect(id)
    try {
      const { data } = await baseURL.get(`/words/by/categories/${id}`);
      initGame(data.name);
    } catch (e) {
      console.warn(e);
    }
  }

  const initGame = (wordSelect) => {
    try {
      console.log(wordSelect, "newWord")
      setToWin(false)
      setViewKeyBoard(true)
      let latters = []
      for (var i = 0; i < wordSelect.length; i++) {
        setWord([...Word, wordSelect[i]])
        latters.push({ "name": wordSelect[i], "value": false });
      }
      setWordsSecret(latters)
      setIntento(10);
    } catch (e) {
      console.warn(e);
    }
  }

  const searchLetter = async (findLetter) => {
    try {   
        let response;
        let verify = false
        const result = WordsSecret.map((item, i)=>{
          if(item.name == findLetter){
            item.value = true
            verify = true
          }
          return item
        })
        console.log(result, "WordsSecret")
        setWordsSecret(result)

        if(!verify){
          setIntento(Intento - 1)
        }
        
        if(!WordsSecret.find(item => !item.value)){
          setToWin(true)
        }
        return response = true;
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <div className="App">
      
      {Categories?.length > 0 &&
        <div>
          <div style={{ display: "flex", justifyContent : "center", marginTop : "10%", marginBottom : "1%"}}>
            <select
              onChange={e => getWordByCategory(e.target.value)}
            >
              <option>seleccione una opcion</option>
              {Categories.map((i, key) => {
                return (
                  <option key={key}
                    value={i.id}
                  >
                    {i.name}
                  </option>
                )
              })}
            </select>
          </div>

          <div style={{ height: "80px", display: "flex",width:"100%",justifyContent:"center" }}>
            { WordsSecret.length > 0  &&
              WordsSecret.map((item, key) => {
                return (
                  <WordSecret key={key} keyboard={item.name} visible={item.value}  />
                )
              })
            }
          </div>

          <div style={{width: "100%", display: "flex", margin:"10px", justifyContent:"center"}}>
            {ToWin &&
              <div>
                <div>
                  <button onClick={()=>getWordByCategory(CategorieSelect)} style={{fontSize: "40px", marginBottom : 20 }}>Reset</button>
                </div>
                <div style={{fontSize: "40px" }}>Has Ganado</div>
              </div>
              
            }

            {Intento == 0 &&
              <div style={{fontSize: "40px" }}>game over</div>
            }

            {Intento > 0 && !ToWin && ViewKeyBoard &&
              <div style={{display:"flex", justifyContent : "center", width : "90%", flexWrap : "wrap"}}>
                {
                  Alphabet.map((item, key) => {
                    return (
                      <KeyBoard wordssecret = {WordsSecret}  key={key} keyboard={item} visible={true} searchLetter={searchLetter} />
                    )
                  })
                }
              </div>
            }


          {!ViewKeyBoard &&
            <Oval
              heigth="100"
              width="100"
              color='grey'
              ariaLabel='loading'
            />
          }


          </div>

          <div style={{display:"flex", width: "100%", fontSize: "20px",justifyContent:"center"}}>
            Intentos: {Intento}
          </div>


          <div style={{display:"flex", width: "100%", justifyContent:"center"}}>

            {Intento <= 9 &&
              <img src="images/hangman-1.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            {Intento <= 8 &&
              <img src="images/hangman-2.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            {Intento <= 7 &&
              <img src="images/hangman-3.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            {Intento <= 6 &&
              <img src="images/hangman-4.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            {Intento <= 5 &&
              <img src="images/hangman-5.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            {Intento <= 4 &&
              <img src="images/hangman-6.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            {Intento <= 3 &&
              <img src="images/hangman-7.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            {Intento <= 2 &&
              <img src="images/hangman-8.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            {Intento <= 1 &&
              <img src="images/hangman-9.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            {Intento <= 0 &&
              <img src="images/hangman-10.png" style={{width : 200, height : 200, position : "absolute"}}></img>
            }
            
          </div>


      </div>
      }
    </div>
  );
}

const KeyBoard = (props) => {
  try {
    const [Visible, setVisible] = useState(props.visible);
    function usedLetter(e) {
      try {
        if(Visible && props.wordssecret.length > 0){
          setVisible(false);
          props.searchLetter(e);
        }
      } catch (e) {
        console.war(e);
      }
    }
    return (
      <div
        style={{
          opacity: Visible ? 1 : 0,
          backgroundColor: "silver",
          color: "black",
          width: "50px",
          height: "50px",
          margin: "4px",
          cursor: "pointer"
        }}
        onClick={e => usedLetter(props.keyboard)}
      ><p>{props.keyboard}</p></div>
    )
  } catch (e) {
    console.war(e);
  }
}

const WordSecret = (props) => {
    return (
      <div
        style={{
          backgroundColor: "silver",
          color: props.visible ? "black": "silver",
          lineHeight: "30px",
          width: "30px",
          height: "30px",
          margin: "4px",
          cursor: "pointer"
        }}
      >{props.keyboard}</div>
    )
}

export default App;