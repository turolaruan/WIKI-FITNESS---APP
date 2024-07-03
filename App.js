import * as React from 'react';
import { Text, View, Image, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { Pedometer } from 'expo-sensors';
import firebase from './config/config'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 1 - Cadastrar - Nome, Email, Senha

class Cadastro extends React.Component {
    constructor(props) {
        super(props);
        this.som = new Audio.Sound();
        this.som.loadAsync(require('./assets/yeahbuddy.mp3'));
        this.tocar = false;
        this.state = {
            name: undefined,
            user: undefined,
            password: undefined,
        }
    }

    //funcao para tocar o audio
    tocarA() {
        this.som.playAsync();
        this.som.setOnPlaybackStatusUpdate((status) => {
            if(status.didJustFinish == true){
                this.som.setPositionAsync(0);
            }
        })
    }

    //funcao para gravar os dados no firebase
    gravar(){
        const email = this.state.user.toLowerCase();
        const password = this.state.password.toLowerCase();

        firebase.auth() // autenticação
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                alert('Usuário cadastrado com sucesso!');
                this.props.navigation.navigate("Home");
                this.tocarA();
                this.tocar = true;
                firebase.database().ref('users').push({
                    name: this.state.name,
                    user: this.state.user,
                    password: this.state.password
                })
            })
            .catch(error => {
                alert('Erro ao cadastrar usuário: ' +  error);
                this.tocar = false;
            });
    }
    
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/aplicattivo2.jpeg')}
                    style={{width: Dimensions.get('window').width*0.650,
                        height: Dimensions.get('window').width*0.627,alignSelf: 'center',
                        marginTop: 10}}>
                </Image>
                <TextInput
                    style={estilo.input}
                    placeholder="Nome"
                    placeholderTextColor="gray"
                    onChangeText={(texto) => this.setState({ name: texto })}>
                </TextInput>
                <TextInput
                    style={estilo.input}
                    placeholder="Email"
                    placeholderTextColor="gray"
                    onChangeText={(texto) => this.setState({ user: texto })}>
                </TextInput>
                <TextInput
                    style={estilo.input}
                    placeholder="Senha"
                    placeholderTextColor="gray"
                    secureTextEntry={true}
                    onChangeText={(texto) => this.setState({ password: texto })}>
                </TextInput>
                <TouchableOpacity style={estilo.botao} onPress={() => this.gravar()}>
                    <Text style={estilo.botaoTexto}>Cadastrar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

// 2 - Login - Email, Senha

class Login extends React.Component{
    constructor(props){
        super(props);
        this.som = new Audio.Sound();
        this.som.loadAsync(require('./assets/yeahbuddy.mp3'));
        this.tocar = false;
        this.state = {
            usuario: undefined,
            senha: undefined
        }
    }

    //funcao para tocar o audio
    tocarA() {
        this.som.playAsync();
        this.som.setOnPlaybackStatusUpdate((status) => {
            if(status.didJustFinish == true){
                this.som.setPositionAsync(0);
            }
        })
    }

    render(){
        return(
            <View style={estilo.container}>
                <Image
                    source={require('./assets/aplicattivo2.jpeg')}
                    style={{width: Dimensions.get('window').width*0.650,
                        height: Dimensions.get('window').width*0.627,alignSelf: 'center',
                        marginTop: 10}}>
                </Image>
                <TextInput
                    style={estilo.input}
                    placeholder="Email"
                    placeholderTextColor="gray"
                    onChangeText={(texto) => this.setState({ usuario: texto })}>
                </TextInput>
                <TextInput
                    style={estilo.input}
                    placeholder="Senha"
                    placeholderTextColor="gray"
                    secureTextEntry={true}
                    onChangeText={(texto) => this.setState({ senha: texto })}>
                </TextInput>
                <TouchableOpacity style={estilo.botao} onPress={() => this.ler()}>
                    <Text style={estilo.botaoTexto}>Login</Text>
                </TouchableOpacity>
            </View>
        )
    }

    //funcao para ler os dados do firebase
    ler(){
        const email = this.state.usuario.toLowerCase();
        const password = this.state.senha.toLowerCase();

        firebase.auth() // autenticação
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                alert("Logado!!!");
                this.props.navigation.navigate("Home");
                this.tocarA();
                this.tocar = true;
            })
            .catch(error => {
                const errorCode = error.code;
                if (errorCode == "auth/invalid-email") {
                    console.log("Formato do email invalido");
                    alert("Formato do email invalido");
                } else {
                    console.log("Erro Desconhecido");
                    alert("Ocorreu um erro");
                    this.tocar = false;
                }
            });
    }
}

// TabNavigator - Login e Cadastro

class NavTab extends React.Component{
    render(){
        return(
            <Tab.Navigator
                initialRouteName="Login"
                screenOptions={{
                    unmountOnBlur: true,
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: 'rgba(54,54,54,0)',
                        position: 'absolute',
                        borderTopWidth: 0,
                    },
                    tabBarActiveTintColor: '#e91e63',
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                    },
                }}>
                <Tab.Screen
                    name="Login"
                    component={Login}
                    options={{
                        tabBarLabel: 'Login',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="login" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Cadastro"
                    component={Cadastro}
                    options={{
                        tabBarLabel: 'Cadastro',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-plus" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        )
    }
}

// TabNavigator - Home, Passos, Sobre

class NavTab2 extends React.Component {
    render() {
        return (
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    unmountOnBlur: true,
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: 'rgba(54,54,54,0)',
                        position: 'absolute',
                        borderTopWidth: 0,
                    },
                    tabBarActiveTintColor: '#e91e63',
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabelStyle: {
                        fontWeight: 'bold',
                    },
                }}>
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerShown: false,
                        tabBarLabel: 'Exercicios',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Passos"
                    component={Passos}
                    options={{
                        headerShown: false,
                        tabBarLabel: 'Passos',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="shoe-print" color={color} size={size} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Sobre"
                    component={SobreScreen}
                    options={{
                        headerShown: false,
                        tabBarLabel: 'Sobre',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="information" color={color} size={size} />
                        ),
                    }}
                />
            </Tab.Navigator>
        )
    }
}

// 3 - Home - botoes por categoria: perna, braço, peito, costas, ombro, abdômen

class HomeScreen extends React.Component {
    constructor(props){
        super(props)
        this.som = new Audio.Sound();
        this.som.loadAsync(require('./assets/qm-vc-pensa-q-e-cbum.mp3'));
        this.tocar = false;
        this.state={
        };
    }

    tocarA() { // funcao para tocar o audio
        this.som.playAsync();
        this.som.setOnPlaybackStatusUpdate((status) => {
            if(status.didJustFinish == true){
                this.som.setPositionAsync(0);
            }
        })
    }

    render() {
        return (
            <View style={estilo.container}>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Perna")}>
                    <Text style={estilo.botaoTexto2}>{"Perna"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Braco")}>
                    <Text style={estilo.botaoTexto2}>{"Braço"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Peito")}>
                    <Text style={estilo.botaoTexto2}>{"Peito"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Costas")}>
                    <Text style={estilo.botaoTexto2}>{"Costas"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Ombro")}>
                    <Text style={estilo.botaoTexto2}>{"Ombro"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Abdomen")}>
                    <Text style={estilo.botaoTexto2}>{"Abdômen"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.tocarA()}>
                    <Text style={estilo.botaoTexto2}>{"Comprar Bomba"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// 3.1 - Perna - botoes por exercicio: agachamento, leg press, extensora, flexora, panturrilha

class PernaScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Agachamento")}>
                    <Text style={estilo.botaoTexto2}>{"Agachamento"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("LegPress")}>
                    <Text style={estilo.botaoTexto2}>{"Leg Press"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Extensora")}>
                    <Text style={estilo.botaoTexto2}>{"Extensora"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Flexora")}>
                    <Text style={estilo.botaoTexto2}>{"Flexora"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Panturrilha")}>
                    <Text style={estilo.botaoTexto2}>{"Panturrilha"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// 3.1.1 - Agachamento - explicacao dos exercicios: agachamento

class AgachamentoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/Agachamento-livre.jpg')}
                    style={{width: Dimensions.get('window').width*0.870,
                        height: Dimensions.get('window').width*0.460,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um exercício que trabalha vários músculos, especialmente os das pernas e glúteos. Sua execução consiste em flexionar os joelhos até a amplitude desejada, como se fosse se sentar em uma cadeira imaginária."}</Text>
                <Text style={estilo.textoDescricao}>{"Solicitando uma grande parte do sistema muscular, ele também é excelente para o sistema cardiovascular. Ele permite a aquisição de uma boa expansão torácica e, consequentemente, de uma boa capacidade respiratoria"}</Text>
            </View>
        );
    }
}

// 3.1.2 - Leg Press - explicacao dos exercicios: leg press 45

class LegPressScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/leg-press.jpeg')}
                    style={{width: Dimensions.get('window').width*0.800,
                        height: Dimensions.get('window').width*0.336,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Visa fortalecer os músculos das pernas, em particular os quadríceps, glúteos e isquiotibiais. Ele é realizado em uma máquina específica,que permite levantar pesos de maneira controlada."}</Text>
            </View>
        );
    }
}

// 3.1.3 - Extensora - explicacao dos exercicios: extensora sentado, extensora deitado

class ExtensoraScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/cadeira-extensora.png')}
                    style={{width: Dimensions.get('window').width*0.800,
                        height: Dimensions.get('window').width*0.550,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Visa fortalecer os músculos das coxas, principalmente os quadríceps, que são os músculos localizados na parte da frente das pernas. Este exercício também trabalha os músculos dos glúteos e da panturrilha de forma secundária."}</Text>
            </View>
        );
    }
}

// 3.1.4 - Flexora - explicacao dos exercicios: flexora

class FlexoraScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/mesa-flexora.jpg')}
                    style={{width: Dimensions.get('window').width*1,
                        height: Dimensions.get('window').width*0.541,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Visa Fortalecer os músculos da porção posterior da coxa. Os principais agonistas deste exercício são: bíceps femoral, semitendinoso, semimembranoso e gastrocnêmio."}</Text>
            </View>
        );
    }
}

// 3.1.5 - Panturrilha - explicacao dos exercicios: panturrilha

class PanturrilhaScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/panturrilha.png')}
                    style={{width: Dimensions.get('window').width*0.976,
                        height: Dimensions.get('window').width*0.549,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Esse exercício é realizado sentado em um banco com os pesos sobre as pernas. É uma ótima opção para trabalhar o músculo sóleo, que é localizado na parte inferior da panturrilha."}</Text>
            </View>
        );
    }
}

// 3.2 - Braço - botoes por exercicio: rosca direta, rosca alternada, rosca martelo, tríceps testa, tríceps coice, tríceps corda

class BracoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("RoscaDireta")}>
                    <Text style={estilo.botaoTexto2}>{"Rosca Direta"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("RoscaAlternada")}>
                    <Text style={estilo.botaoTexto2}>{"Rosca Alternada"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("RoscaMartelo")}>
                    <Text style={estilo.botaoTexto2}>{"Rosca Martelo"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("TricepsTesta")}>
                    <Text style={estilo.botaoTexto2}>{"Tríceps Testa"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("TricepsCoice")}>
                    <Text style={estilo.botaoTexto2}>{"Tríceps Coice"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("TricepsCorda")}>
                    <Text style={estilo.botaoTexto2}>{"Tríceps Corda"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// 3.2.1 - Rosca Direta - explicacao dos exercicios: rosca direta

class RoscaDiretaScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/rosca-direta.jpg')}
                    style={{width: Dimensions.get('window').width*0.900,
                        height: Dimensions.get('window').width*0.565,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um exercício que deve ser feito movendo a articulação do cotovelo, ocorrendo a flexão de cotovelo. Em pé, com os pés afastados dos ombros e joelhos pouco flexionados, segure a barra com os cotovelos esticados, contraindo o bíceps com o final do movimento e o cotovelo todo flexionado."}</Text>
            </View>
        );
    }
}

// 3.2.2 - Rosca Alternada - explicacao dos exercicios: rosca alternada

class RoscaAlternadaScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/rosca-alternada.jpg')}
                    style={{width: Dimensions.get('window').width*0.960,
                        height: Dimensions.get('window').width*0.856,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um exercício único para construir massa muscular no bíceps, pois permite que cada braço trabalhe de forma individual e um de cada vez"}</Text>
            </View>
        );
    }
}

// 3.2.3 - Rosca Martelo - explicacao dos exercicios: rosca martelo

class RoscaMarteloScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/rosca-martelo.jpg')}
                    style={{width: Dimensions.get('window').width*0.940,
                        height: Dimensions.get('window').width*0.547,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Tem como objetivo principal fortalecer e desenvolver os músculos do bíceps braquial. Além disso, também auxilia no fortalecimento dos músculos braquial e braquiorradial."}</Text>
            </View>
        );
    }
}

// 3.2.4 - Tríceps Testa - explicacao dos exercicios: tríceps testa

class TricepsTestaScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/triceps-testa.jpg')}
                    style={{width: Dimensions.get('window').width*0.823,
                        height: Dimensions.get('window').width*0.661,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Envolve realizar a extensão dos cotovelos deitado em um banco com os braços em frente ao corpo. Enquanto este posicionamento permite ótimo recrutamento da musculatura do tríceps, é possível também gerar grande estresse nas articulações dos cotovelos."}</Text>
            </View>
        );
    }
}

// 3.2.5 - Tríceps Coice - explicacao dos exercicios: tríceps coice

class TricepsCoiceScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/triceps-coice.jpg')}
                    style={{width: Dimensions.get('window').width*0.960,
                        height: Dimensions.get('window').width*0.627,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Possui algumas variações. Ele pode ser feito com um braço por vez, ou com os dois simultâneos. Também é possível realizá-lo no cabo, o que muda significativamente o braço de resistência e função do exercício."}</Text>
            </View>
        );
    }
}

// 3.2.6 - Tríceps Corda - explicacao dos exercicios: tríceps corda cross, tríceps corda polia

class TricepsCordaScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/triceps-corda.jpg')}
                    style={{width: Dimensions.get('window').width*0.996,
                        height: Dimensions.get('window').width*0.623,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um exercício de musculação que trabalha o isolamento da parte de trás do braço, por meio da extensão do cotovelo, e atua em três partes do tríceps ou tríceps braquial, com a cabeça medial, longa e, principalmente, a lateral."}</Text>
            </View>
        );
    }
}

// 3.3 - Peito - botoes por exercicio: supino reto, supino inclinado, supino declinado, crucifixo, crossover

class PeitoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("SupinoReto")}>
                    <Text style={estilo.botaoTexto2}>{"Supino Reto"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("SupinoInclinado")}>
                    <Text style={estilo.botaoTexto2}>{"Supino Inclinado"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("SupinoDeclinado")}>
                    <Text style={estilo.botaoTexto2}>{"Supino Declinado"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Crucifixo")}>
                    <Text style={estilo.botaoTexto2}>{"Crucifixo"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Crossover")}>
                    <Text style={estilo.botaoTexto2}>{"Crossover"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// 3.3.1 - Supino Reto - explicacao dos exercicios: supino reto barra, supino reto halteres

class SupinoRetoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/supino-reto.png')}
                    style={{width: Dimensions.get('window').width*0.850,
                        height: Dimensions.get('window').width*0.827,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Consiste essencialmente em uma flexão de ombro horizontal seguida por uma extensão de cotovelo — movimentos potencializados pela carga na barra. Os três principais músculos recrutados são o peitoral maior, tríceps braquial e deltóide."}</Text>
            </View>
        );
    }
}

// 3.3.2 - Supino Inclinado - explicacao dos exercicios: supino inclinado barra, supino inclinado halteres

class SupinoInclinadoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/supino-inclinado.png')}
                    style={{width: Dimensions.get('window').width*0.883,
                        height: Dimensions.get('window').width*0.739,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um dos exercícios mais comuns praticados no treinamento de força, visando desenvolvimento do tronco superior."}</Text>
            </View>
        );
    }
}

// 3.3.3 - Supino Declinado - explicacao dos exercicios: supino declinado barra, supino declinado halteres

class SupinoDeclinadoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/supino-declinado.jpg')}
                    style={{width: Dimensions.get('window').width*0.840,
                        height: Dimensions.get('window').width*0.840,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um dos exercícios mais comuns praticados no treinamento de força, serve para trabalhar a porção inferior do peitoral."}</Text>
            </View>
        );
    }
}

// 3.3.4 - Crucifixo - explicacao dos exercicios: crucifixo halteres, crucifixo cross

class CrucifixoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/crucifixo.jpg')}
                    style={{width: Dimensions.get('window').width*0.800,
                        height: Dimensions.get('window').width*0.800,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É uma boa opção para quem busca hipertrofia ou uma maior definição do peito. Isso porque os movimentos de adução e abdução dos ombros (abrir e fechar) propostos pelo exercício têm um efeito bastante focado no principal músculo da região, o peitoral maior, contribuindo para um resultado ainda melhor."}</Text>
            </View>
        );
    }
}

// 3.3.5 - Crossover - explicacao dos exercicios: crossover polia, crossover cross

class CrossoverScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/Crossover.jpg')}
                    style={{width: Dimensions.get('window').width*0.820,
                        height: Dimensions.get('window').width*0.724,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É uma boa opção para quem busca hipertrofia ou uma maior definição do peito. Isso porque os movimentos de adução e abdução dos ombros (abrir e fechar) propostos pelo exercício têm um efeito bastante focado no principal músculo da região, o peitoral maior, contribuindo para um resultado ainda melhor."}</Text>
            </View>
        );
    }
}

// 3.4 - Costas - botoes por exercicio: puxada frontal, puxada costas, remada baixa, remada alta
class CostasScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("PuxadaFrontal")}>
                    <Text style={estilo.botaoTexto2}>{"Puxada Frontal"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("PuxadaCostas")}>
                    <Text style={estilo.botaoTexto2}>{"Puxada Costas"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("RemadaBaixa")}>
                    <Text style={estilo.botaoTexto2}>{"Remada Baixa"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("RemadaAlta")}>
                    <Text style={estilo.botaoTexto2}>{"Remada Alta"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// 3.4.1 - Puxada Frontal - explicacao dos exercicios: puxada frontal barra, puxada frontal polia

class PuxadaFrontalScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/puxada-frontal.jpg')}
                    style={{width: Dimensions.get('window').width*0.800,
                        height: Dimensions.get('window').width*0.600,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um exercício que como o nome mesmo diz trabalha os músculos dorsais, a região das costas. Os músculos envolvidos são latíssimo do dorso, deltóide posterior, trapézio inferior e rombóides."}</Text>
            </View>
        );
    }
}

// 3.4.2 - Puxada Costas - explicacao dos exercicios: puxada costas barra, puxada costas polia

class PuxadaCostasScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Text style={estilo.title}>{"Puxada Costas!"}</Text>
                <Image
                    source={require('./assets/puxada-costas.jpg')}
                    style={{width: Dimensions.get('window').width*0.800,
                        height: Dimensions.get('window').width*0.645,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"A puxada recruta vários músculos importantes das costas, ombros e braços. Os músculos latissimus dorsi, ou dorsais, são “os músculos das asas”."}</Text>
            </View>
        );
    }
}

// 3.4.3 - Remada Baixa - explicacao dos exercicios: remada baixa barra, remada baixa polia

class RemadaBaixaScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/remada-baixa.png')}
                    style={{width: Dimensions.get('window').width*0.918,
                        height: Dimensions.get('window').width*0.634,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um exercício com o objetivo de trabalhar os músculos dorsais, no entanto, outros músculos, como os flexores do cotovelo, têm participação significativa. A variação do exercício ocorre apenas na posição do antebraço, podendo ser supinada, neutra e pronada."}</Text>
            </View>
        );
    }
}

// 3.4.4 - Remada Alta - explicacao dos exercicios: remada alta barra, remada alta polia

class RemadaAltaScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/remada-alta.jpg')}
                    style={{width: Dimensions.get('window').width*0.824,
                        height: Dimensions.get('window').width*0.992,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Trabalha as partes frontal e média dos deltóides (músculos do ombro). Este exercício também ajuda a construir o trapézio e os rombóides (músculos no meio e na parte superior das costas) e até mesmo os bíceps. "}</Text>
            </View>
        );
    }
}

// 3.5 - Ombro - botoes por exercicio: desenvolvimento, elevação lateral, elevação frontal, elevação posterior, encolhimento

class OmbroScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Desenvolvimento")}>
                    <Text style={estilo.botaoTexto2}>{"Desenvolvimento"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("ElevacaoLateral")}>
                    <Text style={estilo.botaoTexto2}>{"Elevação Lateral"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("ElevacaoFrontal")}>
                    <Text style={estilo.botaoTexto2}>{"Elevação Frontal"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("ElevacaoPosterior")}>
                    <Text style={estilo.botaoTexto2}>{"Elevação Posterior"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Encolhimento")}>
                    <Text style={estilo.botaoTexto2}>{"Encolhimento"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// 3.5.1 - Desenvolvimento - explicacao dos exercicios: desenvolvimento barra, desenvolvimento halteres

class DesenvolvimentoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/desenvolvimento.jpg')}
                    style={{width: Dimensions.get('window').width*0.800,
                        height: Dimensions.get('window').width*0.666,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É o exercício mais importante para o desenvolvimento do deltoide – o músculo responsável por movimentar e estabilizar a articulação do ombro."}</Text>
            </View>
        );
    }
}

// 3.5.2 - Elevação Lateral - explicacao dos exercicios: elevação lateral halteres, elevação lateral cross

class ElevacaoLateralScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/elevacao-lateral.jpg')}
                    style={{width: Dimensions.get('window').width*0.930,
                        height: Dimensions.get('window').width*0.608,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"A abdução de ombros ou elevação lateral é um excelente exercício para fortalecer e hipertrofiar a musculatura dos ombros. Com o fortalecimento dessa região, esse exercício contribui na prevenção de lesões, pois auxilia na estabilidade dessa articulação."}</Text>
            </View>
        );
    }
}

// 3.5.3 - Elevação Frontal - explicacao dos exercicios: elevação frontal halteres, elevação frontal cross

class ElevacaoFrontalScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/elevacao-frontal.jpg')}
                    style={{width: Dimensions.get('window').width*0.740,
                        height: Dimensions.get('window').width*1,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um exercício isolado que isola a flexão do ombro. Atua principalmente no deltóide anterior, com assistência do serrátil anterior, do bíceps braquial e das partes claviculares do peitoral maior."}</Text>
            </View>
        );
    }
}

// 3.5.4 - Elevação Posterior - explicacao dos exercicios: elevação posterior halteres, elevação posterior cross

class ElevacaoPosteriorScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/elevacao-posterior.jpg')}
                    style={{width: Dimensions.get('window').width*0.880,
                        height: Dimensions.get('window').width*0.466,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Os halteres são levantados pela abdução transversa do ombro, não pela rotação externa nem pela extensão. A parte superior dos braços deverá viajar num caminho perpendicular ao torso de forma a minimizar o envolvimento do grande dorsal. O banco deverá estar suficientemente alto para que os halteres não toquem no chão. Ficar deitado a 45° não é um ângulo suficiente para permitir trabalhar a parte posterior do deltoide."}</Text>
            </View>
        );
    }
}

// 3.5.5 - Encolhimento - explicacao dos exercicios: encolhimento halteres, encolhimento barra

class EncolhimentoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/encolhimento.jpg')}
                    style={{width: Dimensions.get('window').width*0.600,
                        height: Dimensions.get('window').width*0.750,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um exercício com amplitude muito limitada, ao usar carga demais inevitavelmente acabamos por realizar o exercício de forma rápida e abrimos espaço para vários erros de execução."}</Text>
            </View>
        );
    }
}

// 3.6 - Abdômen - botoes por exercicio: abdominal, prancha, elevação de pernas, elevação de tronco

class AbdomenScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Abdominal")}>
                    <Text style={estilo.botaoTexto2}>{"Abdominal"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("Prancha")}>
                    <Text style={estilo.botaoTexto2}>{"Prancha"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("ElevacaoPernas")}>
                    <Text style={estilo.botaoTexto2}>{"Elevação de Pernas"}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={estilo.botaoM} onPress={() => this.props.navigation.navigate("ElevacaoTronco")}>
                    <Text style={estilo.botaoTexto2}>{"Elevação de Tronco"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// 3.6.1 - Abdominal - explicacao dos exercicios: abdominal reto, abdominal oblíquo

class AbdominalScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/abdominal.jpg')}
                    style={{width: Dimensions.get('window').width*0.950,
                        height: Dimensions.get('window').width*0.655,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um tipo de exercício físico para desenvolver e fortalecer a musculatura do abdômen, trabalhando os principais pontos do tórax, principalmente do músculo reto."}</Text>
            </View>
        );
    }
}

// 3.6.2 - Prancha - explicacao dos exercicios: prancha frontal, prancha lateral

class PranchaScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/prancha.jpg')}
                    style={{width: Dimensions.get('window').width*0.950,
                        height: Dimensions.get('window').width*0.450,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É um excelente exercício para fortalecer o chamado grupamento do core, e auxilia principalmente na postura e no desempenho esportivo. Esse exercício atua em mais de 28 pares de músculos, que envolvem abdômen e quadris. A prancha ainda é ótima para o equilíbrio."}</Text>
            </View>
        );
    }
}

// 3.6.3 - Elevação de Pernas - explicacao dos exercicios: elevação de pernas reto, elevação de pernas oblíquo

class ElevacaoPernasScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/elevacao-de-pernas.jpg')}
                    style={{width: Dimensions.get('window').width*0.900,
                        height: Dimensions.get('window').width*0.600,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"Este exercício consiste em elevar bem as pernas da posição de deitado de barriga para cima ou então pendurados de uma barra.Produz-se uma flexão de anca ao elevar as pernas mantendo as pernas juntas e a coluna o mais estável e reta possíve.A musculatura abdominal deve manter-se fortemente ativa para estabilizar a coluna, e a respiração e ativação do transverso profundo do abdómen devem trabalhar de maneira sinérgica para uma correta gestão das pressões, evitando empurrar em excesso e para fora o reto abdominal."}</Text>
            </View>
        );
    }
}

// 3.6.4 - Elevação de Tronco - explicacao dos exercicios: elevação de tronco reto, elevação de tronco oblíquo

class ElevacaoTroncoScreen extends React.Component {
    render() {
        return (
            <View style={estilo.container}>
                <Image
                    source={require('./assets/elevacao-de-tronco.jpg')}
                    style={{width: Dimensions.get('window').width*0.900,
                        height: Dimensions.get('window').width*0.582,alignSelf: 'center',
                        marginTop: 10}}></Image>
                <Text style={estilo.textoDescricao}>{"É uma variação avançada da elevação de pernas normal.É um exercício de musculação que treina os principais músculos do abdômen, o que inclui o reto do abdômen - o músculo frontal - e os oblíquos interno e externo - os músculos laterais."}</Text>
            </View>
        );
    }
}

// 4 - Passos - contador de passos

function Passos() {
    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [pastStepCount, setPastStepCount] = useState(0);
    const [currentStepCount, setCurrentStepCount] = useState(0);

    // Verifica se o contador de passos está disponível
    const subscribe = async () => {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(isAvailable));

        if (isAvailable) { // Se estiver disponível, conta os passos
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 1);

            const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
            if (pastStepCountResult) { // Se houver passos nas últimas 24 horas, mostra o número de passos
                setPastStepCount(pastStepCountResult.steps);
            }

            return Pedometer.watchStepCount(result => { // Mostra o número de passos atual
                setCurrentStepCount(result.steps);
            });
        }
    };

    useEffect(() => { // Inicia a contagem de passos
        let subscription;
        const _subscribe = async () => {
            subscription = await subscribe();
        };

        _subscribe(); 
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    return (
        <View style={estilo.container}>
            <Text style={estilo.textContador}>{"Contador de Passos"}</Text>
            <Text style={estilo.medidas24h}>{"Numero de passos nas ultimas 24 horas:"} {pastStepCount}</Text>
            <Text style={estilo.atual}>{"Vamos! Hoje é dia de se superar!"}</Text>
            <Text style={estilo.atual}>{"Numero de passos:"} {currentStepCount}</Text>
        </View>
    );
}

// 5 - Sobre

class SobreScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={estilo.container}>
                <Text style={estilo.texto}>{"Projeto de Computação Móvel"}</Text>
                <Text style={estilo.textoSobre}>{"WIKI FITNESS - APP"}</Text>
                <Text style={estilo.textoSobre}>{"Desenvolvido por:"}</Text>
                <Text style={estilo.textoSobre}>{"Ruan Pastrelo Turola"}</Text>
                <Text style={estilo.textoSobre}>{"RA: 24.122.050-8"}</Text>
                <Text style={estilo.textoSobre}>{"unifrturola@fei.edu.br"}</Text>
                <TouchableOpacity style={estilo.botao} onPress={() => this.props.navigation.popToTop()}>
                    <Text style={estilo.botaoTexto}>{"Sair"}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// Estilos

const estilo = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center'
    },
    input: {
        width: '80%',
        borderColor: '#000',
        borderWidth: 1,
        marginTop: 10,
        borderRadius: 10,
        padding: 15,
        textAlign: 'center'
    },
    botao: {
        backgroundColor: '#000',
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 10
    },
    botaoM: {
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        padding: 10,
        width: 300,
        height: 50,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 5,
        marginTop: 10,
    },
    botaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    botaoTexto2: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center'

    },
    texto: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    textContador: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    medidas24h: {
        marginTop: 15,
        fontSize: 15,
    },
    atual: {
        marginTop: 15,
        fontSize: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10
    },
    textoDescricao: {
        fontSize: 15,
        textAlign: 'justify',
        marginTop: 10
    },
    textoSobre: {
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10
    }
});

// Navegacao

export default class App extends React.Component { 
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Login" component={NavTab} options={{ headerShown: false }} />
                    <Stack.Screen name="Home" component={NavTab2} options={{ headerShown: false }}/>
                    <Stack.Screen name="Perna" component={PernaScreen}/>
                    <Stack.Screen name="Agachamento" component={AgachamentoScreen}/>
                    <Stack.Screen name="LegPress" component={LegPressScreen} options={{ title: 'Leg Press' }}/>
                    <Stack.Screen name="Extensora" component={ExtensoraScreen}/>
                    <Stack.Screen name="Flexora" component={FlexoraScreen}/>
                    <Stack.Screen name="Panturrilha" component={PanturrilhaScreen}/>
                    <Stack.Screen name="Braco" component={BracoScreen}/>
                    <Stack.Screen name="RoscaDireta" component={RoscaDiretaScreen} options={{ title: 'Rosca Direta' }}/>
                    <Stack.Screen name="RoscaAlternada" component={RoscaAlternadaScreen} options={{ title: 'Rosca Alternada' }}/>
                    <Stack.Screen name="RoscaMartelo" component={RoscaMarteloScreen} options={{ title: 'Rosca Martelo' }}/>
                    <Stack.Screen name="TricepsTesta" component={TricepsTestaScreen} options={{ title: 'Triceps Testa' }}/>
                    <Stack.Screen name="TricepsCoice" component={TricepsCoiceScreen} options={{ title: 'Triceps Coice' }}/>
                    <Stack.Screen name="TricepsCorda" component={TricepsCordaScreen} options={{ title: 'Triceps Corda' }}/>
                    <Stack.Screen name="Peito" component={PeitoScreen}/>
                    <Stack.Screen name="SupinoReto" component={SupinoRetoScreen} options={{ title: 'Supino Reto' }}/>
                    <Stack.Screen name="SupinoInclinado" component={SupinoInclinadoScreen} options={{ title: 'Supino Inclinado' }}/>
                    <Stack.Screen name="SupinoDeclinado" component={SupinoDeclinadoScreen} options={{ title: 'Supino Declinado' }}/>
                    <Stack.Screen name="Crucifixo" component={CrucifixoScreen}/>
                    <Stack.Screen name="Crossover" component={CrossoverScreen}/>
                    <Stack.Screen name="Costas" component={CostasScreen}/>
                    <Stack.Screen name="PuxadaFrontal" component={PuxadaFrontalScreen} options={{ title: 'Puxada Frontal' }}/>
                    <Stack.Screen name="PuxadaCostas" component={PuxadaCostasScreen} options={{ title: 'Puxada Costas' }}/>
                    <Stack.Screen name="RemadaBaixa" component={RemadaBaixaScreen} options={{ title: 'Remada Baixa' }}/>
                    <Stack.Screen name="RemadaAlta" component={RemadaAltaScreen} options={{ title: 'Remada Alta' }}/>
                    <Stack.Screen name="Ombro" component={OmbroScreen}/>
                    <Stack.Screen name="Desenvolvimento" component={DesenvolvimentoScreen}/>
                    <Stack.Screen name="ElevacaoLateral" component={ElevacaoLateralScreen} options={{ title: 'Elevacao Lateral' }}/>
                    <Stack.Screen name="ElevacaoFrontal" component={ElevacaoFrontalScreen} options={{ title: 'Elevacao Frontal' }}/>
                    <Stack.Screen name="ElevacaoPosterior" component={ElevacaoPosteriorScreen} options={{ title: 'Elevacao Posterior' }}/>
                    <Stack.Screen name="Encolhimento" component={EncolhimentoScreen}/>
                    <Stack.Screen name="Abdomen" component={AbdomenScreen}/>
                    <Stack.Screen name="Abdominal" component={AbdominalScreen}/>
                    <Stack.Screen name="Prancha" component={PranchaScreen}/>
                    <Stack.Screen name="ElevacaoPernas" component={ElevacaoPernasScreen} options={{ title: 'Elevacao Pernas' }}/>
                    <Stack.Screen name="ElevacaoTronco" component={ElevacaoTroncoScreen} options={{ title: 'Elevacao Tronco' }}/>
                    <Stack.Screen name="Passos" component={Passos}/>
                    <Stack.Screen name="Sobre" component={SobreScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}