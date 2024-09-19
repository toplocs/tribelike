export class ChatService {
  private events: { [key: string]: Array<(...args: any[]) => void> } = {};

  on(event: string, listener: (...args: any[]) => void) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: (...args: any[]) => void) {
    if (!this.events[event]) return;

    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return;

    this.events[event].forEach(listener => listener(...args));
  }

  sendMessage(message: { content: string; sender: string }) {
    this.emit('message', message);
  }

  connect() {
    this.emit('connect');
  }

  disconnect() {
    this.emit('disconnect');
  }
}

export const chatService = new ChatService();
