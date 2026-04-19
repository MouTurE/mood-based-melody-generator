import { useEffect, useState } from "react";
import EmojiPicker from 'emoji-picker-react';

import MelodyGeneration from "./components/MelodyGeneration";
import "./App.css"
import EmojiIMG from "./laugh.png";

function App() {
  
  const [text, setText] = useState("");
  const [emojiMenuVisible,setEmojiMenuVisibility] = useState(false);

  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;


  return (

    <div className="app-container">
      <h1 className="app-title">Mood Based Melody Generator</h1>

       <div className="interactables">
        
        <h4>{date}</h4>
        
         <textarea
              className="text-area"
              type="text"
              placeholder="Write your journal entry..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
            }}
              
              maxLength={700}
         
          />
         
          <div className="text-toolbar">
            <span style={{display:text.length > 0 ? "block":"none"}}>{text.length}/700</span>
            <button onClick={() => setEmojiMenuVisibility(prev => !prev)}><img src={EmojiIMG}></img></button>
          </div>

          <div style={{position:"absolute", top:"400px"}}>
            <EmojiPicker className="EmojiPickerReact" open={emojiMenuVisible? true: false} onEmojiClick={(emojiObject) => setText((prev) => prev + emojiObject.emoji)} />
          </div>
          <MelodyGeneration text={text}/>
       </div>

      <br/>

      <div className="info-box"> 
        <p><b>Note:</b> Don't forget to turn up your volume and switch off 'silent mode' if you are using mobile phone </p>

        <h4>Example journal entry prompts:</h4>
        <ul> 
          <li>Today was amazing. I felt full of energy, everything went smoothly, and I’m really grateful and excited about what’s coming next.</li>
          <li>I woke up, had breakfast, and went to work. The day was fairly normal and nothing unusual happened.</li>
          <li>I feel exhausted and overwhelmed. Nothing seems to be going right lately, and I can't shake this sense of sadness and disappointment.</li>
        </ul>
    
      </div>
    
    </div>
  );
}

export default App;