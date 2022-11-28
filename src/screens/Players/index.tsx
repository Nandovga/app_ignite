import {useState, useEffect, useRef} from "react";
import {Alert, FlatList, TextInput} from "react-native";
import {useRoute} from "@react-navigation/native";

import {AppError} from "@utils/AppError";

import {playerAddByGroup} from "@storage/player/playerAddByGroup";
import {playersGetByGroupTeam} from "@storage/player/playersGetByGroupTeam";
import {playerRemoveByGroup} from "@storage/player/playerRemoveByGroup";
import {PlayerStorageDTO} from "@storage/player/PlayerStorageDTO";

import {Header} from "@components/Header";
import {Highlight} from "@components/Highlight";
import {Button} from "@components/Button";
import {ButtonIcon} from "@components/ButtonIcon";
import {Input} from "@components/Input";
import {Filter} from "@components/Filter";
import {PlayerCard} from "@components/PlayerCard";
import {ListEmpty} from "@components/ListEmpty";

import {Container, Form, HeaderList, NumberOfPlayers} from './styles'

type RouteParams = {
    group: string
}

export function Players() {
    const route = useRoute();
    const {group} = route.params as RouteParams
    const newPlayerNameInputRef = useRef<TextInput>(null);

    const [team, setTeam] = useState('Time A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
    const [newPlayerName, setNewPlayerName] = useState('')

    async function handleAppPlayer() {
        if (newPlayerName.trim().length === 0)
            return Alert.alert('Novo pessoa', 'Informe o nome da pessoa pra adicionar');

        const newPlayer = {name: newPlayerName, team}
        try {
            await playerAddByGroup(newPlayer, group)
            newPlayerNameInputRef.current?.blur()

            setNewPlayerName('')
            fetchPlayersByTeam();
        } catch (error) {
            if (error instanceof AppError)
                Alert.alert("Nova pessoa", error.message)
            else {
                Alert.alert("Nova pessoa", "Não foi possível adicionar.");
                console.log(error)
            }
        }
    }

    async function handleRemovePlayer(playerName: string) {
        try{
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        }catch (error){
            console.log(error)
            Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.');
        }
    }

    async function fetchPlayersByTeam() {
        try {
            const playersByTeam = await playersGetByGroupTeam(group, team)
            setPlayers(playersByTeam)
        } catch (error) {
            console.log(error)
            Alert.alert('Pessoas', 'Não foi possível carregar pessoas do time selecionado!');
        }
    }

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team])

    return (
        <Container>
            <Header showBackButton/>
            <Highlight title={group}
                       subtitle="Adicione a galera e separe o time"/>
            <Form>
                <Input placeholder="Nome da pessoa"
                       autoCorrect={false}
                       value={newPlayerName}
                       onChangeText={setNewPlayerName}
                       inputRef={newPlayerNameInputRef}
                       onSubmitEditing={handleAppPlayer}
                       returnKeyType="done"/>
                <ButtonIcon icon="add"
                            onPress={handleAppPlayer}/>
            </Form>
            <HeaderList>
                <FlatList data={['Time A', 'Time B']}
                          keyExtractor={item => item}
                          renderItem={({item}) => <Filter title={item}
                                                          isActive={team === item}
                                                          onPress={() => setTeam(item)}/>}
                          horizontal/>
                <NumberOfPlayers>{players.length}</NumberOfPlayers>
            </HeaderList>
            <FlatList data={players}
                      keyExtractor={item => item.name}
                      renderItem={({item}) => <PlayerCard name={item.name}
                                                          onRemove={() => handleRemovePlayer(item.name)}/>}
                      ListEmptyComponent={() => <ListEmpty message='Não há pessoas nesse time'/>}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={[{paddingBottom: 100}, players.length === 0 && {flex: 1}]}
            />
            <Button title='Remover turma' type='SECONDARY'/>
        </Container>
    )
}
