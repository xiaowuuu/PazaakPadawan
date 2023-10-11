import BackgroundMusic from './BackgroundMusic';
import Header from './Header';
import ScoreLights from './ScoreLights';
import Card from './Card';
import TurnIndicator from './TurnIndicator';

function SoloGame() {
  let musicChoice: string = 'soloGame';
  let numGamesWonPlayer = 1;
  let numGamesWonOpponent = 2;
  return (
    <>
      <Header />
      <h1>Solo Game!</h1>
      <BackgroundMusic musicChoice={musicChoice} />
      <div className="playerBoard">
        <div className="player1">
          <ScoreLights numGamesWon={numGamesWonPlayer} />
          <div className="cardsContainer">
            <Card value={-1} color="red" cardType="normal_card" />
            <Card value={+1} color="blue" cardType="normal_card" />
          </div>
        </div>
        <div className="player2">
          <ScoreLights numGamesWon={numGamesWonOpponent} />
          <div className="cardsContainer">
            <Card value={-1} color="red" cardType="normal_card" />
            <Card value={+1} color="blue" cardType="normal_card" />
          </div>
        </div>
      </div>
      <TurnIndicator playerName="Pin-Gun Jinn" />
    </>
  );
}

export default SoloGame;
