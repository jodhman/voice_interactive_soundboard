//@flow
import React, { Component } from 'react';
import SpeechToText from 'speech-to-text';
import uuid from 'uuid/v4';

import './App.css';
import type { AudioType } from './Audio/Audio';
import AudioList from './Audio/Audio';
import Sounds from './soundAssets';

type settingsProps = {
  flow: boolean
}

type State = {
  Audio: *,
  listener: *,
  listening: boolean,
  currentAudioName: string,
  voiceCommandNotRecognized: boolean,
  lastGivenVoiceCommand: string,
  settings: settingsProps
}

const allSounds: Array<AudioType> = [
  { name: 'cricket sound', src: Sounds.CricketSound },
  { name: 'evil laugh', src: Sounds.EvilLaugh },
  { name: 'bad', src: Sounds.WahWahWah },
  { name: 'dramatic action', src: Sounds.DramaticAction },
  { name: 'street fighter', src: Sounds.Hadouken },
  { name: 'power up', src: Sounds.PowerUp },
  
];

type Setting = {
  settingTitle: string,
  settingDescription: string,
  codeName: string
}

const settings: Array<Setting> = [
  { settingTitle: 'Record Flow', codeName: 'flow', settingDescription: 'Record Flow allows you to state different sound effects in the same sentence which it will then play at the same time.' }
]

class App extends Component<null, State> {
  browserWidth: number = window ? window.innerWidth : 0;

  constructor() {
    super();
    let settingsProps: settingsProps = {};
    settings.forEach((item) => settingsProps = {...settingsProps, [item.codeName]: false})
    this.state = {
      Audio: new AudioList({audio: allSounds}),
      listener: new SpeechToText(this.onAnythingSaid, this.onFinalised, this.onFinishedListening),
      listening: false,
      currentAudioName: '',
      voiceCommandNotRecognized: false,
      lastGivenVoiceCommand: "",
      settings: settingsProps
    }
  }

  toggleSetting = (codeName: string) => {
    this.setState({ settings: { ...this.state.settings, [codeName]: !this.state.settings[codeName] } })
  }

  toggleInfoModal = (description: string) => {

  }

  toggleCaptureSound = () => {
    const { listening } = this.state;
    
    if(!listening) {
      this.setState({ listening: !listening }, this.startCaptureSound());
    }
    else {
      this.setState({ listening: !listening }, this.stopCaptureSound());      
    }
  }

  startCaptureSound() {
    try{
      this.state.listener.startListening();
    }
    catch(error) {
      console.log(error);
    }
  }

  stopCaptureSound() {
    try{
      this.state.listener.stopListening();
    }
    catch(error) {
      console.log(error);
    }
  }

  onAnythingSaid() {
    
  }

  onFinalised = (text: string) => {
    const { flow } = this.state.settings;
    text = text.trim().toLowerCase();
    let nextState = { currentAudioName: text, lastGivenVoiceCommand: text }

    if(flow) {
      const soundIndex = this.getSoundIndexFlow(text);
      soundIndex.forEach((soundindex) => this.playSoundIndex(soundindex))
    }
    else {
      this.getSoundIndex(text)
    }

    if(this.browserWidth < 980) {
      nextState = { ...nextState, listening: false }
    }

    this.setState(nextState)  
  }

  onFinishedListening() {
    
  }

  getSoundIndex(text: string): void {
    let soundIndex: number | typeof undefined;
    allSounds.forEach((sound, index) => {
      if(Object.is(sound.name, text)) {
        soundIndex = index;
      }
    })
    this.playSoundIndex(soundIndex);
  }

  getSoundIndexFlow(fullText: string): Array<number> {
    let soundIndex: Array<number> = [];
    allSounds.forEach((sound, index) => {
      if(fullText.indexOf(sound.name) !== -1) {
        soundIndex.push(index);
      }
    })
    return soundIndex;
  }

  playSoundIndex(index: number | typeof undefined) {
    if(typeof index === 'number') {
      const { Audio } = this.state;
      this.setState({ voiceCommandNotRecognized: false }, Audio.playMediaIndex(index));
    }
    else {
      this.setState({ voiceCommandNotRecognized: true });
      setTimeout(() => {
        this.setState({ voiceCommandNotRecognized: false })
      }, 3000)
    }
  }

  SettingsCheckbox = ({settingTitle, settingDescription, codeName}: Setting) => {
    return (
      <div className="setting-item-wrapper">
        <p>{settingTitle}</p>
        <div onClick={() => this.toggleInfoModal(settingDescription)} className="setting-item-info">i</div>
        <div onClick={() => this.toggleSetting(codeName)} className={`setting setting-${codeName} ${this.state.settings[codeName] ? 'setting-active' : ''}`} />
      </div>
    )
  }

  render() {
    const { SettingsCheckbox } = this;
    const { listening, voiceCommandNotRecognized, lastGivenVoiceCommand } = this.state;
    this.browserWidth = window.innerWidth;
    return (
      <div className="app">
        <h1 className="header-title">Voice-Interactive Jukebox</h1>
        <h3>Settings</h3>
        <div className="settings-wrapper">
          {settings.map((item) => <SettingsCheckbox key={uuid()} {...item} />)}
        </div>
        <p className="recording-info"><span>Start Recording</span> and speak the name of your desired sound effect listed below.</p>
        <div className="recording-wrapper">
          <button onClick={this.toggleCaptureSound} className={`listening-button ${listening ? 'listening-button-listening' : ''}`}>{listening ? 'Stop Recording' : 'Start Recording'}</button>
          <div className={`rec-icon ${listening ? 'rec-icon-active' : ''}`}></div>
        </div>
        {lastGivenVoiceCommand ? <p className="message-text">Your latest <span>recorded</span> voice command:</p> : null}
        {lastGivenVoiceCommand ? <p className="message-text-lg">{lastGivenVoiceCommand}</p> : null}
        <p className={`message-text ${voiceCommandNotRecognized ? '' : 'message-text-fade'}`}>I'm sorry! Didn't quite catch that sound effect name.</p>
        <div className="hr" />
        <div className="sound-wrapper">
          <AudioList audio={allSounds} />
        </div>
      </div>
    );
  }
}



export default App;
