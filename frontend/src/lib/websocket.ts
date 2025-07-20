import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

const WS_URL = (typeof process !== 'undefined' && process.env && process.env.VITE_WS_URL) ? process.env.VITE_WS_URL : 'ws://localhost:8080/ws';

let client: Client | null = null;
let ticketSubscription: StompSubscription | null = null;
let notificationSubscription: StompSubscription | null = null;

const listeners: { [topic: string]: ((msg: any) => void)[] } = {};

export function connectWebSocket() {
  if (client && client.connected) return;
  client = new Client({
    brokerURL: WS_URL,
    reconnectDelay: 5000,
    onConnect: () => {
      subscribeToTopic('/topic/tickets');
      subscribeToTopic('/topic/notifications');
    },
  });
  client.activate();
}

function subscribeToTopic(topic: string) {
  if (!client) return;
  if (topic === '/topic/tickets' && ticketSubscription) return;
  if (topic === '/topic/notifications' && notificationSubscription) return;
  const sub = client.subscribe(topic, (message: IMessage) => {
    const body = JSON.parse(message.body);
    listeners[topic]?.forEach((cb) => cb(body));
  });
  if (topic === '/topic/tickets') ticketSubscription = sub;
  if (topic === '/topic/notifications') notificationSubscription = sub;
}

export function onTicketEvent(cb: (event: any) => void) {
  if (!listeners['/topic/tickets']) listeners['/topic/tickets'] = [];
  listeners['/topic/tickets'].push(cb);
  connectWebSocket();
}

export function onNotification(cb: (event: any) => void) {
  if (!listeners['/topic/notifications']) listeners['/topic/notifications'] = [];
  listeners['/topic/notifications'].push(cb);
  connectWebSocket();
}

export function disconnectWebSocket() {
  if (client) client.deactivate();
  ticketSubscription = null;
  notificationSubscription = null;
} 