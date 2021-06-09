import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface FormProps {
  image: string;
  title: string;
  description: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Arquivo obrigatório',
      validate: {
        lessThan10MB: v =>
          Number(v.size) <= 10000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: v =>
          v.type === 'image/jpeg' ||
          v.type === 'image/png' ||
          v.type === 'image/gif' ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
    },
    title: {
      required: 'Título obrigatório',
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    async (data: FormProps) => {
      const response = await api.post('/images', {
        url: imageUrl,
        title: data.title,
        description: data.description,
      });

      // TODO ONSUCCESS MUTATION

      return response.data.success;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('images');
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit: SubmitHandler<FormProps> = async (data): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          title: 'Imagem não adicionada',
        });
        return;
      }

      const imageFinal = {
        image: imageUrl,
        title: data.title,
        description: data.description,
      };

      await mutation.mutateAsync(imageFinal);

      toast({
        status: 'success',
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
      });

      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST
    } catch {
      toast({
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        title: 'Falha no cadastro',
      });
    } finally {
      reset({ title: '', description: '' });
      setImageUrl('');
      setLocalImageUrl('');
      closeModal();
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          name="image"
          error={errors.image}
          onChange={async e => setLocalImageUrl(e.target.value)}
          {...(register('image'), formValidations.image)}
          // TODO SEND IMAGE ERRORS
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title')}
          // TODO SEND TITLE ERRORS
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          name="description"
          {...register('description', formValidations.description)}
          // TODO SEND DESCRIPTION ERRORS
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
