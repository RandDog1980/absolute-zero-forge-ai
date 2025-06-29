
export interface VoiceEventHandlers {
  onConnectionOpen: () => void;
  onConnectionClose: () => void;
  onConnectionError: (error: any) => void;
  onAudioDelta: (audioData: string) => Promise<void>;
  onTranscriptDelta: (text: string) => void;
  onSpeakingStart: () => void;
  onSpeakingEnd: () => void;
}

export class VoiceEventManager {
  private handlers: VoiceEventHandlers;

  constructor(handlers: VoiceEventHandlers) {
    this.handlers = handlers;
  }

  async initialize() {
    console.log('🎯 VoiceEventManager initialized');
  }

  handleSSEMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log('📨 Received SSE message:', data.type);

      switch (data.type) {
        case 'connection_established':
          this.handlers.onConnectionOpen();
          break;
          
        case 'openai_connected':
          console.log('✅ OpenAI connection established');
          break;
          
        case 'response.audio.delta':
          if (data.delta) {
            this.handlers.onAudioDelta(data.delta);
          }
          break;
          
        case 'response.audio_transcript.delta':
          if (data.delta) {
            this.handlers.onTranscriptDelta(data.delta);
          }
          break;
          
        case 'response.audio.done':
          this.handlers.onSpeakingEnd();
          break;
          
        case 'input_audio_buffer.speech_started':
          console.log('🎤 Speech started');
          break;
          
        case 'input_audio_buffer.speech_stopped':
          console.log('🎤 Speech stopped');
          break;
          
        case 'error':
          this.handlers.onConnectionError(data.error);
          break;
          
        default:
          console.log('📨 Unhandled message type:', data.type);
      }
    } catch (error) {
      console.error('❌ Error parsing SSE message:', error);
      this.handlers.onConnectionError(error);
    }
  }

  destroy() {
    console.log('🧹 VoiceEventManager destroyed');
  }
}

export const createAudioMessage = (audioData: Float32Array) => {
  // Convert Float32Array to base64 encoded PCM16
  const int16Array = new Int16Array(audioData.length);
  for (let i = 0; i < audioData.length; i++) {
    const s = Math.max(-1, Math.min(1, audioData[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }

  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return {
    type: 'input_audio_buffer.append',
    audio: btoa(binary)
  };
};
