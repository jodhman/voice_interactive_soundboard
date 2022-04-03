//@flow
import React from 'react';
import uuid from 'uuid/v4';

import './Audio.css';

export type AudioType = {
    name: string,
    src: string
}

type Props = {
    audio: Array<AudioType>
}

type State = {
    currentPlayingIndex: number
}

class AudioList extends React.Component<Props, State> {
    audioData: Array<*>

    constructor(props: Props) {
        super(props);
        this.state = {
            currentPlayingIndex: -1
        }
        // $FlowFixMe
        this.audioData = this.props.audio.map(audio => new Audio(audio.src))
    }

    playMediaIndex(index: number) {
        this.audioData[index].play();
    }

    toggleMedia(index: number) {
        const { currentPlayingIndex } = this.state;
        this.stopMedia();

        if(currentPlayingIndex === index) {
            this.setState({ currentPlayingIndex: -1 })
        } 
        else {
            this.playMedia(index);
        }
    }

    playMedia(index: number) {
        this.audioData[index].play();
        this.setState({ currentPlayingIndex: index })
    }

    stopMedia() {
        const { currentPlayingIndex } = this.state;
        if(currentPlayingIndex !== -1) {
            this.audioData[currentPlayingIndex].pause();
            this.audioData[currentPlayingIndex].currentTime = 0;
        }
    }

    render() {
        return(
            this.props.audio.map((audio, index) => <button key={uuid()} onClick={() => this.toggleMedia(index)} className="sound" name={makeCodeFriendly(audio.name)}>{audio.name.toUpperCase()}</button>)
        )
    }
}

const makeCodeFriendly = (value: string) => {
    return value.replace(' ', '_').toLowerCase().trim();
}

export default AudioList;