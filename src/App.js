import { useEffect, useState } from "react";
import MelodyGeneration from "./components/MelodyGeneration";

function App() {
  
  const [text, setText] = useState("");


  return (

    <div style={{ padding: 20 }}>
      <h1>Mood Based Melody Generator</h1>

       <textarea
            type="text"
            placeholder="Write your journal entry..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{width:"100%",height:"150px"}}
            maxLength={700}
        />

      
      <MelodyGeneration text={text}/>

      <br/>

      <div style={{display:"flex", flexDirection:"column",  border:"1px solid black", padding:"20px"}}> 
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