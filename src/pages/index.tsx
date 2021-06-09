import { Button, Box } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface List {
  url: string;
  description: string;
  title: string;
  ts: number;
  id: string;
}

interface AxiosResponse {
  after: string;
  data: List[];
}

type fetchImagesParams = {
  pageParam?: string | null;
};

const fetchImages = async ({ pageParam = null }: fetchImagesParams) => {
  const data = await api.get<AxiosResponse>('/images', {
    params: {
      after: pageParam,
    },
  });

  return data;
};

export default function Home(): JSX.Element {
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.data.after ?? null,
  });

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(image => image.data.data);
  }, [data]);

  /* eslint no-nested-ternary: "off" */
  return (
    <>
      <Header />
      {isLoading ? (
        <Loading />
      ) : isError ? (
        <Error />
      ) : (
        <Box maxW={1120} px={20} mx="auto" my={20}>
          <CardList cards={formattedData} />
          {hasNextPage && (
            <Button
              marginTop="40px"
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
            </Button>
          )}
        </Box>
      )}
    </>
  );

  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN
}
