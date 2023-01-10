import React, { useState, useEffect } from 'react';
import './index.css';




const Sequencer = ({ sound, sequence, isPlaying, currentStep, onStepClick, onBackButtonClick }) => {
    return (
        <div className="container">
            <div className="inner">
                <button className="button-back"  onClick={onBackButtonClick}></button>
                <div className="sequencer-buttons">
                    <h3>{sound}</h3>
                    {sequence.map((isActive, index) => (
                        <button
                            key={index}
                            onClick={() => onStepClick(sound, index)}
                            className={isActive ? 'active' : ''}
                            style={{
                                backgroundColor: isPlaying && currentStep === index ? 'lightblue' : isActive ? 'lightgreen' : '',
                            }}
                        >
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DrumMachine  = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [bpm, setBpm] = useState(120);
    const [sequences, setSequences] = useState({
        kick: Array(16).fill(false),
        snare: Array(16).fill(false),
        hihat: Array(16).fill(false),
    });
    const [selectedSound, setSelectedSound] = useState(null);

    useEffect(() => {
        let intervalId = null;
        if (isPlaying) {
            intervalId = setInterval(() => {
                setCurrentStep((currentStep + 1) % 16);
            }, 15000 / bpm);
        } else {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [isPlaying, currentStep, bpm, sequences]);

    const onPlayButtonClick = () => {
        if (isPlaying) {
            setIsPlaying(false);
            setCurrentStep(0);
        } else {
            setIsPlaying(true);
        }
    };


    const onBpmChange = (event) => {
        setBpm(event.target.value);
    };

    const onStepClick = (sound, index) => {
        setSequences({
            ...sequences,
            [sound]: sequences[sound].map((isActive, i) => (i === index ? !isActive : isActive)),
        });
    };

    const onBackButtonClick = () => {
        setSelectedSound(null);
    };

    const onSoundButtonClick = (sound) => {
        setSelectedSound(sound);
    };

    useEffect(() => {
        const audioElements = {
            kick: new Audio('./sounds/kick.mp3'),
            snare: new Audio('./sounds/snare.mp3'),
            hihat: new Audio('./sounds/hihat.mp3'),
        };

        const playSound = (sound) => {
            if (sequences[sound][currentStep]) {
                audioElements[sound].currentTime = 0;
                audioElements[sound].play();
            }
        };

        let intervalId = null;
        if (isPlaying) {
            intervalId = setInterval(() => {
                setCurrentStep((currentStep + 1) % 16);
                playSound('kick');
                playSound('snare');
                playSound('hihat');
            }, 15000 / bpm);
        } else {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [isPlaying, currentStep, bpm, sequences]);


    return (
        <div className="container">
            <div className='inner'>
                {selectedSound ? (
                    <Sequencer
                        sound={selectedSound}
                        sequence={sequences[selectedSound]}
                        isPlaying={isPlaying}
                        currentStep={currentStep}
                        onStepClick={onStepClick}
                        onBackButtonClick={onBackButtonClick}
                    />
                ) : (
                    <div>
                        <button className="start" onClick={onPlayButtonClick}>
                            {isPlaying ? 'Stop' : 'Start'}
                        </button>
                        <input type="number" value={bpm} onChange={onBpmChange} />
                        <button className="inst1" onClick={() => onSoundButtonClick('kick')}>Kick</button>
                        <button className="inst2" onClick={() => onSoundButtonClick('snare')}>Snare</button>
                        <button className="inst3" onClick={() => onSoundButtonClick('hihat')}>Hi-hat</button>
                    </div>
                )}
            </div>
        </div>
    );
};


export default DrumMachine;
