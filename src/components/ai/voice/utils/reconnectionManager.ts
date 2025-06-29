
export class ReconnectionManager {
  private maxAttempts: number;
  private currentAttempts: number = 0;
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(maxAttempts: number = 3) {
    this.maxAttempts = maxAttempts;
  }

  async attemptReconnect(reconnectFn: () => Promise<void>, onMaxAttemptsReached: () => void) {
    if (this.currentAttempts >= this.maxAttempts) {
      console.error(`❌ Max reconnection attempts (${this.maxAttempts}) reached`);
      onMaxAttemptsReached();
      return;
    }

    this.currentAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.currentAttempts - 1), 10000); // Exponential backoff, max 10s
    
    console.log(`🔄 Attempting reconnection ${this.currentAttempts}/${this.maxAttempts} in ${delay}ms...`);
    
    this.timeoutId = setTimeout(async () => {
      try {
        await reconnectFn();
        this.resetAttempts();
      } catch (error) {
        console.error(`❌ Reconnection attempt ${this.currentAttempts} failed:`, error);
        // Will try again on next disconnect if under max attempts
      }
    }, delay);
  }

  resetAttempts() {
    this.currentAttempts = 0;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  cleanup() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.currentAttempts = 0;
  }
}
