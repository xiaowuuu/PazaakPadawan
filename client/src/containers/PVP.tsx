import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import PVPGame from '../components/PVPGame';

const PVP = () => {
  const BASE_URL = 'http://192.168.0.5';
  const port = 8080;
  const [, setStompClient] = useState<Stomp.Client>(
    Stomp.over(new SockJS(`${BASE_URL}:${port}/ws`))
  );
  const [serverConnected, setServerConnected] = useState(false);
  const [attemptReconnect, setAttemptReconnect] = useState(0);

  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}:${port}/ws`);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      console.log('Connected to server');
      // could subscribe or send messages here
      // this happens initially and then whenever there is a need to reconnect
      setServerConnected(true);

      client.ws.onclose = () => {
        console.log('Connection terminated');
        setServerConnected(false);
      };
      setStompClient(client);
    });
  }, [attemptReconnect]);

  return (
    <>
      {serverConnected == true ? null : (
        <div>
          <h5>Not connected to game server</h5>
          <button
            className="button"
            onClick={() => setAttemptReconnect(attemptReconnect + 1)}
          >
            Reconnect
          </button>
        </div>
      )}
      <PVPGame />
      <Chat />
    </>
  );
};

export default PVP;
