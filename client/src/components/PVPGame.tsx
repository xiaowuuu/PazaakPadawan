import { Client } from 'stompjs';
import Header from './Header';
import ScoreLights from './ScoreLights';
import { useEffect, useState } from 'react';
import Hand from './Hand';
import Card from './Card';
import PlayBar from './PlayBar';
import cardflip from '../assets/music/flipcardfast.mp3';
import { useLocation, useNavigate } from 'react-router-dom';
import GameButtons from './GameButtons';
import EndGamePopup from './EndGamePopUp';
import PopUp from './PopUP/PopUp';

interface DeckCard {
  value: number;
  color: string;
  selected: boolean;
  imagePath: string;
}

interface CardProps {
  value: number;
  color: string;
}

interface Player {
  name: string;
  action: PlayerState;
  wonGame: boolean;
  isTurn: boolean;
  hand: CardProps[];
  tally: number;
  table: CardProps[];
  gamesWon: number;
  playedCardThisTurn: boolean;
}

enum GameState {
  INITIAL = 'initial',
  STARTED = 'started',
  ENDED = 'ended',
}

enum PlayerState {
  PLAY = 'play',
  STAND = 'stand',
  ENDTURN = 'endturn',
}

interface UserData {
  username: string;
  receiverName: string;
  connected: boolean;
  message: string;
}

interface PVPGameProps {
  stompClient: Client;
  userData: UserData;
  // setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

function PVPGame({ stompClient, userData }: PVPGameProps): JSX.Element {
  const location = useLocation();
  const selectedHand = location?.state?.selectedHand;
  // const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
  const [endRoundMessage, setEndRoundMessage] = useState<string>('');
  const [showEndRoundPopup, setShowEndRoundPopup] = useState(false);

  function generateRandomHand() {
    const randomHand = [];
    for (let i = 0; i < 4; i++) {
      const randomValue = Math.floor(Math.random() * 6) + 1;
      const randomColor = Math.random() < 0.5 ? 'blue' : 'red';
      if (randomColor === 'red') {
        const cardProps: CardProps = {
          value: -randomValue,
          color: randomColor,
        };
        randomHand.push(cardProps);
      } else {
        const cardProps: CardProps = { value: randomValue, color: randomColor };
        randomHand.push(cardProps);
      }
    }
    return randomHand;
  }
  const initialPlayer: Player = {
    name: 'Player 1',
    action: PlayerState.PLAY,
    wonGame: false,
    isTurn: false,
    hand: selectedHand
      ? selectedHand.map((card: DeckCard) => ({
          value: card.value,
          color: card.color,
        }))
      : generateRandomHand(),
    tally: 0,
    table: [],
    gamesWon: 0,
    playedCardThisTurn: false,
  };

  const initialOtherPlayer: Player = {
    name: 'Player 2',
    action: PlayerState.PLAY,
    wonGame: false,
    isTurn: false,
    hand: [],
    tally: 0,
    table: [],
    gamesWon: 0,
    playedCardThisTurn: false,
  };

  const [player, setPlayer] = useState(initialPlayer);
  const [otherPlayer, setOtherPlayer] = useState(initialOtherPlayer);
  const [otherPlayerName, setOtherPlayerName] = useState('Player 2');
  const [otherPlayerHand, setOtherPlayerHand] = useState([]);
  const [otherPlayerTable, setOtherPlayerTable] = useState([]);
  const [musicChoice] = useState('pvpGame');
  const [gameState, setGameState] = useState(GameState.INITIAL);

  useEffect(() => {
    if (otherPlayerName != 'Player 2') {
      console.log('setting name');
      setOtherPlayer({ ...otherPlayer, name: otherPlayerName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherPlayerName]);

  useEffect(() => {
    if (otherPlayerName != 'Player 2') {
      console.log('setting hand');
      setOtherPlayer({
        ...otherPlayer,
        name: otherPlayerName,
        hand: otherPlayerHand,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherPlayerHand]);

  useEffect(() => {
    if (otherPlayerName != 'Player 2') {
      console.log('setting table');
      setOtherPlayer({
        ...otherPlayer,
        name: otherPlayerName,
        table: otherPlayerTable,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherPlayerTable]);

  const navigate = useNavigate();
  const handleGameOverClick = () => {
    navigate('/');
  };

  function getRandomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  function showEndRoundWinner(winner: string) {
    setEndRoundMessage(winner);
    setShowEndRoundPopup(true);
  }
  // function addCardToTable(newPlayer: Player): Player | null {
  //   const audio = new Audio(cardflip);
  //   audio.play();
  //   const randomNumber = getRandomNumber();
  //   const newCard = (
  //     <Card value={randomNumber} color="green" cardType="normal_card" />
  //   );
  //   if (newPlayer.isTurn && newPlayer.action != PlayerState.STAND) {
  //     setPlayer({
  //       ...newPlayer,
  //       tally: newPlayer.tally + randomNumber,
  //       table: [...newPlayer.table, newCard],
  //       action: PlayerState.PLAY,
  //     });
  //     return null;
  //   }
  //   if (newPlayer.action == PlayerState.STAND) {
  //     console.log('player stood');
  //   }

  //   if (!newPlayer.isTurn && otherPlayer.action != PlayerState.STAND) {
  //     console.log('otherPlayer.action before', otherPlayer.action);
  //     const newOtherPlayer = {
  //       ...otherPlayer,
  //       tally: otherPlayer.tally + randomNumber,
  //       table: [...otherPlayer.table, newCard],
  //       action: PlayerState.PLAY,
  //     };
  //     setOtherPlayer(newOtherPlayer);
  //     console.log('otherPlayer.action after', otherPlayer.action);
  //     return newOtherPlayer;
  //   }
  //   console.log('both stood');
  //   return null;
  // }

  //new
  function getNewCardForTable(): CardProps {
    const audio = new Audio(cardflip);
    audio.play();
    const randomNumber = getRandomNumber();
    return { value: randomNumber, color: 'green' };
  }

  // async function handleEndTurnButtonClick() {
  //   const newPlayer = {
  //     ...player,
  //     isTurn: false,
  //     action: PlayerState.ENDTURN,
  //   };
  //   setPlayer(newPlayer);
  //   console.log(
  //     'newPlayer, newPlayer.action',
  //     newPlayer,
  //     ', ',
  //     newPlayer.action
  //   );
  //   const newOtherPlayer = addCardToTable(newPlayer);
  //   const ePlayer = newOtherPlayer ? newOtherPlayer : otherPlayer;
  //   await delay(3000); // wait for 3 seconds while the AI "decides..."
  //   if (newPlayer.tally >= 20 || ePlayer.tally >= 20) {
  //     await endOfRoundCleaning(ePlayer);
  //   } else {
  //     setGameState(GameState.STARTED);
  //     const newPlayer = {
  //       ...player,
  //       isTurn: true,
  //       playedCardThisTurn: false,
  //     };
  //     setPlayer(newPlayer);
  //     addCardToTable(newPlayer);
  //   }
  // }

  // new
  function handlePlayerEndTurnButtonClick() {
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.ENDTURN,
    };
    setPlayer(newPlayer);

    console.log('newPlayer, newPlayer.action', player, ', ', player.action);

    const card = getNewCardForTable();
    stompClient.send(
      '/app/updateTable',
      {
        id: 'table',
      },
      JSON.stringify(player.table)
    );
    const newOtherPlayer = {
      ...otherPlayer,
      isTurn: true,
      playedCardThisTurn: false,
      tally: otherPlayer.tally + card.value,
      table: [...otherPlayer.table, card],
      action: PlayerState.PLAY,
    };

    if (newPlayer.tally >= 20 || newOtherPlayer.tally >= 20) {
      endOfRoundCleaning(newPlayer, newOtherPlayer);
    } else {
      setGameState(GameState.STARTED);
      setOtherPlayer(newOtherPlayer);
      // sendUpdateToWebSocket(
      //   newPlayer,
      //   newOtherPlayer,
      //   GameState.STARTED,
      //   sessionID
      // );
    }
  }

  // function getRoundWinner(otherPlayer: Player) {
  //   console.log(
  //     'Player Score: ',
  //     player.tally,
  //     'Other Player Score: ',
  //     otherPlayer.tally
  //   );
  //   const playerBust = player.tally > 20;
  //   const otherPlayerBust = otherPlayer.tally > 20;
  //   const otherPlayerWon = otherPlayer.tally <= 20;
  //   const playerWon = player.tally <= 20;
  //   const tie = player.tally == otherPlayer.tally;
  //   const playerLessThanOther = player.tally < otherPlayer.tally;
  //   const otherPlayerLessThanPlayer = player.tally > otherPlayer.tally;
  //   const playerReturn = 1;
  //   const otherPlayerPlayerReturn = 0;
  //   const tieOrBustReturn = -1;

  //   if (playerBust && otherPlayerBust) {
  //     console.log('you both went bust');
  //     return tieOrBustReturn;
  //   }
  //   if (playerBust && otherPlayerWon) {
  //     console.log('opponent won');
  //     return otherPlayerPlayerReturn;
  //   }
  //   if (otherPlayerBust && playerWon) {
  //     console.log('you won');
  //     return playerReturn;
  //   }
  //   if (tie) {
  //     console.log('you tied');
  //     return tieOrBustReturn;
  //   }
  //   if (playerLessThanOther) {
  //     console.log('opponent won');
  //     return otherPlayerPlayerReturn;
  //   }
  //   if (otherPlayerLessThanPlayer) {
  //     console.log('you won');
  //     return playerReturn;
  //   }
  //   console.log('the round is over', player.tally, otherPlayer.tally);
  // }

  //new
  function getRoundWinner(player: Player, otherPlayer: Player) {
    console.log(
      'Player Score: ',
      player.tally,
      'Other Player Score: ',
      otherPlayer.tally
    );
    const playerBust = player.tally > 20;
    const otherPlayerBust = otherPlayer.tally > 20;
    const otherPlayerWon = otherPlayer.tally <= 20;
    const playerWon = player.tally <= 20;
    const tie = player.tally == otherPlayer.tally;
    const playerLessThanOther = player.tally < otherPlayer.tally;
    const otherPlayerLessThanPlayer = player.tally > otherPlayer.tally;
    const playerReturn = 1;
    const otherPlayerPlayerReturn = 0;
    const tieOrBustReturn = -1;

    if (playerBust && otherPlayerBust) {
      console.log('you both went bust');
      return tieOrBustReturn;
    }
    if (playerBust && otherPlayerWon) {
      console.log('opponent won');
      return otherPlayerPlayerReturn;
    }
    if (otherPlayerBust && playerWon) {
      console.log('you won');
      return playerReturn;
    }
    if (tie) {
      console.log('you tied');
      return tieOrBustReturn;
    }
    if (playerLessThanOther) {
      console.log('opponent won');
      return otherPlayerPlayerReturn;
    }
    if (otherPlayerLessThanPlayer) {
      console.log('you won');
      return playerReturn;
    }
    console.log('the round is over', player.tally, otherPlayer.tally);
  }

  // async function handleStandButtonClick() {
  //   // setGameState(GameState.STAND);
  //   const newPlayer = {
  //     ...player,
  //     isTurn: false,
  //     action: PlayerState.STAND,
  //   };
  //   setPlayer(newPlayer);
  //   const newOtherPlayer = addCardToTable(newPlayer);
  //   await delay(3000); // wait for 3 seconds while the AI "decides...";
  //   await endOfRoundCleaning(newOtherPlayer);
  // }

  // new
  async function handlePlayerStandButtonClick() {
    const newPlayer = {
      ...player,
      isTurn: false,
      action: PlayerState.STAND,
    };
    setPlayer(newPlayer);

    const card = getNewCardForTable();
    const newOtherPlayer = {
      ...otherPlayer,
      isTurn: true,
      playedCardThisTurn: false,
      tally: otherPlayer.tally + card.value,
      table: [...otherPlayer.table, card],
      action: PlayerState.PLAY,
    };
    setOtherPlayer(newOtherPlayer);

    endOfRoundCleaning(newPlayer, newOtherPlayer);
  }

  // async function handleStartButtonClick() {
  //   const newPlayer = {
  //     ...player,
  //     isTurn: true,
  //     playedCardThisTurn: false,
  //   };
  //   setPlayer(newPlayer);
  //   addCardToTable(newPlayer);
  //   setGameState(GameState.STARTED);
  // }

  // new
  async function handleStartButtonClick() {
    const card = getNewCardForTable();
    const newPlayer = {
      ...player,
      isTurn: true,
      playedCardThisTurn: false,
      tally: otherPlayer.tally + card.value,
      table: [...otherPlayer.table, card],
      action: PlayerState.PLAY,
    };
    setPlayer(newPlayer);

    setGameState(GameState.STARTED);
    // sendUpdateToWebSocket(newPlayer, otherPlayer, GameState.STARTED, sessionID);
  }

  // async function endOfRoundCleaning(newOtherPlayer: Player | null) {
  //   const winner = getRoundWinner(
  //     newOtherPlayer ? newOtherPlayer : otherPlayer
  //   );
  //   if (winner === 1) {
  //     showEndRoundWinner('YOU WIN THE ROUND!');
  //   } else if (winner === 0) {
  //     showEndRoundWinner('OPPONENT WINS THE ROUND');
  //   } else {
  //     showEndRoundWinner('THIS ROUND IS TIED');
  //   }
  //   setPlayer({
  //     ...player,
  //     hand: player.hand,
  //     table: [],
  //     tally: 0,
  //     action: PlayerState.PLAY,
  //     gamesWon: winner === 1 ? player.gamesWon + 1 : player.gamesWon,
  //     playedCardThisTurn: false,
  //   });
  //   setOtherPlayer({
  //     ...otherPlayer,
  //     hand: otherPlayer.hand,
  //     table: [],
  //     tally: 0,
  //     action: PlayerState.PLAY,
  //     gamesWon: winner === 0 ? otherPlayer.gamesWon + 1 : otherPlayer.gamesWon,
  //     playedCardThisTurn: false,
  //   });

  //   setGameState(GameState.INITIAL);
  // }

  // new
  function endOfRoundCleaning(player: Player, otherPlayer: Player) {
    const winner = getRoundWinner(player, otherPlayer);
    if (winner === 1) {
      showEndRoundWinner('YOU WIN THE ROUND!');
    } else if (winner === 0) {
      showEndRoundWinner('OPPONENT WINS THE ROUND');
    } else {
      showEndRoundWinner('THIS ROUND IS TIED');
    }
    const newPlayer = {
      ...player,
      hand: player.hand,
      table: [],
      tally: 0,
      action: PlayerState.PLAY,
      gamesWon: winner === 1 ? player.gamesWon + 1 : player.gamesWon,
      playedCardThisTurn: false,
    };
    setPlayer(newPlayer);
    const newOtherPlayer = {
      ...otherPlayer,
      hand: otherPlayer.hand,
      table: [],
      tally: 0,
      action: PlayerState.PLAY,
      gamesWon: winner === 0 ? otherPlayer.gamesWon + 1 : otherPlayer.gamesWon,
      playedCardThisTurn: false,
    };
    setOtherPlayer(newOtherPlayer);

    setGameState(GameState.INITIAL);
    // sendUpdateToWebSocket(
    //   newPlayer,
    //   newOtherPlayer,
    //   GameState.INITIAL,
    //   sessionID
    // );
  }

  // function moveCard(card: JSX.Element, index: number) {
  //   // if no cards have been played yet this turn, play a card

  //   if (gameState === GameState.STARTED && !player.playedCardThisTurn) {
  //     const audio = new Audio(cardflip);
  //     audio.play();
  //     player.hand.splice(index, 1);
  //     setPlayer({
  //       ...player,
  //       hand: player.hand,
  //       table: [...player.table, card],
  //       tally: player.tally + card.props.value,
  //       playedCardThisTurn: true,
  //     });
  //   }
  // }

  // new

  function moveCard(card: JSX.Element, index: number) {
    // if no cards have been played yet this turn, play a card

    if (
      gameState === GameState.STARTED &&
      !player.playedCardThisTurn &&
      player.isTurn
    ) {
      const audio = new Audio(cardflip);
      audio.play();
      player.hand.splice(index, 1);
      const newPlayer = {
        ...player,
        hand: player.hand,
        table: [
          ...player.table,
          { value: card.props.value, color: card.props.color },
        ],
        tally: player.tally + card.props.value,
        playedCardThisTurn: true,
      };
      setPlayer(newPlayer);
      // sendUpdateToWebSocket(newPlayer, otherPlayer, gameState, sessionID);
    }

    if (
      gameState === GameState.STARTED &&
      !otherPlayer.playedCardThisTurn &&
      otherPlayer.isTurn
    ) {
      const audio = new Audio(cardflip);
      audio.play();
      otherPlayer.hand.splice(index, 1);
      const newOtherPlayer = {
        ...otherPlayer,
        hand: otherPlayer.hand,
        table: [
          ...otherPlayer.table,
          { value: card.props.value, color: card.props.color },
        ],
        tally: otherPlayer.tally + card.props.value,
        playedCardThisTurn: true,
      };
      setOtherPlayer(newOtherPlayer);
      // sendUpdateToWebSocket(player, newOtherPlayer, gameState, sessionID);
    }
  }

  function joinRoom() {
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to subcribe to events.');
      return;
    }
    // stompClient.subscribe('/game/gameObject', onGameUpdateReceived);
    stompClient.subscribe('/game/playerName', onPlayerNameReceived);
    stompClient.subscribe('/game/hand', onHandReceived);
    stompClient.subscribe('/game/table', onTableReceived);
    sendInitialConnectingData();
  }

  // interface GameObject {
  //   player1: Player;
  //   player2: Player;
  //   gameState: GameState;
  //   // sessionID: string;
  // }

  const sendInitialConnectingData = () => {
    // We will always set the player1 name to the user name on initial connection.
    // The backend will handle assigning the players.
    // const gameObject: GameObject = {
    //   player1: player,
    //   player2: otherPlayer,
    //   gameState: gameState,
    //   // sessionID: sessionID,
    // };
    // console.log('LOOK HERE', gameObject);
    setPlayer({ ...player, name: userData.username });
    console.log('LOOK HERE', userData.username);
    if (!stompClient) {
      console.warn('stompClient is undefined. Unable to send message.');
      return;
    }
    // stompClient.send(
    //   '/app/updateGame',
    //   {
    //     id: 'game',
    //   },
    //   JSON.stringify(gameObject)
    // );
    stompClient.send(
      '/app/updatePlayerName',
      {
        id: 'name',
      },
      JSON.stringify(userData.username)
    );
    stompClient.send(
      '/app/updateHand',
      {
        id: 'hand',
      },
      JSON.stringify(player.hand)
    );
  };

  interface Payload {
    body: string;
  }

  const onPlayerNameReceived = (payload: Payload) => {
    const payloadData = JSON.parse(payload.body);
    if (payloadData != userData.username) {
      console.log(
        'the name: ',
        userData.username,
        ' and the name: ',
        payloadData,
        ' are not equal'
      );
      if (payloadData != null) {
        setOtherPlayerName(payloadData);
      }
    }
    return;
  };

  function onHandReceived(payload: Payload) {
    const payloadData = JSON.parse(payload.body);
    if (JSON.stringify(payloadData) != JSON.stringify(player.hand)) {
      console.log(
        'the hand ',
        player.hand,
        ' and the hand ',
        payloadData,
        ' are not equal.'
      );
      setOtherPlayerHand(payloadData);
    }
    console.log('Hand payloadData: ', payloadData);
  }

  function onTableReceived(payload: Payload) {
    const payloadData = JSON.parse(payload.body);
    if (JSON.stringify(payloadData) != JSON.stringify(player.table)) {
      console.log(
        'the hand ',
        player.table,
        ' and the hand ',
        payloadData,
        ' are not equal.'
      );
      setOtherPlayerTable(payloadData);
    }
    console.log('Table payloadData: ', payloadData);
  }

  // new
  const listOfCards = (cards: CardProps[]): JSX.Element[] =>
    cards.map((card) => {
      return (
        <Card value={card.value} color={card.color} cardType="normal_card" />
      );
    });

  return (
    <>
      <Header musicChoice={musicChoice} />
      <div className="playerNames">
        <h3>
          userData.username: {userData.username} or player.name: {player?.name}
        </h3>
        <h3>otherPlayer.name: {otherPlayer?.name}</h3>
      </div>

      <div className="scoreBoard">
        <ScoreLights numGamesWon={player.gamesWon} />
        <PlayBar
          playerTally={player.tally}
          opponentTally={otherPlayer.tally}
          isPlayerTurn={player.isTurn}
          gameState={gameState}
        />
        <ScoreLights numGamesWon={otherPlayer.gamesWon} />
      </div>
      <hr />
      <div className="playerBoard">
        <div className="player1">
          <div className="table">
            {/* <Hand hand={player.table} /> */}
            <Hand hand={listOfCards(player.table)} />
          </div>
          <hr />
          <div className="hand">
            {/* <Hand hand={player.hand} moveCard={moveCard} /> */}
            <Hand hand={listOfCards(player.hand)} moveCard={moveCard} />
          </div>
          <div className="turnOptions">
            <GameButtons
              gameState={gameState}
              // onStand={handleStandButtonClick}
              // onEndTurn={handleEndTurnButtonClick}
              // new
              onStand={handlePlayerStandButtonClick}
              onEndTurn={handlePlayerEndTurnButtonClick}
              onStartGame={handleStartButtonClick}
              isPlayerTurn={player.isTurn}
            />
          </div>
          <button onClick={joinRoom}>Join Room</button>
        </div>
        <div className="player2">
          <div className="table">
            {/* <Hand hand={otherPlayer.table} /> */}
            <Hand hand={listOfCards(otherPlayer.table)} />
          </div>
          <hr />
          <div className="hand">
            {/* <Hand hand={otherPlayer.hand} /> */}
            <Hand hand={listOfCards(otherPlayer.hand)} />
          </div>
        </div>
        <div className="center-message">
          <EndGamePopup
            numGamesWonPlayer={player.gamesWon}
            numGamesWonOpponent={otherPlayer.gamesWon}
            handleGameOverClick={handleGameOverClick}
          />
        </div>
        <div className="center-message">
          {showEndRoundPopup && (
            <PopUp
              message={endRoundMessage}
              buttonText="OK"
              onClick={() => {
                setShowEndRoundPopup(false);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
export default PVPGame;
