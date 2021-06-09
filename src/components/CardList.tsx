import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import Router from 'next/router';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [imgUrl, setImgUrl] = useState('');
  // TODO MODAL USEDISCLOSURE

  // TODO SELECTED IMAGE URL STATE

  // TODO FUNCTION HANDLE VIEW IMAGE

  return (
    <>
      <SimpleGrid spacing="40px" columns={3}>
        {cards.map(card => (
          <Card
            key={card.id}
            data={card}
            viewImage={(url: string) => {
              setImgUrl(url);
              onOpen();
            }}
          />
        ))}
      </SimpleGrid>

      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={imgUrl} />
    </>
  );
}
