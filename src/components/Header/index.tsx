import {useNavigation} from "@react-navigation/native";

import logoImg from '@assets/logo.png';
import {Container, Logo, BackButton, BackIcon} from "@components/Header/styles";

type Props = {
    showBackButton?: boolean
}

export function Header({showBackButton = false}: Props) {
    const navigation = useNavigation();

    function handleGoBack(){
        navigation.navigate('groups');
    }

    return (
        <Container>
            {
                showBackButton &&
                <BackButton onPress={handleGoBack}>
                    <BackIcon/>
                </BackButton>
            }
            <Logo source={logoImg}/>
        </Container>
    )
}
