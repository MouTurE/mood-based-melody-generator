import React from 'react';
import { useEffect, useState } from "react";
import * as mm from "@magenta/music";
import * as Tone from "tone";
import Sentiment from "sentiment";
import LoadingIMG from "../Loading.svg";
import PlayIcon from "../Play.png";
import "./MelodyGeneration.css"



function MelodyGeneration({text}) {
    

    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing,setProcessing] = useState(false);
    const [isPlaying,setPlaying] = useState(false);
    const [currentMelody,setMelody] = useState();

    let synth = new Tone.PolySynth();
    const sentiment = new Sentiment(); 

    

    useEffect(() => {
        const melodyRnn = new mm.MusicRNN(
        "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn"
        );

        melodyRnn.initialize().then(() => {
        setModel(melodyRnn);
        setLoading(false);
        });
    }, []);


    const analyzeEmotion = (text) => {

        console.log("Analysing the input:\n",text);

        const result = sentiment.analyze(text);
        const score = result.score;

        let emotion = "neutral";

        if (score <= -2) emotion = "sad";
        else if (score >= 2) emotion = "happy";

        console.log("Emotion: ", emotion, " Score: ", score)

        return { emotion, score };
    };


    const buildSeed = (basePitch, direction = "neutral") => {
        const step = 2;

        let pattern = [];

        if (direction === "down") {
            pattern = [0, -step, -step * 2];
        } else if (direction === "up") {
            pattern = [0, step, step * 2];
        } else {
            pattern = [0, 0, 0];
        }

        let time = 0;


        return {
            notes: pattern.map(interval => {
            const note = {
                pitch: basePitch + interval,
                startTime: time,
                endTime: time + 0.5
            };
            time += 0.5;
            console.log(note);
            return note;
            }),
            totalTime: time
        };
    };

    const getMusicSettings = (emotion) => {
        switch (emotion) {
            case "sad":
            return {
                direction: "down",
                temperature: 1.2,
                steps: 80,
                seedPitch: 52,   // lower notes
                noteDuration: 0.6
            };

            case "happy":
            return {
                direction: "up",
                temperature: 1.3,
                steps: 60,
                seedPitch: 72,   // higher notes
                noteDuration: 0.3
            };

            default:
            return {
                direction: "neutral",
                temperature: 1.0,
                steps: 50,
                seedPitch: 60,
                noteDuration: 0.5
            };
        }
    };



    const generateMelody = async () => {
        if (!model) return;

        setProcessing(true);

        const { emotion } = analyzeEmotion(text);
        const settings = getMusicSettings(emotion);

        // Start with a single seed note
        const seed = buildSeed(
            settings.seedPitch,
            settings.direction
        );

        const stepsPerQuarter = 4;
        const quantizedSeed = mm.sequences.quantizeNoteSequence(seed, stepsPerQuarter);
        
        //console.log(quantizedSeed.notes)

        // Ensure totalQuantizedSteps is set (Magenta uses this)
        if (!quantizedSeed.totalQuantizedSteps) {
        quantizedSeed.totalQuantizedSteps = quantizedSeed.notes[quantizedSeed.notes.length - 1].quantizedEndStep;
        }


        const result = await model.continueSequence(quantizedSeed, settings.steps, settings.temperature);

        setTimeout(() => {
            console.log(result);
            setMelody(result);
            setProcessing(false);
        }, 1000);

        
    };


  

  const playMelody = async (sequence, stepsPerQuarter = 4, tempo = 120) => {
    
    if (!currentMelody || isPlaying) {
        return;
    }

    await Tone.start();

    console.log(Tone.context.state);
    setPlaying(true);

    synth = new Tone.PolySynth(Tone.Synth).toDestination();


    // Sort notes by quantizedStartStep
    const notes = sequence.notes.slice().sort((a, b) => a.quantizedStartStep - b.quantizedStartStep);
    
    
    const secondsPerStep = 60 / tempo / stepsPerQuarter;

  

    const now = Tone.now();

    let maxEndTime = 0;

    notes.forEach(note => {

      // Convert quantized steps to seconds
      let start = note.quantizedStartStep * secondsPerStep;
      let duration = (note.quantizedEndStep - note.quantizedStartStep) * secondsPerStep;

      // Ensure strictly increasing startTime
      const end = start + duration; 
        if (end > maxEndTime) maxEndTime = end;

      
    synth.triggerAttackRelease(
        Tone.Frequency(note.pitch, "midi"),
        duration,
        (now + start)
    );
    });

    setTimeout(() => {
    setPlaying(false);
    console.log("Finished playing");
  }, (maxEndTime) * 1000);
};

  return (
    <div className='button-container' style={{justifyContent: processing || !currentMelody ?"center": "space-between"}}>
      
      
      
      {loading ? (
        <p>Loading model...</p>
      ) : processing ? 
      <img style={{width:"40px",height:"40px"}} src={LoadingIMG}></img>
      : (
        <button className='generate-button' disabled={text === ""?true: false} onClick={generateMelody}>
          <b>Generate Melody</b>
        </button>
      )}

       <button style={{display:currentMelody && !processing ? "block" : "none"}} className={isPlaying ? 'play-button-active' :'play-button'}  onClick={() => {playMelody(currentMelody)}}>
           <img className='play-icon' src={PlayIcon}></img>
        </button>
      

    </div>
  );
}

export default MelodyGeneration