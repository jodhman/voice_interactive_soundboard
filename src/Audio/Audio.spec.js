import React from 'react';
import AudioList from './Audio';

describe('AudioList should', () => {
    const mockAudios = [
        { name: "uno", src: "uno_card" },
        { name: "dos", src: "dos_card" },
        { name: "tres", src: "tres_card" },
    ]
    const playSpy = jest.spyOn(HTMLAudioElement.prototype, 'play')
    const app = new AudioList({audio: mockAudios});

    it('play media given an index', () => {
        expect(playSpy).toHaveBeenCalledTimes(6)
    })
})