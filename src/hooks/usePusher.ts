import { useEffect, useRef, useState } from "react";

interface PusherConnection {
  bind: (event: string, callback: () => void) => void;
  state: string;
}

interface PusherInstance {
  connection: PusherConnection;
  subscribe: (channelName: string) => PusherChannel;
  unsubscribe: (channelName: string) => void;
  disconnect: () => void;
}

interface PusherChannel {
  bind: (eventName: string, callback: (data: unknown) => void) => void;
  unbind: (eventName: string) => void;
  unbind_all: () => void;
}

interface PusherConstructor {
  new (key: string, options: { cluster: string }): PusherInstance;
}

interface UsePusherOptions {
  userId: string | null;
  channelName?: string;
}

export function usePusher({ userId, channelName }: UsePusherOptions) {
  const [isConnected, setIsConnected] = useState(false);
  const pusherRef = useRef<PusherInstance | null>(null);
  const channelRef = useRef<PusherChannel | null>(null);

  useEffect(() => {
    if (!userId) return;

    const initializePusher = async () => {
      try {
        const PusherModule = await import("pusher-js");
        const PusherClient = PusherModule.default as PusherConstructor;

        const pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
          cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = channelName || `${userId}-notification`;
        const channelInstance = pusherInstance.subscribe(channel);

        pusherRef.current = pusherInstance;
        channelRef.current = channelInstance;
        setIsConnected(true);

        pusherInstance.connection.bind("connected", () => {
          console.log("Pusher connected");
        });

        pusherInstance.connection.bind("disconnected", () => {
          console.log("Pusher disconnected");
          setIsConnected(false);
        });
      } catch (error) {
        console.error("Failed to initialize Pusher:", error);
      }
    };

    initializePusher();

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
      }
      if (pusherRef.current) {
        pusherRef.current.unsubscribe(channelName || `${userId}-notification`);
        pusherRef.current.disconnect();
      }
      setIsConnected(false);
    };
  }, [userId, channelName]);

  const bindEvent = (eventName: string, callback: (data: unknown) => void) => {
    if (channelRef.current) {
      channelRef.current.bind(eventName, callback);
    }
  };

  const unbindEvent = (eventName: string) => {
    if (channelRef.current) {
      channelRef.current.unbind(eventName);
    }
  };

  return {
    isConnected,
    bindEvent,
    unbindEvent,
    pusher: pusherRef.current,
    channel: channelRef.current,
  };
}
