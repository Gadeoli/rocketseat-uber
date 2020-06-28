import React from 'react';
import { 
    Container,
    TypeTitle,
    TypeDescription,
    TypeImage,
    RequestButton,
    RequestButtonText
} from './styles'

import uberx from '../../assets/uberx.png'

const Details = () => {
    return <Container>
        <TypeTitle>Popular</TypeTitle>
        <TypeDescription>Viagens baratas para o dia a dia</TypeDescription>
        <TypeImage source={uberx} />

        <TypeTitle>UberX</TypeTitle>
        <TypeDescription>R$ 6,00</TypeDescription>
        <RequestButton onPress={() => {}}>
            <RequestButtonText>Solicitar UberX</RequestButtonText>
        </RequestButton>
    </Container>;
}

export default Details;