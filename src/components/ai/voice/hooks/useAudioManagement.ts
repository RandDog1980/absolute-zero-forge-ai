
import { useState, useRef, useCallback } from 'react';

export const useAudioManagement = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioQueueRef = useRef<Uint8Array[]>([]);
  const isPlayingRef = useRef(false);

  const initializeAudioPlayer = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    console.log('🔊 Audio player initialized');
  }, []);

  const startRecording = useCallback(async (onAudioData: (data: Float32Array) => void) => {
    try {
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      sourceRef.current = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
      
      processorRef.current.onaudioprocess = (event) => {
        const inputData = event.inputBuffer.getChannelData(0);
        onAudioData(new Float32Array(inputData));
      };
      
      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      
      setIsRecording(true);
      console.log('🎤 Recording started');
    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    setIsRecording(false);
    console.log('🎤 Recording stopped');
  }, []);

  const playAudioChunk = useCallback(async (audioData: Uint8Array) => {
    audioQueueRef.current.push(audioData);
    
    if (!isPlayingRef.current) {
      await playNextChunk();
    }
  }, []);

  const playNextChunk = useCallback(async () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const audioData = audioQueueRef.current.shift()!;

    try {
      if (!audioContextRef.current) {
        await initializeAudioPlayer();
      }

      // Convert PCM data to audio buffer
      const int16Data = new Int16Array(audioData.length / 2);
      for (let i = 0; i < audioData.length; i += 2) {
        int16Data[i / 2] = (audioData[i + 1] << 8) | audioData[i];
      }

      const audioBuffer = audioContextRef.current!.createBuffer(1, int16Data.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < int16Data.length; i++) {
        channelData[i] = int16Data[i] / 32768;
      }

      const source = audioContextRef.current!.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current!.destination);
      
      source.onended = () => {
        playNextChunk();
      };
      
      source.start(0);
    } catch (error) {
      console.error('❌ Error playing audio chunk:', error);
      playNextChunk(); // Continue with next chunk
    }
  }, [initializeAudioPlayer]);

  const stopSpeaking = useCallback(() => {
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsSpeaking(false);
    console.log('🔇 Audio playback stopped');
  }, []);

  const cleanup = useCallback(() => {
    stopRecording();
    stopSpeaking();
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    console.log('🧹 Audio management cleaned up');
  }, [stopRecording, stopSpeaking]);

  return {
    isRecording,
    isSpeaking,
    startRecording,
    stopRecording,
    initializeAudioPlayer,
    playAudioChunk,
    stopSpeaking,
    cleanup,
    setIsSpeaking
  };
};
