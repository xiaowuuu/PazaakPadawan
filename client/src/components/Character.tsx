import React, { useState } from 'react';

const characters = [
  {
    id: 1,
    name: 'Chillbacca',
    image: 'src/assets/images/penguins/chillbacca1.jpeg',
  },
  {
    id: 2,
    name: 'Iceokapenguano',
    image: './src/assets/images/penguins/Iceokapenguano.jpeg',
  },
  {
    id: 3,
    name: 'Obipenguin',
    image: 'src/assets/images/penguins/obipenguin1.jpeg',
  },
  {
    id: 4,
    name: 'Pen-Giunjinn',
    image: 'src/assets/images/penguins/pen-giunjinn1.jpeg',
  },
  {
    id: 5,
    name: 'Penguinmaul',
    image: 'src/assets/images/penguins/penguinmaul1.jpeg',
  },
];

function Character() {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(
    null
  );

  const handleCharacterSelect = (characterId: number) => {
    setSelectedCharacter(characterId);
  };

  return (
    <div>
      <h2>Please choose your character!</h2>
      <div className="character-list">
        {characters.map((character) => (
          <div key={character.id} className="character-item">
            <img
              src={character.image}
              alt={character.name}
              onClick={() => handleCharacterSelect(character.id)}
            />
            <p>{character.name}</p>
          </div>
        ))}
      </div>

      {selectedCharacter !== null && (
        <div>
          <h3>You chose to be:</h3>
          <img
            src={characters[selectedCharacter - 1].image}
            alt={characters[selectedCharacter - 1].name}
          />
          <p> {characters[selectedCharacter - 1].name}</p>
        </div>
      )}
    </div>
  );
}

export default Character;
